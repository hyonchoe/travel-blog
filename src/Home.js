import React from 'react'
import TripList from './TripList.js'
import { Empty } from 'antd'

class Home extends React.Component {    
    render() {
        const trips = this.props.tripData
        const handleDeleteTrip = this.props.deleteTrip
        const handleEditTrip = this.props.editTrip
        
        return (
          <div className="homeContainer">
            { trips.length > 0 && 
              <TripList
                tripData={trips}
                deleteTrip={handleDeleteTrip}
                editTrip={handleEditTrip} />
            }
            { trips.length == 0 && 
              <Empty />
            }
          </div>
          )
      }    
}
export default Home