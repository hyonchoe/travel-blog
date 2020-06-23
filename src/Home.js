import React from 'react'
import TripList from './TripList.js'
import history from './history'
import { Button } from 'antd'

class Home extends React.Component {    
    render() {
        const trips = this.props.tripData
        const handleDeleteTrip = this.props.deleteTrip
        const handleEditTrip = this.props.editTrip
        
        return (
          <div className="homeContainer">
            <Button
              type="link"
              onClick={() => history.push('/addTrip')}>
                Add new trip
            </Button>
            <TripList
              tripData={trips}
              deleteTrip={handleDeleteTrip}
              editTrip={handleEditTrip} />
          </div>
          )
      }    
}
export default Home