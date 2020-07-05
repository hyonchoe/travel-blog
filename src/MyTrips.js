import React, { useState, useEffect } from 'react'
import TripList from './TripList.js'
import { Empty, Skeleton, Row, Col, BackTop, message, Modal, Button } from 'antd'
import { useAuth0 } from '@auth0/auth0-react'

import tripService from './services/tripService.js'
import MyMapContainer from './MyMapContainer.js'

const MyTrips = (props) => {
    const [trips, setTrips] = useState([])
    const [loadingData, setLoadingData] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)
    const [tripLocations, setTripLocations] = useState(null)

    const { getAccessTokenSilently } = useAuth0()
    
    useEffect(() => {
      const fetchData = async () => {
        const res = await tripService.getTrips(getAccessTokenSilently)
        setTrips(res)
        setLoadingData(false)
      }

      fetchData()
    }, [])

    const handleDeleteTrip = async (tripId) => {
      const res = await tripService.deleteTrip(tripId, getAccessTokenSilently)
      console.log(res)
      
      let tripTitle = ''
      setTrips(trips.filter((trip) => {
            if (trip._id === tripId){
                tripTitle = trip.title
            }

            return trip._id !== tripId
        })
      )

      message.success(`Trip "${tripTitle}" removed successfully`)
    }
    const handleLaunchMapModal = (tripTitle, tripLocations) => {
      setModalVisible(true)
      setTripLocations(tripLocations)
    }
    const handleModalOk = () => {
      setModalVisible(false)
      setTripLocations(null)
    }

    
    const handleEditTrip = props.editTrip
    const mapCenterLat = (tripLocations && tripLocations.length>0) ? tripLocations[0].latLng[0] : null
    const mapCenterLng = (tripLocations && tripLocations.length>0) ? tripLocations[0].latLng[1] : null

    return (
      <div className="myTripsContainer">
      <BackTop />
      <Row
        gutter={[8, 16]}
        justify="center" >
        <Col span={4} />
        <Col span={16}>
          { trips.length > 0 && 
          <TripList
            tripData={trips}
            deleteTrip={handleDeleteTrip}
            editTrip={handleEditTrip}
            launchMapModal={handleLaunchMapModal} />
          }
          { trips.length === 0 && loadingData && 
          
              <Skeleton active loading={loadingData} />
          
          }
          { trips.length === 0 && !loadingData &&
          <Empty />
          }
        </Col>
        <Col span={4} />
      </Row>
      <Modal
        title='Trip locations'
        visible={modalVisible}
        maskClosable={false}
        bodyStyle={{height: '500px'}}
        width='500px'
        onCancel={handleModalOk}
        footer={[
          <Button
              key="back"
              type="primary"
              onClick={handleModalOk} >
              Close
          </Button>
        ]} >
        <MyMapContainer
            searchMode={false}
            tripLocations={tripLocations}
            mapCenterLat={mapCenterLat}
            mapCenterLng={mapCenterLng} />
      </Modal>
      </div>
      )
}
export default MyTrips