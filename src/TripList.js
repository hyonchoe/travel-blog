import React from 'react'
import { List } from 'antd'
import Trip from './Trip'

class TripList extends React.Component {
    render() {
        const tripCountsPerSize = 10
        const isAuthenticated = this.props.isAuthenticated
        const userId = this.props.userId
        const showMyTrips = this.props.showMyTrips
        const handleDeleteTrip = this.props.deleteTrip
        const handleEditTrip = this.props.editTrip
        const handleLaunchMapModal = this.props.launchMapModal

        return (
            <div className="tripListContainer">
            <List
                itemLayout="vertical"
                pagination={{
                    onChange: page => {
                        window.scrollTo({top: 0, behavior: 'smooth'});
                    },
                    pageSize: tripCountsPerSize,
                }}
                dataSource={this.props.tripData}
                renderItem={(item) => (
                    <List.Item>
                        <Trip
                            isAuthenticated={isAuthenticated}
                            userId={userId}
                            showMyTrips={showMyTrips}
                            trip={item}
                            deleteTrip={handleDeleteTrip}
                            editTrip={handleEditTrip}
                            launchMapModal={handleLaunchMapModal} />
                    </List.Item>
                )} />
            </div>
        )
    }
}

export default TripList