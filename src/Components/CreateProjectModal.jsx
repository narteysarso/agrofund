import { Button, DatePicker, Form, Input, InputNumber, Modal, Space } from "antd";
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

const ProjectForm = ({onReset}) => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [form] = Form.useForm(); 

    
    return (
        <AgroFundConsumer>
            {({createProjectOnContract}) => (
                <Form {...formItemLayout} 
                    onReset = {onReset} 
                    onFinish={async (values) => {
                        try {
                            const startDate = values.dateRange[0].valueOf()
                            const endDate = values.dateRange[1].valueOf()
                            setLoading(true);
                            await createProjectOnContract({...values, startDate, endDate});
                            form.resetFields();
                            
                        } catch (error) {
                            setError(error.message)
                        }finally{
                            setLoading(false);
                        }
                    }}

                    form={form}
                >
                    <Form.Item
                        name="name"
                        label="Project Name"
                        tooltip="What do you this project?"
                        rules={[{ required: true, message: 'Please input a name!', whitespace: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="images"
                        label="Image Url"
                        tooltip="What does your project look like?"
                        rules={[{ required: true, message: 'Please a link to any image!', whitespace: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        tooltip="Tell us about your project?"
                        rules={[{ required: true, message: 'Please describe your project!', whitespace: true }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name="location"
                        label="Project Location"
                        tooltip="Where can you project be found?"
                        rules={[{ required: true, message: 'Please provide a verifiable location', whitespace: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="dateRange"
                        label="Project Duration"
                        tooltip="When will your project start and end?"
                        rules={[{ required: true, message: 'Please select some dates' }]}
                    >
                        <DatePicker.RangePicker />
                    </Form.Item>
                    <Form.Item
                        name="goal"
                        label="Goal"
                        tooltip="How much do you intend to raise?"
                        rules={[{ required: true, message: 'Please provide a valid amount' }]}
                    >
                        <InputNumber min={1} max={1000000} style={{ width: '100%' }} addonAfter="Celo" />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button htmlType="reset" type="default" >Cancel</Button>

                            <Button htmlType="submit" type="primary" loading={isLoading}>Create</Button>
                        </Space>
                    </Form.Item>

                </Form>

            )}
        </AgroFundConsumer>
    )
}


export default function ProjectModal() {

    return (
        <AgroFundConsumer>
            {({projectModal, showProjectModal}) => (
                <Modal
                title="Create a Project"
                visible={projectModal}
                onCancel={() => showProjectModal(false)}
                footer={null}
            >
                <ProjectForm onReset={()=> showProjectModal(false)}/>
            </Modal>
            )}
        </AgroFundConsumer>
    )
}