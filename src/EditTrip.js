import React, { useState } from 'react'
import { Button, Input, DatePicker, Form, Space, Row, Col, Modal  } from 'antd'
import './EditTrip.css'


const EditTrip = props => {
    const [modalShown, setModalShown] = useState(false)
    const [fieldName, setFieldName] = useState('')
    
    const [form] = Form.useForm()
    const existingTrip = props.editTrip
    let btnName = 'Submit'
    if (existingTrip){
        form.setFieldsValue({
            title: existingTrip.title,
            dates: [existingTrip.startDate, existingTrip.endDate],
            details: existingTrip.details,
        })
        btnName = 'Update'
    }

    const onFinish = values => {
        const tripData = {
            title: values.title,
            startDate: values.dates[0],
            endDate: values.dates[1],
            details: values.details,
            location: values.location,
        }
        
        if (props.editTrip){
            props.handleUpdate(tripData, props.editTripId)
        }
        else{
            props.handleSubmit(tripData)
        }
    }
    const onCancel = () => {
        props.handleCancel()
    }

    const openModal = (locFieldName) => {
        setModalShown(true)
        setFieldName(locFieldName)
    }
    const handleModalSubmit = () => {
        setModalShown(false)
        let updatedVal = {}
        updatedVal[fieldName] = "AAAA"
        form.setFieldsValue(updatedVal)
        setFieldName('')
    }
    const handleModalCancel = () => {
        setModalShown(false)
        setFieldName('')
    }

    return (
        <Row>
            <Col span={4} />
            <Col span={16}>
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish} >
            <Form.Item
                label="Trip Title"
                name="title"
                rules={[
                    {
                        required: true,
                        message: 'Please input your trip title.',
                    },
                ]}
                >
                <Input />
            </Form.Item>

            <Form.Item
                label="Date of Trip"
                name="dates"
                rules={[
                    {
                        required: true,
                        message: 'Please input your trip date.',
                    },
                ]} >
                <DatePicker.RangePicker
                    allowClear={true} />
            </Form.Item>
            
            <Form.Item
                label="Details"
                name="details"
                rules={[
                    {
                        required: true,
                        message: 'Pleaes input your trip details.',
                    },
                ]} >
                <Input.TextArea
                    autoSize={ {minRows:4, maxRows:20} } />
            </Form.Item>

            <Form.Item
                label="Location"
            >
                <Form.Item
                    name="location0"
                    noStyle
                >
                    <Input readOnly={true} placeholder="Location" />
                </Form.Item>
                <Button type="link" onClick={() => { openModal("location0") }}>Select location</Button>

                <Form.Item
                    name="location1"
                    noStyle
                >
                    <Input readOnly={true} placeholder="Location" />
                </Form.Item>
                <Button type="link" onClick={() => { openModal("location1") }}>Select location</Button>
                <Form.Item
                    name="location2"
                    noStyle
                >
                    <Input readOnly={true} placeholder="Location" />
                </Form.Item>
                <Button type="link" onClick={() => { openModal("location2") }}>Select location</Button>
            </Form.Item>

            <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">{btnName}</Button>
                        {existingTrip && 
                            <Button type="link" onClick={onCancel}>Cancel</Button>
                        }
                    </Space>
            </Form.Item>
            <Col span={4} />
        </Form>
        </Col>

        </Row>
    )
}

export default EditTrip