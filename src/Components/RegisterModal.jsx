import { Button, Form, Input, Modal, Space } from "antd";
import { useState } from "react";
import { AgroFundConsumer } from "../Context/AgrofundContract";

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};

const DEFAULT_FORM_VALUES = {
    username: "",
    image: "",
    portfolio: "",
    description: "",
    addressRecievable: ""
}

const RegistrationForm = ({ onReset, initialValues = {} }) => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [form] = Form.useForm();
    return (
        <AgroFundConsumer>
            {({ account, membership, registerToContract }) =>
                <Form {...formItemLayout}
                    onFinish={async (values) => {
                        try {
                            setLoading(true)
                            await registerToContract(values);
                            form.resetFields();
                        } catch (error) {
                            setError(error.message);
                        } finally {
                            setLoading(false);
                        }

                    }}
                    onReset={onReset}
                    form={form}
                    initialValues={{ ...DEFAULT_FORM_VALUES, addressRecievable: account, ...membership, ...initialValues }}
                >

                    <Form.Item
                        name="username"
                        label="Username"
                        tooltip="What do you want others to call you?"
                        rules={[{ required: true, message: 'Please input your nickname!', whitespace: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="image"
                        label="Image Url"
                        tooltip="What do you look like?"
                        rules={[{ message: 'Please a link to an your image!', whitespace: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="portfolio"
                        label="Portfolio"
                        tooltip="Where can we read about your achievements?"
                        rules={[{ message: 'Please a link to an your works!', whitespace: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        tooltip="What do you think of yourself?"
                        rules={[{ message: 'Please describe yourself!', whitespace: true }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name="addressRecievable"
                        label="Fund Address"
                        tooltip="Where should you funds be sent to?"
                        rules={[{ required: true, message: 'Please provide address for recieving your funds!', whitespace: true }]}
                    >
                        <Input value="qw22121" />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button htmlType="reset" type="default" >Cancel</Button>

                            <Button htmlType="submit" type="primary" loading={isLoading} >Register</Button>
                        </Space>
                    </Form.Item>

                </Form>
            }
        </AgroFundConsumer>
    )
}


export default function RegisterModal() {

    return (
        <AgroFundConsumer>
            {({ registrationModal, showRegistrationModal }) => (
                <Modal
                    title="Member Registration"
                    visible={registrationModal}
                    onCancel={() => showRegistrationModal(false)}
                    footer={null}
                >
                    <RegistrationForm
                        onReset={() => showRegistrationModal(false)}
                    />

                </Modal>
            )}
        </AgroFundConsumer>
    )
}