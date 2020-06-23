import React from 'react'
import Trip from './Trip'

class TripList extends React.Component {
    render() {
        const handleDeleteTrip = this.props.deleteTrip
        const handleEditTrip = this.props.editTrip
        const currentTrips = this.props.tripData.map((trip, index) => {
            return (
                <div key={index}>
                    <Trip
                        index={index}
                        title={trip.title}
                        startDate={trip.startDate}
                        endDate={trip.endDate}
                        details={trip.details}
                        deleteTrip={handleDeleteTrip}
                        editTrip={handleEditTrip}                        
                        />
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