import React, { useState } from 'react'
import { Button, Input, DatePicker, Form, Space, Row, Col, Modal  } from 'antd'
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
    /*
    const loc0 = 'loc0'
    const loc0Hidden = loc0 + hiddenSuffix
    const loc1 = 'loc1'
    const loc1Hidden = loc1 + hiddenSuffix
    const loc2 = 'loc2'
    const loc2Hidden = loc2 + hiddenSuffix
    */

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
        value[locFieldNameLatLng] = markerLatLng.lat + latLngDelim + markerLatLng.lng
        form.setFieldsValue(value)

        //TODO
        let disableBtnsValue = {}
        disableBtnsValue[locFieldName] = (form.getFieldValue(locFieldName) === '')
        setDisableDelBtns({...disableDelBtns, ...disableBtnsValue})
        //
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
        //TODO
        let disableBtnsValue = {}
        disableBtnsValue[curLocFieldName] = true
        setDisableDelBtns({...disableDelBtns, ...disableBtnsValue})
        //
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
        const tripData = {
            title: values.title,
            startDate: values.dates[0],
            endDate: values.dates[1],
            details: values.details,
            location: values.location,
        }

        const loc0FmtAddr = values[locations.loc0]
        const loc0FmtAddrHidden = values[locations.loc0Hidden]
        const loc1FmtAddr = values[locations.loc1]
        const loc1FmtAddrHidden = values[locations.loc1Hidden]
        const loc2FmtAddr = values[locations.loc2]
        const loc2FmtAddrHidden = values[locations.loc2Hidden]
        
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
                label="Location (up to three)" >
                <Form.Item
                    noStyle >                
                    <Form.Item
                        name={locations.loc0}
                        noStyle >
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
                    noStyle >
                    <Form.Item
                        name={locations.loc1}
                        noStyle >
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
                    noStyle >
                    <Form.Item
                        name={locations.loc2}
                        noStyle >
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

        <Modal
            title="Search for the trip location"
            visible={modalVisible}
            bodyStyle={{height: '550px'}}
            width="500px"
            maskClosable={false}
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

        </Row>
    )
}

export default EditTrip