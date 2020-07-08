import React, { useState, useEffect, useRef } from 'react'
import { Empty, Skeleton, Row, Col, BackTop, message, Modal, Button, List } from 'antd'
import { useAuth0 } from '@auth0/auth0-react'

import tripService from './services/tripService.js'
import MyMapContainer from './MyMapContainer.js'
import Trip from './Trip'

const DisplayTrips = (props) => {
    const [tripList, setTripList] = useState({
      trips: [],
      loadingData: true,
      noMoreRecords: false,
    })
    
    const [modalMap, setModalMap] = useState({
      modalVisible: false,
      tripLocations: null,
    })

    const [scrollToTripId, setScrollToTripId] = useState('')
    const lastItemRef = useRef(null)

    const { getAccessTokenSilently, isAuthenticated, user } = useAuth0()
    const displayLimit = 100

    useEffect(() => {
      const fetchData = async () => {
        const res = (props.showMyTrips) ?
          await tripService.getTrips(getAccessTokenSilently)
          : await tripService.getPublicTrips(null)

        setTripList( {
          ...tripList,
          trips: res,
          loadingData: false,
        })
      }

      fetchData()
    }, [])

    const reloadTripData = async () => {
      setTripList( {
        ...tripList,
        loadingData: true,
      })

      const res = await tripService.getPublicTrips(null)

      setTripList( {
        trips: res,
        loadingData: false,
        noMoreRecords: false,
      })
    }

    const onLoadMore = async () => {
      setTripList({
        ...tripList,
        loadingData: true,
      })
      
      const res = await tripService.getPublicTrips(tripList.trips[tripList.trips.length-1])

      let updatedData = tripList.trips.concat(res)
      let updateScrollPos = false
      if (updatedData.length > displayLimit){
        setScrollToTripId(tripList.trips[tripList.trips.length-1]._id)
        updateScrollPos = true
        
        updatedData = updatedData.slice(updatedData.length - displayLimit)
        updatedData[0] = { placeholder: true }
      }
      const noMoreRecords = res.length === 0 || res[res.length-1].noMoreRecords
      
      setTripList({
        trips: updatedData,
        loadingData: false,
        noMoreRecords: noMoreRecords,
      })
      if (noMoreRecords){
        message.info('No more older public trips to display')
      }

      if (updateScrollPos && lastItemRef.current){
        lastItemRef.current.scrollIntoView()
      }
    }

    const handleDeleteTrip = async (tripId) => {
      const res = await tripService.deleteTrip(tripId, getAccessTokenSilently)
      console.log(res)
      
      let tripTitle = ''

      setTripList({
        ...tripList,
        trips: tripList.trips.filter((trip) => {
                  if (trip._id === tripId){
                      tripTitle = trip.title
                  }

                  return trip._id !== tripId
              })
      })

      message.success(`Trip "${tripTitle}" removed successfully`)
    }
    const handleLaunchMapModal = (tripTitle, tripLocations) => {
      setModalMap({
        modalVisible: true,
        tripLocations: tripLocations
      })
    }
    const handleModalOk = () => {
      setModalMap({
        modalVisible: false,
        tripLocations: null
      })
    }

    const tripCountsPerSize = 10
    const showMyTrips = props.showMyTrips
    const handleEditTrip = props.editTrip
    let mapCenterLat = null
    let mapCenterLng = null
    if (modalMap.tripLocations && modalMap.tripLocations.length>0) {
      mapCenterLat = modalMap.tripLocations[0].latLng[0]
      mapCenterLng = modalMap.tripLocations[0].latLng[1]
    }
    const userId = (isAuthenticated) ? user.sub : ''

    const loadMoreButton = (!tripList.loadingData && !tripList.noMoreRecords) ? 
                              (<div style={{ textAlign: 'center', marginTop: 12, }} >
                                <Button onClick={onLoadMore}>Load more</Button>
                              </div>)
                              : null
    const tripCard = (item, itemRef) =>
                              (<div ref={itemRef}>
                                { item.placeholder && 
                                <div style={{ textAlign: 'center', }} >
                                  <Button onClick={reloadTripData}>Trips removed from display. Click to refresh the feed</Button>
                                </div>
                                }
                                { !item.placeholder &&
                                <Trip
                                  isAuthenticated={isAuthenticated}
                                  userId={userId}
                                  showMyTrips={showMyTrips}
                                  trip={item}
                                  deleteTrip={handleDeleteTrip}
                                  editTrip={handleEditTrip}
                                  launchMapModal={handleLaunchMapModal} />
                                }
                              </div>)

    return (
      <div className="displayTripsContainer">
      <BackTop />
      <Row
        gutter={[8, 16]}
        justify="center" >
        <Col span={4} />
        <Col span={16}>
          { !showMyTrips && tripList.trips.length > 0 && 
          <List
            itemLayout="vertical"
            loading={tripList.loadingData}
            loadMore={loadMoreButton}
            dataSource={tripList.trips}
            renderItem={(item) => (
              <List.Item>
                {item._id === scrollToTripId && 
                  tripCard(item, lastItemRef)
                }
                {item._id !== scrollToTripId && 
                  tripCard(item, null)
                }
              </List.Item>
            )} />
          }
          { showMyTrips && tripList.trips.length > 0 && 
          <List
            itemLayout="vertical"
            pagination={{
              onChange: page=> {
                window.scrollTo({top:0, behavior: 'smooth'})
              },
              pageSize: tripCountsPerSize,
            }}
            dataSource={tripList.trips}
            renderItem={(item) => (
              <List.Item>
                {tripCard(item)}
              </List.Item>
            )} />
          }
          { tripList.loadingData &&
          <Skeleton loading={true} active />
          }
          { tripList.trips.length === 0 && !tripList.loadingData &&
          <Empty />
          }
        </Col>
        <Col span={4} />
      </Row>
      <Modal
        title='Trip locations'
        visible={modalMap.modalVisible}
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
            tripLocations={modalMap.tripLocations}
            mapCenterLat={mapCenterLat}
            mapCenterLng={mapCenterLng} />
      </Modal>
      </div>
      )
}
export default DisplayTrips