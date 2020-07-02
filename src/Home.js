import React from 'react'
import TripList from './TripList.js'
import { Empty, Skeleton, Row, Col } from 'antd'

class Home extends React.Component {    
    render() {
        const trips = this.props.tripData
        const handleDeleteTrip = this.props.deleteTrip
        const handleEditTrip = this.props.editTrip
        const handleLaunchMapModal = this.props.launchMapModal
        const loadingData = this.props.loadingData
        
        return (
          <div className="homeContainer">
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
          </div>
          )
      }    
}
export default Home