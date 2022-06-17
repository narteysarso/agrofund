import { Button, Form, Input, InputNumber, Modal, Space } from "antd";
import { useState } from "react";
import { AgroFundConsumer } from "../Context/AgrofundContract";


const FundProjectForm = ({ project_index, onReset }) => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [form] = Form.useForm();
    return (
        <AgroFundConsumer>
            {({ fundProjectOnContract, fundProject }) =>
                <Form
                    initialValues={{ index: project_index, amount: 0.01 }}
                    onReset={onReset}
                    form={form}
                    onFinish={async (values) => {
                        try {
                            setLoading(true);
                            await fundProjectOnContract(values.index, values.amount);
                            form.resetFields();
                        
                        } catch (error) {
                            setError(error.message)
                        }finally{
                            setLoading(false);
                        }
                        
                    }}
                >
                    <Form.Item
                        name="index"
                        hidden={true}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="amount"
                        label="Amount"
                        tooltip="How much do you intend to fund?"
                        rules={[{ required: true, message: 'Please provide a valid amount' }]}
                    >
                        <InputNumber min={0.01} max={1000000} step={0.01} style={{ width: '100%' }} addonAfter="Celo" />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button htmlType="reset" type="default" >Cancel</Button>

                            <Button htmlType="submit" type="primary" loading={isLoading}>Fund</Button>
                        </Space>
                    </Form.Item>
                </Form>
            }
        </AgroFundConsumer>
    )
}

export default function FundProjectModal() {
    return (
        <AgroFundConsumer>
            {({ fundProject, setFundProject }) => (
                <Modal
                    title={`Fund: #${fundProject?.index} ${fundProject?.name} Project`}
                    onCancel={() => setFundProject(null)}
                    visible={!!fundProject}
                    footer={null}
                >
                    <FundProjectForm key={fundProject?.index} onReset={setFundProject.bind(this, null)} project_index={fundProject?.index} />
                </Modal>
            )}
        </AgroFundConsumer>

    )
}