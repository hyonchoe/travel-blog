import React, { useState } from 'react'
import { Form, Input, Button, Modal } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons';

import MyMapContainer from './MyMapContainer.js'

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
        (props.editTrip && props.editTrip.locations && props.editTrip.locations.length > 0) ? false : true,
        (props.editTrip && props.editTrip.locations && props.editTrip.locations.length > 1) ? false : true,
        (props.editTrip && props.editTrip.locations && props.editTrip.locations.length > 2) ? false : true,
    ])
    const [modalVisible, setModalVisible] = useState(false)
    const [locFieldNameIndex, setLocFieldNameIndex] = useState(-1)
    
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
        value[locationFldNames[locFieldNameIndex].fmtAddr] = addr.fmtAddr
        value[locationFldNames[locFieldNameIndex].latLng] = (markerLatLng.lat) ? markerLatLng.lat + latLngDelim + markerLatLng.lng : null
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
        reset[locationFldNames[curLocFldIndex].fmtAddr] = ''
        reset[locationFldNames[curLocFldIndex].latLng] = ''
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

    return (
        <Form.Item
        label="Location (up to three)" >

            <Form.Item
                style={{display: 'block', margin: '0'}} >
                <Form.Item
                    name={locationFldNames[0].fmtAddr}
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
                name={locationFldNames[0].latLng}
                noStyle
                style={{ display: 'none' }} >
                <Input readOnly={true} style={{ display: 'none' }} />
            </Form.Item>

            <Form.Item
                style={{display: 'block', margin: '0'}} >
                <Form.Item
                    name={locationFldNames[1].fmtAddr}
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
                name={locationFldNames[1].latLng}
                noStyle
                style={{ display: 'none' }} >
                <Input readOnly={true} style={{ display: 'none' }} />
            </Form.Item>

            <Form.Item
                style={{display: 'block', margin: '0'}} >
                <Form.Item
                    name={locationFldNames[2].fmtAddr}
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
                name={locationFldNames[2].latLng}
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