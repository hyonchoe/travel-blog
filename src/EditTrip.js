import React, { useState } from 'react'
import { Button, Input, DatePicker, Form, Space, Modal  } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons';
import './EditTrip.css'
import MyMapContainer from './MyMapContainer.js'

const EditTrip = props => {
    const [markerLatLng, setMarkerLatLng] = useState({
        lat: null,
        lng: null,
    })
    const [mapCenter, setMapCenter] = useState({
        // Default coordinate is New York, NY
        lat: 40.730610,
        lng: -73.935242,
    })
    const [addr, setAddr] = useState({
        city: '',
        state: '',
        country: '',
        fmtAddr: '',
    })
    const [disableDelBtns, setDisableDelBtns] = useState({
        loc0: true,
        loc1: true,
        loc2: true,
    })
    const [modalVisible, setModalVisible] = useState(false)        
    const [locFieldName, setLocFieldName] = useState('')

    const latLngDelim = ','
    const hiddenSuffix = '_hidden'
    const locations = {
        loc0: 'loc0',
        loc0Hidden: 'loc0' + hiddenSuffix,
        loc1: 'loc1',
        loc1Hidden: 'loc1' + hiddenSuffix,
        loc2: 'loc2',
        loc2Hidden: 'loc2' + hiddenSuffix,
    }

    const getInitialMapCenter = () => {
        return {
            lat: 40.730610,
            lng: -73.935242,
        }
    }
    const getInitialAddr = () => {
        return {
            city: '',
            state: '',
            country: '',
            fmtAddr: '',
        }
    }
    const getInitialMarker = () => {
        return {
            lat: null,
            lng: null,
        }
    }

    const handleModalOk = () => {
        let value = {}
        value[locFieldName] = addr.fmtAddr
        let locFieldNameLatLng = locFieldName + hiddenSuffix
        value[locFieldNameLatLng] = (markerLatLng.lat) ? markerLatLng.lat + latLngDelim + markerLatLng.lng : null
        form.setFieldsValue(value)

        let disableBtnsValue = {}
        disableBtnsValue[locFieldName] = (form.getFieldValue(locFieldName) === '')
        setDisableDelBtns({...disableDelBtns, ...disableBtnsValue})

        setModalVisible(false)
        clearMapStates()

        setLocFieldName('')
    }
    const handleModalCancel = () => {
        setModalVisible(false)
        clearMapStates()

        setLocFieldName('')
    }
    const onLocSelected = (locAddrInfo, locLatLngInfo) => {
        setAddr(locAddrInfo)
        setMarkerLatLng(locLatLngInfo)
        setMapCenter(locLatLngInfo)
    }
    const clearLocation = (curLocFieldName) => {
        let reset = {}
        reset[curLocFieldName]=''
        form.setFieldsValue(reset)

        let disableBtnsValue = {}
        disableBtnsValue[curLocFieldName] = true
        setDisableDelBtns({...disableDelBtns, ...disableBtnsValue})
    }
    const clearMapStates = () => {
        const resetAddr = getInitialAddr()
        const resetMarker = getInitialMarker()
        const resetMapCenter = getInitialMapCenter()

        setAddr(resetAddr)
        setMarkerLatLng(resetMarker)
        setMapCenter(resetMapCenter)
    }

    const onButtonClicked = (curLocFieldName) => {
        setModalVisible(true)
        setLocFieldName(curLocFieldName)
    }

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
        let counter = 0
        let locationData = []
        
        if (values[locations.loc0Hidden]){
            locationData[counter] = {
                fmtAddr: values[locations.loc0],
                latLng: values[locations.loc0Hidden].split(latLngDelim),
            }
            counter++
        }
        if (values[locations.loc1Hidden]){
            locationData[counter] = {
                fmtAddr: values[locations.loc1],
                latLng: values[locations.loc1Hidden].split(latLngDelim),                
            }
            counter++
        }
        if (values[locations.loc2Hidden]){
            locationData[counter] = {
                fmtAddr: values[locations.loc2],
                latLng: values[locations.loc2Hidden].split(latLngDelim),
            }
            counter++
        }

        const tripData = {
            title: values.title,
            startDate: values.dates[0],
            endDate: values.dates[1],
            details: values.details,
            locations: locationData,
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

    return (
        <Form
            form={form}
            {...layout}
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
            
                <Form.Item
                    label="Location (up to three)" >
                    <Form.Item
                        style={{display: 'block', margin: '0'}} >
                        <Form.Item
                            name={locations.loc0}
                            style={{ display: 'inline-block' }}
                             >
                            <Input readOnly={true} placeholder='Where did you go?' />
                        </Form.Item>
                        <CloseCircleOutlined
                            className="dynamic-delete-button"
                            disabled={disableDelBtns.loc0}
                            style={{ margin: '0 8px' }}
                            onClick={() => clearLocation(locations.loc0)} />
                        <Button type="link" onClick={() => onButtonClicked(locations.loc0)}>Select location</Button>
                    </Form.Item>
                    <Form.Item 
                        name={locations.loc0Hidden}
                        noStyle
                        style={{ display: 'none' }} >
                        <Input readOnly={true} style={{ display: 'none' }} />
                    </Form.Item>

                    <Form.Item
                        style={{display: 'block', margin: '0'}} >
                        <Form.Item
                            name={locations.loc1}
                            style={{ display: 'inline-block' }} >
                            <Input readOnly={true} placeholder='Where did you go?' />
                        </Form.Item>
                        <CloseCircleOutlined
                            className="dynamic-delete-button"
                            disabled={disableDelBtns.loc1}
                            style={{ margin: '0 8px' }}
                            onClick={() => clearLocation(locations.loc1)}
                        />
                        <Button type="link" onClick={() => onButtonClicked(locations.loc1)}>Select location</Button>
                    </Form.Item>
                    <Form.Item 
                        name={locations.loc1Hidden}
                        noStyle
                        style={{ display: 'none' }} >
                        <Input readOnly={true} style={{ display: 'none' }} />
                    </Form.Item>

                    <Form.Item
                        style={{display: 'block', margin: '0'}} >
                        <Form.Item
                            name={locations.loc2}
                            style={{ display: 'inline-block' }} >
                            <Input readOnly={true} placeholder='Where did you go?' />
                        </Form.Item>
                        <CloseCircleOutlined
                            className="dynamic-delete-button"
                            disabled={disableDelBtns.loc2}
                            style={{ margin: '0 8px' }}
                            onClick={() => clearLocation(locations.loc2)}
                        />
                        <Button type="link" onClick={() => onButtonClicked(locations.loc2)}>Select location</Button>
                    </Form.Item>
                    <Form.Item 
                        name={locations.loc2Hidden}
                        noStyle
                        style={{ display: 'none' }} >
                        <Input readOnly={true} style={{ display: 'none' }} />
                    </Form.Item>
                </Form.Item>

                <Form.Item
                    {...tailLayout}
                >
                        <Space>
                            <Button type="primary" htmlType="submit">{btnName}</Button>
                            {existingTrip && 
                                <Button type="link" onClick={onCancel}>Cancel</Button>
                            }
                        </Space>
                </Form.Item>

            <Modal
                title="Search your trip location"
                visible={modalVisible}
                bodyStyle={{height: '550px'}}
                width="500px"
                maskClosable={false}
                destroyOnClose={true}
                onOk={handleModalOk}
                onCancel={handleModalCancel} >
                <MyMapContainer
                        searchMode={true}
                        tripLocations={null}
                        mapCenterLat={mapCenter.lat}
                        mapCenterLng={mapCenter.lng}
                        markerLat={markerLatLng.lat}
                        markerLng={markerLatLng.lng}
                        onLocSelected={onLocSelected} />
            </Modal>            
        </Form>
    )
}

export default EditTrip