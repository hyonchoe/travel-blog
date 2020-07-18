import React, { useState, useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Empty, Skeleton, Row, Col, BackTop, message, Modal, Button, List, Typography } from 'antd'
import MyMapContainer from '../MyMapContainer'
import Trip from '../Trip'
import useTripData from './helpers/useTripData'

const DisplayTrips = (props) => {    
    const { tripList, reloadTripData, handleDeleteTrip, onLoadMore } = useTripData(props.showMyTrips)
    const { isAuthenticated, user } = useAuth0()
    const [modalMap, setModalMap] = useState({
      modalVisible: false,
      tripLocations: null,
    })
    const [scrollToTripId, setScrollToTripId] = useState('')
    const lastItemRef = useRef(null)

    const onLoadMoreClicked = async () => {
      const { noMoreRecords, scrollToTripId } = await onLoadMore()

      if (noMoreRecords){
        message.info('No more older public trips to display')
      }
      if (scrollToTripId !== -1){
        setScrollToTripId(scrollToTripId)
        if (lastItemRef.current){
          lastItemRef.current.scrollIntoView()
        }
      }
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

    const tripCountsPerPage = 10
    const showMyTrips = props.showMyTrips
    const handleEditTrip = props.editTrip
    let mapCenterLat = null
    let mapCenterLng = null
    if (modalMap.tripLocations && modalMap.tripLocations.length>0) {
      mapCenterLat = modalMap.tripLocations[0].latLng[0]
      mapCenterLng = modalMap.tripLocations[0].latLng[1]
    }
    const userId = (isAuthenticated) ? user.sub : ''
    const msgColLayoutSides = {
      xs: { span: 0 },
      md: { span: 2 },
      lg: { span: 3 },
      xl: { span: 4 },
      xxl: { span: 5 }
    }
    const msgColLayoutContent = {
      xs: { span: 24 },
      md: { span: 20 },
      lg: { span: 18 },
      xl: { span: 16 },
      xxl: { span: 14 }
    }
    const tripListColLayoutSides = {
      xs: { span: 0 },
      md: { span: 3 },
      lg: { span: 4 },
      xl: { span: 5 },
      xxl: { span: 6 }
    }
    const tripListColLayoutContent = {
      xs: { span: 24 },
      md: { span: 18 },
      lg: { span: 16 },
      xl: { span: 14 },
      xxl: { span: 12 }
    }

    const loadMoreButton = (!tripList.loadingData && !tripList.noMoreRecords) ? 
                              (<div style={{ textAlign: 'center' }} >
                                <Button onClick={onLoadMoreClicked}>Load more</Button>
                              </div>)
                              : null
    const tripCard = (item, itemRef) =>
                              (<div ref={itemRef} className="tripContainer">
                                { item.placeholder && 
                                <div style={{ textAlign: 'center' }} >
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
            gutter={[0, 8]}
            justify="start" >
            <Col {...msgColLayoutSides} />
            <Col {...msgColLayoutContent} >
              <Typography.Title>{greetingMsg(showMyTrips)}</Typography.Title>
            </Col>
            <Col {...msgColLayoutSides} />
          </Row>

          <Row
            gutter={[0, 8]}
            justify="center" >
            <Col {...tripListColLayoutSides} />
            <Col {...tripListColLayoutContent} >
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
                  pageSize: tripCountsPerPage,
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
            <Col {...tripListColLayoutSides} />
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

const greetingMsg = (isMyTrips) => {
  if (isMyTrips){
    return 'Your memorable travels and memories'
  }
  return "Stories and footmarks from travelers in the world"
}

export default DisplayTrips