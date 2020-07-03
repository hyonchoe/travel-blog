import React, { useState, useEffect } from 'react'
import { Button, Input, DatePicker, Form, Space, Spin  } from 'antd'
import { Prompt } from 'react-router-dom'

import LocationSelect from './LocationSelect.js'
import S3Upload from './S3Upload.js'

const EditTrip = props => {
    const [showNavPrompt, setShowNavPrompt] = useState(true)
    useEffect(() => {
        // For showing prompt on re-loading and closing window
        const handleUnload = (e) => {
            if (showNavPrompt) {
                e.preventDefault();
                e.returnValue = true;
            }
        }
        window.addEventListener('beforeunload', handleUnload)

        return () => {
            window.removeEventListener('beforeunload', handleUnload)
        }
    }, [])


    const listName = 'locationList'
    const latLngDelim = ','
    const uploadFldName = 'files'
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 10, },
    }
    const tailLayout = {
        wrapperCol: { offset: 8, span: 12 }
    }

    const getInitialFormValues = (existingTrip) => {
        // Initial values for upload images are handled inside own component
        if (existingTrip){
            const initialLocations = (existingTrip.locations) ?
                                        existingTrip.locations.slice()
                                        : []
            initialLocations.forEach((loc) => {
                loc.latLng = loc.latLng[0] + latLngDelim + loc.latLng[1]
            })

            const initialValues = {
                title: existingTrip.title,
                dates: [existingTrip.startDate, existingTrip.endDate],
                details: existingTrip.details,
                [listName]: initialLocations,
            }
            
            return initialValues
        }

        return {}
    }

    const onFinish = values => {
        setShowNavPrompt(false)
        // Get location data
        const locationData = []
        const locationList = (values[listName]) ? values[listName] : []
        locationList.forEach((loc) => {
            if(loc.latLng){
                locationData.push({
                    fmtAddr: loc.fmtAddr,
                    latLng: loc.latLng.split(latLngDelim).map((coordinate) =>{
                        return parseFloat(coordinate)
                    }),
                    city: loc.city,
                    state: loc.state,
                    country: loc.country,
                })
            }
        })

        // Get image upload data
        const imageInfoData = []
        const uploadFiles = (values[uploadFldName]) ? values[uploadFldName] : []
        if (uploadFiles){
            if(uploadFiles.fileList){
                uploadFiles.fileList.forEach((file) => {
                    const nameToUrlName = uploadFiles.nameToUrlNameMap
                    if(nameToUrlName && nameToUrlName.hasOwnProperty(file.uid)){
                        const curFileNameInfo = nameToUrlName[file.uid]
                        imageInfoData.push({
                            name: curFileNameInfo.name,
                            fileUrlName: curFileNameInfo.fileUrlName,
                            S3Url: curFileNameInfo.pendingFileUrl,
                        })
                    }
                })
            }
        }

        const tripData = {
            title: values.title,
            startDate: values.dates[0],
            endDate: values.dates[1],
            details: values.details,
            locations: locationData,
            images: imageInfoData,
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

    const [form] = Form.useForm()
    const existingTrip = props.editTrip
    const existingImages = (existingTrip && existingTrip.images) ? existingTrip.images : []
    let btnName = 'Submit'
    let spinTip = 'Submitting the trip'
    if (existingTrip) {
        btnName = 'Update'
        spinTip = 'Updating the trip'
    }

    return (
        <Spin
            tip={spinTip}
            spinning={props.showSpin} >
            <Prompt
                when={showNavPrompt}
                message="You may have unsaved changes, are you sure you want to leave the page?" />
            <Form
                form={form}
                {...layout}
                initialValues={getInitialFormValues(existingTrip)}
                layout="horizontal"
                onFinish={onFinish} >
                    <Form.Item
                        label="Trip Title"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your trip title.',
                            },
                        ]} >
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

                    <LocationSelect
                        form={form}
                        listName={listName}
                        latLngDelim={latLngDelim} />

                    <S3Upload
                        form={form}
                        fieldName={uploadFldName}
                        images={existingImages} />

                    <Form.Item
                        {...tailLayout} >
                            <Space>
                                <Button type="primary" htmlType="submit">{btnName}</Button>
                                <Button type="link" onClick={onCancel}>Cancel</Button>
                            </Space>
                    </Form.Item>
            </Form>
        </Spin>
    )
}

export default EditTrip