import React from 'react'
import TripList from './TripList.js'
import history from './history'

class Home extends React.Component {    
    render() {
        const trips = this.props.tripData
        const handleDeleteTrip = this.props.deleteTrip
        const handleEditTrip = this.props.editTrip
        
        return (
          <div className="homeContainer">
            <input
              type="button"
              value="Add new trip"
              onClick={() => history.push('/addTrip')} />
            <TripList
              tripData={trips}
              deleteTrip={handleDeleteTrip}
              editTrip={handleEditTrip} />
          </div>
          )
      }    
}

export default Home