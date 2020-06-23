import React from 'react'
import Trip from './Trip'

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
                    <input 
                        type="button"
                        value="Edit"
                        onClick={() => this.editTrip(index)}
                         />
                    <input
                        type="button"
                        value="Delete"
                        onClick={() => this.deleteTrip(index)} />                                    
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