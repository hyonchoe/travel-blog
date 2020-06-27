import React, { useState } from 'react'
import { Row, Col, Input, Button, Modal  } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons';
import './Maptest.css'
import MyMapContainer from './MyMapContainer.js'

const Maptest = props => {
    const [addr, setAddr] = useState({
        city: '',
        state: '',
        country: '',
        fmtAddr: '',
      })
      const [markerLatLng, setMarkerLatLng] = useState({
        lat: null,
        lng: null,
      })
      // Default coordinate is New York, NY
      const [mapCenter, setMapCenter] = useState({
        lat: 40.730610,
        lng: -73.935242,
      })

    // Central park: lat:40.769361, lng: -73.977655
    // NY: lat: 40.730610,  lng: -73.935242    
    //const search = { lat:40.769361, lng: -73.977655 }
    const [modalVisible, setModalVisible] = useState(false)
    const [fieldInfo, setFieldInfo] = useState({
        fmtAddr: '',
    })
    const [disableDelBtn, setDisableDelBtn] = useState(true)

    const getInitialFieldValue = () => {
        return { fmtAddr: '', }
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
        const loc = { fmtAddr: addr.fmtAddr}
        setFieldInfo(loc)
        setDisableDelBtn(false)
        setModalVisible(false)
        clearMapStates()
    }
    const handleModalCancel = () => {
        setModalVisible(false)
        clearMapStates()
    }
    const onLocSelected = (locAddrInfo, locLatLngInfo) => {
        setAddr(locAddrInfo)
        setMarkerLatLng(locLatLngInfo)
        setMapCenter(locLatLngInfo)
    }
    const clearLocation = () => {
        const reset = getInitialFieldValue()
        setFieldInfo(reset)
        setDisableDelBtn(true)
    }
    const clearMapStates = () => {
        const resetAddr = getInitialAddr()
        const resetMarker = getInitialMarker()
        const resetMapCenter = getInitialMapCenter()

        setAddr(resetAddr)
        setMarkerLatLng(resetMarker)
        setMapCenter(resetMapCenter)
    }

    return (
        <Row>
            <Col span={4} />
            <Col span={10}>
                <Input name="hacTest" readOnly={true} placeholder='Where did you go?' value={fieldInfo.fmtAddr}/>
            </Col>
            <Col span={6}> 
                <CloseCircleOutlined
                      className="dynamic-delete-button"
                      disabled={disableDelBtn}
                      style={{ margin: '0 8px' }}
                      onClick={() => clearLocation()}
                />
                <Button type="link" onClick={() => setModalVisible(true)}>Select location</Button>
            </Col>
            <Col span={4} />
            <Modal
                title="Search for the trip location"
                visible={modalVisible}
                bodyStyle={{height: '550px'}}
                width="500px"

                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <MyMapContainer
                        searchMode={true}
                        tripLocations={null}
                        mapCenterLat={mapCenter.lat}
                        mapCenterLng={mapCenter.lng}
                        markerLat={markerLatLng.lat}
                        markerLng={markerLatLng.lng}
                        onLocSelected={onLocSelected}
                        />
            </Modal>
        </Row>
    )
}

export default Maptest