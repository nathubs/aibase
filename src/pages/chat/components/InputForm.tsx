import { Button, Form, Input, Select, Upload } from 'antd';
import { UserFormInputType, UserFormInputCategory, uChat } from '@ubt/uchat';
import { useRef, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps, FormInstance } from 'antd';
import { getAccessToken } from '@/service/llmService';
import { useSearchParams } from 'react-router-dom';

const { Option } = Select;


interface IProps {
    userFromInput: Record<UserFormInputCategory, UserFormInputType>[],
    onSubmit: (values: Record<string, string>) => void,
    className?: string
}
const InputForm = (props: IProps) => {
    const { userFromInput, onSubmit, className } = props;
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const formRef = useRef<FormInstance>(null);
    const [searchParams] = useSearchParams();
    const appId = searchParams.get('id');

    const onFinish = (values: Record<string, string>) => {
        // console.log('values=', values)
        onSubmit(values);
    };


    const uploadProps: UploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            const accessToken = getAccessToken(appId ?? "");
            const chat = new uChat({
                apiEnv: 'dev',
                userId: 'test',
                getHeader: () => {
                    return {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            });
            chat.uploadFile(file).then(res => {
                formRef.current?.setFieldValue('task', {
                    "type": res.mime_type?.split('/')?.[0],
                    "transfer_method": "local_file",
                    "url": "",
                    "upload_file_id": res.id
                })
            })
            setFileList([file]);

            return false;
        },
        fileList,
        maxCount: 1,
    };

    return <Form
        name="wrap"
        labelCol={{ flex: '110px' }}
        onFinish={onFinish}
        labelAlign="left"
        labelWrap
        wrapperCol={{ flex: 1 }}
        colon={false}
        style={{ maxWidth: 600 }}
        className={className}
        ref={formRef}
    >
        {
            userFromInput.map(item => {
                const category = Object.keys(item)[0] as UserFormInputCategory;
                const input = item[category];
                const { label, variable, options, required } = input;

                return <Form.Item key={variable} label={label} name={variable} rules={[{ required }]}>
                    {category === 'text-input' && <Input />}
                    {category === 'select' && <Select
                        placeholder={`${label}`}
                        allowClear
                    >
                        {options.map(option => <Option key={option} value={option}>{option}</Option>)}
                    </Select>}
                    {category === 'file' && <Upload {...uploadProps} data={{ field: variable }}>
                        <Button icon={<UploadOutlined />}>选择文件</Button>
                    </Upload>}

                </Form.Item>
            })
        }

        <Form.Item label=" ">
            <Button type="primary" htmlType="submit">
                开始对话
            </Button>
        </Form.Item>
    </Form>;
}

export default InputForm;