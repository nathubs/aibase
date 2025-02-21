import { Sender, Bubble, Welcome } from "@ant-design/x";
import { Flex, Button, Space, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import {
    uChat,
    BusinessType,
    Conversation,
    UserFormInputType,
    UserFormInputCategory,
    AppMode,
    ChatMessage
} from "@ubt/uchat";
import InputForm from "./components/InputForm";
import { useSearchParams } from "react-router-dom";
import { getAccessToken } from "@/service/llmService";
import "./index.less";
import { barAvatar, PaaSChatMessage, fooAvatar } from "./utils/types";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const stringToAppMode = (str: string) => {
    if (str === 'workflow') {
        return AppMode.WorkFlow;
    } else if (str === 'agent-chat') {
        return AppMode.Agent;
    } else if (str === 'completion') {
        return AppMode.CompletionMessage;
    } else {
        return AppMode.ChatMessage;
    }
}


const CommonPage = () => {
    const [searchParams] = useSearchParams();
    const appId = searchParams.get("id");
    const appName = searchParams.get("name");
    const mode = searchParams.get("mode") as string;
    /** 当前query内容 */
    const [value, setValue] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const divRef = React.useRef<HTMLDivElement>(null);
    /** 当前对话对象 */
    const [conversation, setConversation] = useState<Conversation>();
    /** 聊天记录集合 */
    const [chatMessages, setChatMessages] = useState<PaaSChatMessage[]>([]);
    /** 开场白 */
    const [openingStatement, setOpeningStatement] = useState<string>("");
    /** chatbot 需要的input */
    const [userInputForm, setUserInputForm] = useState<
        Record<UserFormInputCategory, UserFormInputType>[]
    >([]);
    /** 预设表单值 */
    const [userInputValues, setUserInputValues] =
        useState<Record<string, string>>();
    /** 默认建议 */
    const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
    const _loading = useRef(false);
    /** 聊天发送 */
    const onSend = (query: string) => {
        if (loading || _loading.current) {
            return false;
        }
        _loading.current = true;
        conversation?.sendMessage(query, {
            onBefore: () => {
                setLoading(true);
                chatMessages.push({
                    id: new Date().getTime().toString(),
                    content: query,
                    type: "text",
                    sender: "user",
                }, {
                    id: new Date().getTime().toString() + 1,
                    content: "",
                    type: "text",
                    sender: "bot",
                });
                setValue("");
            },
            onProgress(text) {
                const last = chatMessages[chatMessages.length - 1];
                if (last.sender === "bot") {
                    last.content = text;
                } else {
                    chatMessages.push({
                        id: new Date().getTime().toString(),
                        content: text,
                        type: "text",
                        sender: "bot",
                    });
                }
                setChatMessages([...chatMessages])
                // return JSON.parse(JSON.stringify(prev));
            },
            onError(err) {
                console.log("err", err);
                setChatMessages((prev) => {
                    prev[prev.length - 1].content += `[${(err as Error).message}]`;
                    return prev;
                });
                setLoading(false);
                _loading.current = false;
            },
            onFinish(message: ChatMessage) {
                if (message.error === 'aborted') {
                    setChatMessages((prev) => {
                        prev[prev.length - 1].content += `[用户取消]`;
                        return prev;
                    });
                }
                setLoading(false);
                _loading.current = false;
            },
        });
    };

    const onCancel = () => {
        conversation?.destroy();
    };

    /** 预设表单提交 */
    const onUserInputFormSubmit = (inputs: Record<string, string>) => {
        setUserInputValues(inputs);
        // 保存到对象中
        conversation?.setUserInputValues(inputs);
        // 如果是非chat-message类app，则直接开始
        if ((["workflow", "completion"] as string[]).includes(mode)) {
            onSend("");
        }
    };

    /** 点击会话建议 */
    const onSuggest = (question: string) => {
        onSend(question);
    };

    /** 生成对话框 */
    const genBubble = (message: PaaSChatMessage) => {
        const isBotMessage = message.sender === "bot";
        // 如果发送的是空，则不输出
        if (!isBotMessage && !message.content) {
            return null;
        }
        return (
            <Bubble
                placement={message.sender === "bot" ? "start" : "end"}
                key={message.id}
                loading={isBotMessage && !message.content ? loading : false}
                content={
                    message.sender === "bot" ? (
                        <Markdown
                            remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
                            rehypePlugins={[rehypeHighlight, rehypeRaw, rehypeKatex]}
                        >
                            {message.content.replace(/\\\(/g, '$')
                                .replace(/\\\)/g, '$')
                                .replace(/\\\[/g, '$$')
                                .replace(/\\\]/g, '$$')}
                        </Markdown>
                    ) : (
                        message.content
                    )
                }
                avatar={{
                    icon: <UserOutlined />,
                    style: message.sender === "bot" ? fooAvatar : barAvatar,
                }}
            />
        );
    };

    useEffect(() => {
        const accessToken = getAccessToken(appId ?? "");
        const chat = new uChat({
            apiEnv: "dev",
            userId: "test",
            appMode: stringToAppMode(mode),
            requestTimeout: 20 * 1000,
            getHeader: () => {
                return {
                    Authorization: `Bearer ${accessToken}`,
                };
            },
        });

        const conversation_ = chat?.newConversation({
            businessType: BusinessType.Common,
            inputs: {},
        });
        setConversation(conversation_);

        // 获取开场白/预设配置
        chat.getParameters().then(
            (res) => {
                const { opening_statement, user_input_form, suggested_questions } = res;
                setUserInputForm(user_input_form);
                setOpeningStatement(opening_statement);
                setSuggestedQuestions(suggested_questions);
                // 无需预设，直接开始聊天
                if (user_input_form.length === 0) {
                    setUserInputValues({});
                }
            },
            (error) => {
                message.error(error.message);
            }
        );
    }, []);

    // 预设表单设置后，开始聊天
    useEffect(() => {
        if (userInputValues !== undefined) {
            // startChat();
        }
    }, [userInputValues]);

    return (
        <div className="layout">
            <div className="container">
                {!userInputValues && userInputForm.length > 0 && (
                    <InputForm
                        className="chat"
                        userFromInput={userInputForm}
                        onSubmit={onUserInputFormSubmit}
                    />
                )}
                {userInputValues && (
                    <div className="chat">
                        <Welcome
                            icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
                            title={appName}
                            description={
                                <div>
                                    <div>{openingStatement}</div>
                                    <Space>
                                        {suggestedQuestions.map((question) => (
                                            <Button
                                                type="default"
                                                key={question}
                                                onClick={() => onSuggest(question)}
                                            >
                                                {question}
                                            </Button>
                                        ))}
                                    </Space>
                                </div>
                            }
                            style={{ marginBottom: "20px" }}
                        />

                        <div className="chat-conversations">
                            <Flex gap="middle" vertical>
                                {chatMessages.map((message) => genBubble(message))}
                            </Flex>
                        </div>
                        <div>
                            <Flex vertical gap="middle" ref={divRef}>
                                <Sender
                                    loading={loading}
                                    value={value}
                                    onChange={(v) => {
                                        setValue(v);
                                    }}
                                    onSubmit={() => onSend(value)}
                                    onCancel={onCancel}
                                />
                            </Flex>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommonPage;
