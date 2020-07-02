import React from 'react'
import { List } from 'antd'
import Trip from './Trip'

class TripList extends React.Component {
    render() {
        const handleDeleteTrip = this.props.deleteTrip
        const handleEditTrip = this.props.editTrip
        const handleLaunchMapModal = this.props.launchMapModal

        return (
            <div className="tripListContainer">
            <List
                itemLayout="vertical"
                dataSource={this.props.tripData}
                renderItem={(item) => (
                    <List.Item>
                        <Trip
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