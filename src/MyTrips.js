import React, { useState, useEffect } from 'react'
import { Empty, Skeleton, Row, Col, BackTop, message, Modal, Button, List } from 'antd'
import { useAuth0 } from '@auth0/auth0-react'

import tripService from './services/tripService.js'
import MyMapContainer from './MyMapContainer.js'
import Trip from './Trip'

const MyTrips = (props) => {
    const [trips, setTrips] = useState([])
    const [listData, setListData] = useState([])
    const [loadingData, setLoadingData] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [noMoreRecords, setNoMoreRecords] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [tripLocations, setTripLocations] = useState(null)

    const { getAccessTokenSilently, isAuthenticated, user } = useAuth0()

    useEffect(() => {
      const fetchData = async () => {
        let res
        if (props.showMyTrips){
          res = await tripService.getTrips(getAccessTokenSilently)
        } else {
          res = await tripService.getPublicTrips(null)
        }
        setTrips(res)
        setListData(res)
        setLoadingData(false)
      }

      fetchData()
    }, [])

    const onLoadMore = async () => {
      setLoadingMore(true)
      setListData(listData.concat([...new Array(1)].map(() => ({ loading: true, }))))
      
      let res
      if (props.showMyTrips){
        res = await tripService.getTrips(getAccessTokenSilently)
      } else {
        res = await tripService.getPublicTrips(trips[trips.length-1])
      }

      const updatedData = trips.concat(res)
      setTrips(updatedData)
      setListData(updatedData)
      setLoadingMore(false)
      if(res.length === 0 || res[res.length-1].noMoreRecords){
        setNoMoreRecords(true)
        message.info('No more older public trips to display')
      }
    }

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

    const tripCountsPerSize = 10
    const showMyTrips = props.showMyTrips
    const handleEditTrip = props.editTrip
    const mapCenterLat = (tripLocations && tripLocations.length>0) ? tripLocations[0].latLng[0] : null
    const mapCenterLng = (tripLocations && tripLocations.length>0) ? tripLocations[0].latLng[1] : null
    const userId = (isAuthenticated) ? user.sub : ''

    const loadMoreButton = !loadingData && !loadingMore && !noMoreRecords ? (
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
          { trips.length > 0 && 
          <List
            itemLayout="vertical"
            loading={loadingData}
            loadMore={loadMoreButton}
            dataSource={listData}
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
          { trips.length === 0 && loadingData &&
          <Skeleton loading={true} active />
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