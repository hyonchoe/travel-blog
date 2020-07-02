import React, { useState } from 'react'
import { Form, Input, Button, Modal } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons';

import MyMapContainer from './MyMapContainer.js'
import './LocationSelect.css'

const LocationSelect = (props) => {
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
    const [disableDelBtns, setDisableDelBtns] = useState([
        (props.existingTripLocations.length > 0) ? false : true,
        (props.existingTripLocations.length > 1) ? false : true,
        (props.existingTripLocations.length > 2) ? false : true,
    ])
    const [modalVisible, setModalVisible] = useState(false)
    const [locFieldNameIndex, setLocFieldNameIndex] = useState(-1)

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
        value[props.fieldNames[locFieldNameIndex].fmtAddr] = addr.fmtAddr
        value[props.fieldNames[locFieldNameIndex].latLng] = (markerLatLng.lat) ? markerLatLng.lat + props.latLngDelim + markerLatLng.lng : null
        value[props.fieldNames[locFieldNameIndex].city] = addr.city
        value[props.fieldNames[locFieldNameIndex].state] = addr.state
        value[props.fieldNames[locFieldNameIndex].country] = addr.country
        props.form.setFieldsValue(value)
        
        let btnDisableValues = disableDelBtns.slice() // copying it
        btnDisableValues[locFieldNameIndex] = false
        setDisableDelBtns(btnDisableValues)

        setModalVisible(false)
        clearMapStates()

        setLocFieldNameIndex(-1)
    }
    const handleModalCancel = () => {
        setModalVisible(false)
        clearMapStates()

        setLocFieldNameIndex(-1)
    }
    const onLocSelected = (locAddrInfo, locLatLngInfo) => {
        setAddr(locAddrInfo)
        setMarkerLatLng(locLatLngInfo)
        setMapCenter(locLatLngInfo)
    }
    const clearLocation = (curLocFldIndex) => {
        let reset = {}
        reset[props.fieldNames[curLocFldIndex].fmtAddr] = ''
        reset[props.fieldNames[curLocFldIndex].latLng] = ''
        reset[props.fieldNames[curLocFldIndex].city] = ''
        reset[props.fieldNames[curLocFldIndex].state] = ''
        reset[props.fieldNames[curLocFldIndex].country] = ''
        props.form.setFieldsValue(reset)

       let btnDisableValues = disableDelBtns.slice() // copying it
       btnDisableValues[curLocFldIndex] = true
       setDisableDelBtns(btnDisableValues)
    }
    const clearMapStates = () => {
        const resetAddr = getInitialAddr()
        const resetMarker = getInitialMarker()
        const resetMapCenter = getInitialMapCenter()

        setAddr(resetAddr)
        setMarkerLatLng(resetMarker)
        setMapCenter(resetMapCenter)
    }
    const onButtonClicked = (locFieldNameIndex) => {
        setModalVisible(true)
        setLocFieldNameIndex(locFieldNameIndex)
    }

    const getInitialValueFmtAddr = (locFldIndex) => {
        const locations = props.existingTripLocations
        if (locations.length > locFldIndex){
            return locations[locFldIndex].fmtAddr
        }
        return ''
    }
    const getInitialValueLatLng = (locFldIndex) => {
        const locations = props.existingTripLocations
        if (locations.length > locFldIndex){
            return locations[locFldIndex].latLng[0] + props.latLngDelim + locations[locFldIndex].latLng[1]
        }
        return ''
    }
    const getInitialValueCity = (locFldIndex) => {
        const locations = props.existingTripLocations
        if (locations.length > locFldIndex){
            return locations[locFldIndex].city
        }
        return ''
    }
    const getInitialValueState = (locFldIndex) => {
        const locations = props.existingTripLocations
        if (locations.length > locFldIndex){
            return locations[locFldIndex].state
        }
        return ''
    }
    const getInitialValueCountry = (locFldIndex) => {
        const locations = props.existingTripLocations
        if (locations.length > locFldIndex){
            return locations[locFldIndex].country
        }
        return ''
    }    

    return (
        <Form.Item
        label="Location (up to three)" >

            <Form.Item
                style={{display: 'block', margin: '0'}} >
                <Form.Item
                    name={props.fieldNames[0].fmtAddr}
                    initialValue={getInitialValueFmtAddr(0)}
                    style={{ display: 'inline-block' }}
                    >
                    <Input readOnly={true} placeholder='Where did you go?' />
                </Form.Item>
                <CloseCircleOutlined
                    className="dynamic-delete-button"
                    disabled={disableDelBtns[0]}
                    style={{ margin: '0 8px' }}
                    onClick={() => clearLocation(0)} />
                <Button type="link" onClick={() => onButtonClicked(0)}>Select location</Button>
            </Form.Item>
            <Form.Item 
                name={props.fieldNames[0].latLng}
                initialValue={getInitialValueLatLng(0)}
                noStyle
                style={{ display: 'none' }} >
                <Input readOnly={true} style={{ display: 'none' }} />
            </Form.Item>
            <Form.Item 
                name={props.fieldNames[0].city}
                initialValue={getInitialValueCity(0)}
                noStyle
                style={{ display: 'none' }} >
                <Input readOnly={true} style={{ display: 'none' }} />
            </Form.Item>
            <Form.Item 
                name={props.fieldNames[0].state}
                initialValue={getInitialValueState(0)}
                noStyle
                style={{ display: 'none' }} >
                <Input readOnly={true} style={{ display: 'none' }} />
            </Form.Item>
            <Form.Item 
                name={props.fieldNames[0].country}
                initialValue={getInitialValueCountry(0)}
                noStyle
                style={{ display: 'none' }} >
                <Input readOnly={true} style={{ display: 'none' }} />
            </Form.Item>

            <Form.Item
                style={{display: 'block', margin: '0'}} >
                <Form.Item
                    name={props.fieldNames[1].fmtAddr}
                    initialValue={getInitialValueFmtAddr(1)}
                    style={{ display: 'inline-block' }} >
                    <Input readOnly={true} placeholder='Where did you go?' />
                </Form.Item>
                <CloseCircleOutlined
                    className="dynamic-delete-button"
                    disabled={disableDelBtns[1]}
                    style={{ margin: '0 8px' }}
                    onClick={() => clearLocation(1)}
                />
                <Button type="link" onClick={() => onButtonClicked(1)}>Select location</Button>
            </Form.Item>
            <Form.Item 
                name={props.fieldNames[1].latLng}
                initialValue={getInitialValueLatLng(1)}
                noStyle
                style={{ display: 'none' }} >
                <Input readOnly={true} style={{ display: 'none' }} />
            </Form.Item>
            <Form.Item 
                name={props.fieldNames[1].city}
                initialValue={getInitialValueCity(1)}
                noStyle
                style={{ display: 'none' }} >
                <Input readOnly={true} style={{ display: 'none' }} />
            </Form.Item>
            <Form.Item 
                name={props.fieldNames[1].state}
                initialValue={getInitialValueState(1)}
                noStyle
                style={{ display: 'none' }} >
                <Input readOnly={true} style={{ display: 'none' }} />
            </Form.Item>
            <Form.Item 
                name={props.fieldNames[1].country}
                initialValue={getInitialValueCountry(1)}
                noStyle
                style={{ display: 'none' }} >
                <Input readOnly={true} style={{ display: 'none' }} />
            </Form.Item>

            <Form.Item
                style={{display: 'block', margin: '0'}} >
                <Form.Item
                    name={props.fieldNames[2].fmtAddr}
                    initialValue={getInitialValueFmtAddr(2)}
                    style={{ display: 'inline-block' }} >
                    <Input readOnly={true} placeholder='Where did you go?' />
                </Form.Item>
                <CloseCircleOutlined
                    className="dynamic-delete-button"
                    disabled={disableDelBtns[2]}
                    style={{ margin: '0 8px' }}
                    onClick={() => clearLocation(2)}
                />
                <Button type="link" onClick={() => onButtonClicked(2)}>Select location</Button>
            </Form.Item>
            <Form.Item 
                name={props.fieldNames[2].latLng}
                initialValue={getInitialValueLatLng(2)}
                noStyle
                style={{ display: 'none' }} >
                <Input readOnly={true} style={{ display: 'none' }} />
            </Form.Item>
            <Form.Item 
                name={props.fieldNames[2].city}
                initialValue={getInitialValueCity(2)}
                noStyle
                style={{ display: 'none' }} >
                <Input readOnly={true} style={{ display: 'none' }} />
            </Form.Item>
            <Form.Item 
                name={props.fieldNames[2].state}
                initialValue={getInitialValueState(2)}
                noStyle
                style={{ display: 'none' }} >
                <Input readOnly={true} style={{ display: 'none' }} />
            </Form.Item>
            <Form.Item 
                name={props.fieldNames[2].country}
                initialValue={getInitialValueCountry(2)}
                noStyle
                style={{ display: 'none' }} >
                <Input readOnly={true} style={{ display: 'none' }} />
            </Form.Item>

            <Modal
                title="Search your trip location"
                visible={modalVisible}
                bodyStyle={{height: '550px'}}
                width="500px"
                maskClosable={false}
                destroyOnClose={true}
                okButtonProps={{ disabled: (markerLatLng.lat === null) }}
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

        </Form.Item>
    )
}

export default LocationSelect