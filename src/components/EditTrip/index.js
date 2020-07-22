/**
 * EditTrip component for editing existing trip data or creating new trip
 */

import React, { useState, useEffect } from 'react'
import { Button, Input, DatePicker, Checkbox, Form, Space, Spin, Row, Col, Typography  } from 'antd'
import { Prompt } from 'react-router-dom'
import PropTypes from 'prop-types'
import history from '../../services/history'
import LocationSelect from '../LocationSelect'
import S3Upload from '../S3Upload'
import useTripCreateUpdate from './helpers/useTripCreateUpdate'

const EditTrip = (props) => {
    EditTrip.propTypes = {
        /** Trip data for editing */
        tripToEdit: PropTypes.object.isRequired,
        /** Callback to clear trip data used for editing */
        clearEditTrip: PropTypes.func.isRequired
    }
    EditTrip.defaultProps = {
        tripToEdit: null,
        clearEditTrip: () => {}
    }

    const TITLE_MAX_LENGTH = 40
    const DETAILS_MAX_LENGTH = 10000
    const LOC_LIST_NAME = 'locationList'
    const LAT_LNG_DELIM = ','
    const UPLOAD_FLD_NAME = 'files'
    const MSG_COL_LAYOUT_SIDES = {
        xs: { span: 0 },
        sm: { span: 2 },
        md: { span: 3 },
        lg: { span: 4 },
        xl: { span: 5 },
        xxl: { span: 6 }
    }
    const MSG_COL_LAYOUT_CONTENT = {
        xs: { span: 24 },
        sm: { span: 20 },
        md: { span: 18 },
        lg: { span: 16 },
        xl: { span: 14 },
        xxl: { span: 12 }
    }
    const FORM_LAYOUT = {
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
    const FORM_TAIL_LAYOUT = {
        wrapperCol: {
            sm: { offset: 5 , span: 19 },
            md: { offset: 5 , span: 16 },
            lg: { offset: 6, span: 12 },
            xl: { offset: 7, span: 10 },
            xxl: { offset: 8, span: 8 },
        }
    }

    const { savingInProgress, createTrip, updateTrip } = useTripCreateUpdate()
    const [showNavPrompt, setShowNavPrompt] = useState(true)
    
    /**
     * Adds event listener for 'beforeunload' to display navigation prompt
     */
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

    /**
     * Gets initial values to populate the form with
     * @param {Object} existingTrip Trip data for edit
     * @returns {Object} Initial values to use for the form
     */
    const getInitialFormValues = (existingTrip) => {
        // Initial values for upload images are handled inside own component
        if (existingTrip){
            const initialLocations = (existingTrip.locations) ?
                                        existingTrip.locations.slice()
                                        : []
            initialLocations.forEach((loc) => {
                loc.latLng = loc.latLng[0] + LAT_LNG_DELIM + loc.latLng[1]
            })

            const initialValues = {
                title: existingTrip.title,
                dates: [existingTrip.startDate, existingTrip.endDate],
                details: existingTrip.details,
                public: existingTrip.public,
                [LOC_LIST_NAME]: initialLocations,
            }
            
            return initialValues
        }

        return {}
    }

    /**
     * Retrieves values from the form and and creates/updates the trip
     * @param {Object} values Form values
     */
    const onFinish = (values) => {
        // Get location data
        const locationData = []
        const locationList = (values[LOC_LIST_NAME]) ? values[LOC_LIST_NAME] : []
        locationList.forEach((loc) => {
            if(loc.latLng){
                locationData.push({
                    fmtAddr: loc.fmtAddr,
                    latLng: loc.latLng.split(LAT_LNG_DELIM).map((coordinate) =>{
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
        const uploadFiles = (values[UPLOAD_FLD_NAME]) ? values[UPLOAD_FLD_NAME] : []
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
        if (props.tripToEdit){
            handleUpdate(tripData, props.tripToEdit._id)
        }
        else{
            handleSubmit(tripData)
        }
    }

    /**
     * Cancels the trip edit and goes back to My Trips page
     */
    const onCancel = () => {
        props.clearEditTrip()
        history.push('/myTrips')
    }

    /**
     * Creates trip with the given data from the form
     * and goes back to My Trips page
     * @param {Object} trip Trip data for new trip creation
     */
    const handleSubmit = async (trip) => {
        const res = await createTrip(trip)
        if(res){
            setShowNavPrompt(false)
            history.push('/myTrips')
        }
    }

    /**
     * Updates the existing trip with new information
     * and goes back to My Trips page
     * @param {Object} updatedTrip Trip data for update
     * @param {String} tripId Trip ID for existing trip being updated
     */
    const handleUpdate = async (updatedTrip, tripId) => {
        await updateTrip(updatedTrip, tripId)
        
        props.clearEditTrip()
        setShowNavPrompt(false)
        history.push('/myTrips')
    }
    
    const [form] = Form.useForm()
    const existingTrip = props.tripToEdit
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
                <Col {...MSG_COL_LAYOUT_SIDES} />
                <Col {...MSG_COL_LAYOUT_CONTENT}>
                    <Typography.Title>{greetingMsg((existingTrip) ? true:  false)}</Typography.Title>
                </Col>
                <Col {...MSG_COL_LAYOUT_SIDES}/>
            </Row>
            <Form
                form={form}
                {...FORM_LAYOUT}
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
                        <Input maxLength={TITLE_MAX_LENGTH} />
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
                        {...FORM_TAIL_LAYOUT}
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
                            maxLength={DETAILS_MAX_LENGTH} />
                    </Form.Item>

                    <LocationSelect
                        form={form}
                        layouts={{ layout: FORM_LAYOUT, tailLayout: FORM_TAIL_LAYOUT }}
                        listName={LOC_LIST_NAME}
                        latLngDelim={LAT_LNG_DELIM} />

                    <S3Upload
                        form={form}
                        fieldName={UPLOAD_FLD_NAME}
                        images={existingImages} />

                    <Form.Item
                        {...FORM_TAIL_LAYOUT} >
                            <Space>
                                <Button type="primary" htmlType="submit">{btnName}</Button>
                                <Button type="link" onClick={onCancel}>Cancel</Button>
                            </Space>
                    </Form.Item>
            </Form>
        </Spin>
    )
}

//#region Helper methods
/**
 * Gets display message for the form
 * @param {boolean} editTrip Flag for form is for editing existing trip
 *                          or creating new trip
 */
const greetingMsg = (editTrip) => {
    if (editTrip){
        return "What has changed?"
    }
    return "It's time to put one down in the books"
}
//#endregion

export default EditTrip