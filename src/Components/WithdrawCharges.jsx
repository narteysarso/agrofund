import { Button, Form, Input, Modal, Popconfirm, Space } from "antd";
import { useState } from "react";
import { AgroFundConsumer } from "../Context/AgrofundContract";


const WithdrawChargesForm = ({ onReset }) => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [form] = Form.useForm();
    return (
        <AgroFundConsumer>
            {({ withdrawContractCharges }) =>
                <Form
                    initialValues={{toAddress: ""}}
                    onReset={onReset}
                    form={form}
                    onFinish={async (values) => {
                        try {
                            setLoading(true);
                            await withdrawContractCharges(values.toAddress);
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
                                title="This will withdraw funds from the contract. Do you wish to proceed?"
                                okText="Yes"
                                onConfirm={() => form.submit() }
                            >
                                <Button htmlType="submit" type="primary" loading={isLoading}>Withdraw Service Charges</Button>
                            </Popconfirm>
                        </Space>
                    </Form.Item>
                </Form>
            }
        </AgroFundConsumer>
    )
}

export default function WithdrawChargesModal() {
    return (
        <AgroFundConsumer>
            {({ withdrawCharges, setWithdrawCharges }) => (
                <Modal
                    title={`Withdraw Service Charges`}
                    onCancel={() => setWithdrawCharges(false)}
                    visible={withdrawCharges}
                    footer={null}
                >
                    <WithdrawChargesForm onReset={setWithdrawCharges.bind(this, false)} />
                </Modal>
            )}
        </AgroFundConsumer>

    )
}