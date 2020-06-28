import React from 'react'
import { Row, Col } from 'antd'
import Trip from './Trip'

class TripList extends React.Component {
    render() {
        const handleDeleteTrip = this.props.deleteTrip
        const handleEditTrip = this.props.editTrip
        const handleLaunchMapModal = this.props.launchMapModal
        const currentTrips = this.props.tripData.map((trip) => {
            return (
                    <Row
                        gutter={[8, 16]}
                        justify="center"
                        >
                        <Col span={4} />
                        <Col span={16}>
                            <div key={trip._id}>
                                
                                    
                                        <Trip
                                            trip={trip}
                                            deleteTrip={handleDeleteTrip}
                                            editTrip={handleEditTrip}
                                            launchMapModal={handleLaunchMapModal}
                                            />  
                            </div>
                        </Col>
                        <Col span={4} />
                    </Row>
            )
        })

        return (
            <div className="tripListContainer">
                {currentTrips}
            </div>
        )
    }
}

export default TripList