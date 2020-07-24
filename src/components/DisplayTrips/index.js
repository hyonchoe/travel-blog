/**
 * DisplayTrips component that displays list of trips (either user specific trips or public trips)
 */

import React, { useState, useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Empty, Skeleton, Row, Col, BackTop, message, Modal, Button, List, Typography } from 'antd'
import PropTypes from 'prop-types'
import MyMapContainer from '../MyMapContainer'
import Trip from '../Trip'
import useTripData from './helpers/useTripData'
import useMap from '../../hooks/useMap'
import useWindowDimensions from '../../hooks/useWindowDimensions'

const DisplayTrips = (props) => {
    DisplayTrips.propTypes = {
      /** Flag to display user trips or public trips  */
      showMyTrips: PropTypes.bool.isRequired,
      /** Callback to set trip data for editing */
      editTrip: PropTypes.func.isRequired
    }
    DisplayTrips.defaultProps = {
      showMyTrips: false,
      editTrip: () => {}
    }
    const BREAKING_PT_XS = 576
    const TRIP_COUNTS_PER_PAGE = 10  
    const MSG_COL_LAYOUT_SIDES = {
      xs: { span: 0 },
      md: { span: 2 },
      lg: { span: 3 },
      xl: { span: 4 },
      xxl: { span: 5 }
    }
    const MSG_COL_LAYOUT_CONTENT = {
      xs: { span: 24 },
      md: { span: 20 },
      lg: { span: 18 },
      xl: { span: 16 },
      xxl: { span: 14 }
    }
    const TRIP_LIST_COL_LAYOUT_SIDES = {
      xs: { span: 0 },
      md: { span: 3 },
      lg: { span: 4 },
      xl: { span: 5 },
      xxl: { span: 6 }
    }
    const TRIP_LIST_COL_LAYOUT_CONTENT = {
      xs: { span: 24 },
      md: { span: 18 },
      lg: { span: 16 },
      xl: { span: 14 },
      xxl: { span: 12 }
    }

    const { windowWidth } = useWindowDimensions()
    const { tripList, reloadTripData, handleDeleteTrip, onLoadMore } = useTripData(props.showMyTrips)
    const { mapCenter } = useMap()
    const { isAuthenticated, user } = useAuth0()
    const [modalMap, setModalMap] = useState({
      modalVisible: false,
      tripLocations: null,
    })
    const [scrollToTripId, setScrollToTripId] = useState('')
    const lastItemRef = useRef(null)

    /**
     * Loads more public trips and updates the scroll location
     */
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

    /**
     * Makes modal visible and sets location data that is used for map markers
     * @param {string} tripTitle Trip title
     * @param {Array} tripLocations Locations for the trip
     */
    const handleLaunchMapModal = (tripTitle, tripLocations) => {
      setModalMap({
        modalVisible: true,
        tripLocations: tripLocations
      })
    }

    /**
     * Makes modal disappear and resets the trip locations for the map
     */
    const handleModalOk = () => {
      setModalMap({
        modalVisible: false,
        tripLocations: null
      })
    }

    const showMyTrips = props.showMyTrips
    const handleEditTrip = props.editTrip
    let mapCenterLat = mapCenter.lat
    let mapCenterLng = mapCenter.lng
    if (modalMap.tripLocations && modalMap.tripLocations.length>0) {
      mapCenterLat = modalMap.tripLocations[0].latLng[0]
      mapCenterLng = modalMap.tripLocations[0].latLng[1]
    }
    const userId = (isAuthenticated) ? user.sub : ''

    //#region Helper components
    /**
     * Helper component for 'Load more' button to load more public trips
     */
    const loadMoreButton = (!tripList.loadingData && !tripList.noMoreRecords) ? 
                              (<div style={{ textAlign: 'center' }} >
                                <Button onClick={onLoadMoreClicked}>Load more</Button>
                              </div>)
                              : null
    
    /**
     * Helper component that is either Trip component or Reload button
     * @param {Object} item List item, which is Trip data
     * @param {Object} itemRef Reference to the DOM element, used for identifying last loaded trip
     */
    const getTripCard = (item, itemRef) =>
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
                                  launchMapModal={handleLaunchMapModal}
                                  useDateIcon={windowWidth < BREAKING_PT_XS} />
                                }
                              </div>)
    //#endregion

    return (
      <div className="displayTripsContainer">
        <BackTop />
          <Row
            gutter={[0, 8]}
            justify="start" >
            <Col {...MSG_COL_LAYOUT_SIDES} />
            <Col {...MSG_COL_LAYOUT_CONTENT} >
              <Typography.Title>{getGreetingMsg(showMyTrips)}</Typography.Title>
            </Col>
            <Col {...MSG_COL_LAYOUT_SIDES} />
          </Row>

          <Row
            gutter={[0, 8]}
            justify="center" >
            <Col {...TRIP_LIST_COL_LAYOUT_SIDES} />
            <Col {...TRIP_LIST_COL_LAYOUT_CONTENT} >
              { !showMyTrips && tripList.trips.length > 0 && 
              <List
                itemLayout="vertical"
                loading={tripList.loadingData}
                loadMore={loadMoreButton}
                dataSource={tripList.trips}
                renderItem={(item) => (
                  <List.Item>
                    {item._id === scrollToTripId && 
                      getTripCard(item, lastItemRef)
                    }
                    {item._id !== scrollToTripId && 
                      getTripCard(item, null)
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
                  pageSize: TRIP_COUNTS_PER_PAGE,
                }}
                dataSource={tripList.trips}
                renderItem={(item) => (
                  <List.Item>
                    {getTripCard(item)}
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
            <Col {...TRIP_LIST_COL_LAYOUT_SIDES} />
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

//#region Helper methods
/**
 * Gets page title/message to display
 * @param {boolean} isMyTrips Flag for displaying user trips
 * @returns Greeting message
 */
const getGreetingMsg = (isMyTrips) => {
  if (isMyTrips){
    return 'Your memorable travels and memories'
  }
  return "Stories and footmarks from travelers in the world"
}
//#endregion

export default DisplayTrips