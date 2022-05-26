import { Button, Form, Input, Modal, Popconfirm, Space } from "antd";
import { useState } from "react";
import { AgroFundConsumer } from "../Context/AgrofundContract";


const TransferProjectForm = ({ project_index, onReset }) => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [form] = Form.useForm();
    return (
        <AgroFundConsumer>
            {({ transferProjectOwnershipOnContract }) =>
                <Form
                    initialValues={{ index: project_index, toAddress: ""}}
                    onReset={onReset}
                    form={form}
                    onFinish={async (values) => {
                        try {
                            setLoading(true);
                            await transferProjectOwnershipOnContract(values.index, values.toAddress);
                            form.resetFields();
                        
                        } catch (error) {
                            console.log(error);
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
                        name="toAddress"
                        label="To Address"
                        tooltip="Please be sure you address is accurate"
                        rules={[{ required: true, message: 'Please an address ' }]}
                    >
                        <Input style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button htmlType="reset" type="default" >Cancel</Button>
                            <Popconfirm
                                title="Please know that this action is not revokable. Do you wish to proceed?"
                                okText="Yes"
                                onConfirm={() => form.submit() }
                            >
                                <Button htmlType="submit" type="primary" loading={isLoading}>Transfer</Button>
                            </Popconfirm>
                        </Space>
                    </Form.Item>
                </Form>
            }
        </AgroFundConsumer>
    )
}

export default function TransferProjectModal() {
    return (
        <AgroFundConsumer>
            {({ transferProject, setTransferProject }) => (
                <Modal
                    title={`Transfer: #${transferProject?.index} ${transferProject?.name} Project`}
                    onCancel={() => setTransferProject(null)}
                    visible={!!transferProject}
                    footer={null}
                >
                    <TransferProjectForm key={transferProject?.index} onReset={setTransferProject.bind(this, null)} project_index={transferProject?.index} />
                </Modal>
            )}
        </AgroFundConsumer>

    )
}