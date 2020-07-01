import React, { useState } from 'react'
import { Button, Input, DatePicker, Form, Space  } from 'antd'

import './EditTrip.css'

import LocationSelect from './LocationSelect.js';
import S3Upload from './S3Upload.js'

const EditTrip = props => {
    const uploadFldName = 'files'
    
    const latLngDelim = ','
    const hiddenSuffix = '_hidden'
    
    const locationFldNames = [
        {
            fmtAddr: 'loc0',
            latLng: 'loc0' + hiddenSuffix,
        },
        {
            fmtAddr: 'loc1',
            latLng: 'loc1' + hiddenSuffix,
        },
        {
            fmtAddr: 'loc2',
            latLng: 'loc2' + hiddenSuffix,
        },
    ]

    const getInitialFormValues = () => {
        if (props.editTrip){
            let initialValues = {
                title: existingTrip.title,
                dates: [existingTrip.startDate, existingTrip.endDate],
                details: existingTrip.details,            
            }
            const locInitialValues = getInitialLocValues(existingTrip.locations)
            initialValues = {...initialValues, ...locInitialValues}
            
            return initialValues
        }

        return {}
    }

    const getInitialLocValues = (existingLocations) => {
        let initialValues = {}

        for(let i=0; i<existingLocations.length; i++){
            initialValues[locationFldNames[i].fmtAddr] = existingLocations[i].fmtAddr
            initialValues[locationFldNames[i].latLng] = existingLocations[i].latLng[0] + latLngDelim + existingLocations[i].latLng[1]
        }

        return initialValues
    }

    const onFinish = values => {
        let counter = 0
        let locationData = []
        
        // Get location data
        if (values[locationFldNames[0].latLng]){
            locationData[counter] = {
                fmtAddr: values[locationFldNames[0].fmtAddr],
                latLng: values[locationFldNames[0].latLng].split(latLngDelim).map((coordinate) =>{
                    return parseFloat(coordinate)
                }),
            }
            counter++
        }
        if (values[locationFldNames[1].latLng]){
            locationData[counter] = {
                fmtAddr: values[locationFldNames[1].fmtAddr],
                latLng: values[locationFldNames[1].latLng].split(latLngDelim).map((coordinate) =>{
                    return parseFloat(coordinate)
                }),
            }
            counter++
        }
        if (values[locationFldNames[2].latLng]){
            locationData[counter] = {
                fmtAddr: values[locationFldNames[2].fmtAddr],
                latLng: values[locationFldNames[2].latLng].split(latLngDelim).map((coordinate) =>{
                    return parseFloat(coordinate)
                }),
            }
            counter++
        }

        // Get image upload data
        const imageInfoData = []
        const uploadFiles = values[uploadFldName]
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

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 10, },
    }
    const tailLayout = {
        wrapperCol: { offset: 8, span: 12 }
    }

    const [form] = Form.useForm()
    const existingTrip = props.editTrip
    let btnName = (existingTrip) ? 'Update' : 'Submit'

    return (
        <Form
            form={form}
            {...layout}
            initialValues={getInitialFormValues()}
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

                <LocationSelect form={form} editTrip={existingTrip} />

                <S3Upload form={form} fieldName={uploadFldName} editTrip={existingTrip} />

                <Form.Item
                    {...tailLayout} >
                        <Space>
                            <Button type="primary" htmlType="submit">{btnName}</Button>
                            {existingTrip && 
                                <Button type="link" onClick={onCancel}>Cancel</Button>
                            }
                        </Space>
                </Form.Item>
        </Form>
    )
}

export default EditTrip