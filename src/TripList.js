import React from 'react'
import Trip from './Trip'
import { Button } from 'antd'

class TripList extends React.Component {
    deleteTrip = index => {
        this.props.deleteTrip(index)
    }
    editTrip = index => {
        this.props.editTrip(index)
    }

    render() {
        const currentTrips = this.props.tripData.map((trip, index) => {
            return (
                <div key={index}>
                    <Trip title={trip.title} date={trip.date} details={trip.details} />
                    
                    <Button type="link" onClick={() => this.editTrip(index)}>
                        Edit
                    </Button>
                    <Button type="link" onClick={() => this.deleteTrip(index)}>
                        Delete
                    </Button>
                </div>
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