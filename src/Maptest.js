import React from 'react'
import { Row, Col, Input  } from 'antd'
import './Maptest.css'
import MyMapContainer from './MyMapContainer.js'

const Maptest = props => {
    // Central park: lat:40.769361, lng: -73.977655
    // NY: lat: 40.730610,  lng: -73.935242    
    const search = null
    //const search = { lat:40.769361, lng: -73.977655 }
    const mapCenterLat = (search) ? search.lat : 40.730610
    const mapCenterLng = (search) ? search.lng : -73.935242

    return (
        <Row>
            <Col span={4} />
            <Col span={5}>
                <Input placeholder="Field to search for places"/>
            </Col>
            <Col span={1} />
            <Col span={10}>
                <MyMapContainer
                    center={{lat: mapCenterLat, lng: mapCenterLng}}
                    searchResult = {search}
                    />
            </Col>
            <Col span={4} />
        </Row>  

    )
}

export default Maptest