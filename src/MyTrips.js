import React, { useState, useEffect } from 'react'
import { Empty, Skeleton, Row, Col, BackTop, message, Modal, Button, List } from 'antd'
import { useAuth0 } from '@auth0/auth0-react'

import tripService from './services/tripService.js'
import MyMapContainer from './MyMapContainer.js'
import Trip from './Trip'

const MyTrips = (props) => {
    const [tripList, setTripList] = useState({
      trips: [],
      listData: [],
      loadingData: true,
      loadingMore: false,
      noMoreRecords: false,
    })
    
    const [modalMap, setModalMap] = useState({
      modalVisible: false,
      tripLocations: null,
    })

    const { getAccessTokenSilently, isAuthenticated, user } = useAuth0()

    useEffect(() => {
      const fetchData = async () => {
        let res
        if (props.showMyTrips){
          res = await tripService.getTrips(getAccessTokenSilently)
        } else {
          res = await tripService.getPublicTrips(null)
        }

        setTripList( {
          ...tripList,
          trips: res,
          listData: res,
          loadingData: false,
        })
      }

      fetchData()
    }, [])

    const onLoadMore = async () => {
      setTripList({
        ...tripList,
        loadingMore: true,
        listData: tripList.listData.concat([...new Array(1)].map(() => ({ loading: true, }))),
      })
      
      let res
      if (props.showMyTrips){
        res = await tripService.getTrips(getAccessTokenSilently)
      } else {
        res = await tripService.getPublicTrips(tripList.trips[tripList.trips.length-1])
      }

      const updatedData = tripList.trips.concat(res)
      const noMoreRecords = res.length === 0 || res[res.length-1].noMoreRecords
      setTripList({
        ...tripList,
        trips: updatedData,
        listData: updatedData,
        loadingMore: false,
        noMoreRecords: noMoreRecords,
      })
      if (noMoreRecords){
        message.info('No more older public trips to display')
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

    const loadMoreButton = !tripList.loadingData && !tripList.loadingMore && !tripList.noMoreRecords ? (
                              <div
                                style={{
                                  textAlign: 'center',
                                  marginTop: 12,
                                  height: 32,
                                  lineHeight: '32px',
                                }} >
                                <Button onClick={onLoadMore}>Load more</Button>
                              </div>
                            )
                            : null

    return (
      <div className="myTripsContainer">
      <BackTop />
      <Row
        gutter={[8, 16]}
        justify="center" >
        <Col span={4} />
        <Col span={16}>
          { tripList.trips.length > 0 && 
          <List
            itemLayout="vertical"
            loading={tripList.loadingData}
            loadMore={loadMoreButton}
            dataSource={tripList.listData}
            renderItem={(item) => (
              <List.Item>
                  <Skeleton loading={item.loading} active>
                    <Trip
                        isAuthenticated={isAuthenticated}
                        userId={userId}
                        showMyTrips={showMyTrips}
                        trip={item}
                        deleteTrip={handleDeleteTrip}
                        editTrip={handleEditTrip}
                        launchMapModal={handleLaunchMapModal} />
                  </Skeleton>                      
              </List.Item>
            )} />
          }
          { tripList.trips.length === 0 && tripList.loadingData &&
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
export default MyTrips