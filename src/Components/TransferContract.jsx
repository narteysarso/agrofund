import { Button, Form, Input, Modal, Popconfirm, Space } from "antd";
import { useState } from "react";
import { AgroFundConsumer } from "../Context/AgrofundContract";


const TransferOwnershipForm = ({ project_index, onReset }) => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [form] = Form.useForm();
    return (
        <AgroFundConsumer>
            {({ transferOwnershipOfContract }) =>
                <Form
                    initialValues={{toAddress: ""}}
                    onReset={onReset}
                    form={form}
                    onFinish={async (values) => {
                        try {
                            setLoading(true);
                            await transferOwnershipOfContract(values.toAddress);
                            form.resetFields();
                        
                        } catch (error) {
                            
                            setError(error.message)
                        }finally{
                            setLoading(false);
                        }
                        
                    }}
                >
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

export default function TransferOwnershipModal() {
    return (
        <AgroFundConsumer>
            {({ transferOwnership, setTransferOwnership }) => (
                <Modal
                    title={`Transfer Contract Ownership`}
                    onCancel={() => setTransferOwnership(false)}
                    visible={transferOwnership}
                    footer={null}
                >
                    <TransferOwnershipForm onReset={setTransferOwnership.bind(this, false)} />
                </Modal>
            )}
        </AgroFundConsumer>

    )
}