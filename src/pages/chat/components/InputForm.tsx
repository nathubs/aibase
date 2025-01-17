import { Button, Form, Input, Select } from "antd";
import { UserFormInputType, UserFormInputCategory } from "@ubt/uchat";
const { Option } = Select;

interface IProps {
  userFromInput: Record<UserFormInputCategory, UserFormInputType>[];
  onSubmit: (values: Record<string, string>) => void;
}
const InputForm = (props: IProps) => {
  const { userFromInput, onSubmit } = props;

  const onFinish = (values: any) => {
    onSubmit(values);
  };
  return (
    <Form
      name="wrap"
      labelCol={{ flex: "110px" }}
      onFinish={onFinish}
      labelAlign="left"
      labelWrap
      wrapperCol={{ flex: 1 }}
      colon={false}
      style={{ maxWidth: 600 }}
    >
      {userFromInput.map((item) => {
        const category = Object.keys(item)[0] as UserFormInputCategory;
        const input = item[category];
        const { label, variable, options, required } = input;

        return (
          <Form.Item
            key={variable}
            label={label}
            name={variable}
            rules={[{ required }]}
          >
            {category === "text-input" && <Input />}
            {category === "select" && (
              <Select placeholder={`${label}`} allowClear>
                {options.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
        );
      })}

      <Form.Item label=" ">
        <Button type="primary" htmlType="submit">
          开始对话
        </Button>
      </Form.Item>
    </Form>
  );
};

export default InputForm;
