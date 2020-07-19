import React, { useState, useEffect } from 'react'
import { Button, Input, DatePicker, Checkbox, Form, Space, Spin, Row, Col, Typography  } from 'antd'
import { Prompt } from 'react-router-dom'
import history from '../../services/history'
import LocationSelect from '../LocationSelect'
import S3Upload from '../S3Upload'
import useTripCreateUpdate from './helpers/useTripCreateUpdate'

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
            props.clearEditTrip()
        }
    }, [])

    const { savingInProgress, createTrip, updateTrip } = useTripCreateUpdate()

    const titleMaxLength = 40
    const detailsMaxLength = 1000
    const listName = 'locationList'
    const latLngDelim = ','
    const uploadFldName = 'files'
    const msgColLayoutSides = {
        xs: { span: 0 },
        sm: { span: 2 },
        md: { span: 3 },
        lg: { span: 4 },
        xl: { span: 5 },
        xxl: { span: 6 }
    }
      const msgColLayoutContent = {
        xs: { span: 24 },
        sm: { span: 20 },
        md: { span: 18 },
        lg: { span: 16 },
        xl: { span: 14 },
        xxl: { span: 12 }
    }

    const formLayout = {
        labelCol: {
            sm: { span: 5 },
            md: { offset: 0, span: 5 },
            lg: { offset: 1, span: 5 },
            xl: { offset: 2, span: 5 },
            xxl: { offset: 3, span: 5 },
        },
        wrapperCol: {
            sm: { span: 19 },
            md: { span: 16 },
            lg: { span: 12 },
            xl: { span: 10 },
            xxl: { span: 8 },
        }
      }
    const formTailLayout = {
        wrapperCol: {
            sm: { offset: 5 , span: 19 },
            md: { offset: 5 , span: 16 },
            lg: { offset: 6, span: 12 },
            xl: { offset: 7, span: 10 },
            xxl: { offset: 8, span: 8 },
        }
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
                public: existingTrip.public,
                [listName]: initialLocations,
            }
            
            return initialValues
        }

        return {}
    }

    const onFinish = values => {
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
            startDate: values.dates[0].startOf('day'),
            endDate: values.dates[1].startOf('day'),
            public: (values.public) ? true : false,
            details: values.details,
            locations: locationData,
            images: imageInfoData,
        }
        if (props.editTrip){
            handleUpdate(tripData, props.editTrip._id)
        }
        else{
            handleSubmit(tripData)
        }
    }

    const onCancel = () => {
        props.clearEditTrip()
        history.push('/myTrips')
    }

    const handleSubmit = async (trip) => {
        const res = await createTrip(trip)
        if(res){
            setShowNavPrompt(false)
            history.push('/myTrips')
        }
    }
    const handleUpdate = async (updatedTrip, tripId) => {
        await updateTrip(updatedTrip, tripId)
        
        props.clearEditTrip()
        setShowNavPrompt(false)
        history.push('/myTrips')
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
            spinning={savingInProgress} >
            <Prompt
                when={showNavPrompt}
                message="You may have unsaved changes, are you sure you want to leave the page?" />
            <Row
                gutter={[0, 8]}
                justify="start" >
                <Col {...msgColLayoutSides} />
                <Col {...msgColLayoutContent}>
                    <Typography.Title>{greetingMsg((existingTrip) ? true:  false)}</Typography.Title>
                </Col>
                <Col {...msgColLayoutSides}/>
            </Row>
            <Form
                form={form}
                //{...layout}
                {...formLayout}
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
                        <Input maxLength={titleMaxLength} />
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
                        //{...tailLayout}
                        {...formTailLayout}
                        name="public"
                        valuePropName="checked" >
                            <Checkbox>Allow public access</Checkbox>
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
                            autoSize={ {minRows:4, maxRows:20} }
                            maxLength={detailsMaxLength} />
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
                        //{...tailLayout}
                        {...formTailLayout} >
                            <Space>
                                <Button type="primary" htmlType="submit">{btnName}</Button>
                                <Button type="link" onClick={onCancel}>Cancel</Button>
                            </Space>
                    </Form.Item>
            </Form>
        </Spin>
    )
}

const greetingMsg = (editTrip) => {
    if (editTrip){
        return "What has changed?"
    }
    return "It's time to put one down in the books"
}

export default EditTrip