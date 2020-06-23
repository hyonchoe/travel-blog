import React from 'react'
import { Switch, Route, Router } from 'react-router-dom'
import history from './history'

import Home from './Home.js'
import EditTrip from './EditTrip.js'

class App extends React.Component {
    state = {
        trips: [],
        /**
         * {
         *  title: 'asdf',
         *  date: 'asdf',
         *  details: 'asdf',
         * },
         * ...
         */

         editTripIndex: null,
    }
    
    handleSubmit = trip => {
      this.setState({
          trips: [...this.state.trips, trip] 
        })
      history.push('/')
    }
    handleDeleteTrip = index => {
        this.setState({
            trips: this.state.trips.filter((trip, i) => {
                return i !== index
            })
        })
    }
    handleEditTrip = index => {
        this.setState({
            editTripIndex: index,
        })
        history.push('/addTrip')
    }
    handleUpdate = (updatedTrip, index) => {
        const clone = this.state.trips.slice()
        clone[index] = updatedTrip
        this.setState({
            trips: clone,
            editTripIndex: null,
        })
        history.push('/')
    }
    
    render() {
        const trips = this.state.trips
        const tripEditIndex = this.state.editTripIndex
        let tripToEdit = (tripEditIndex !== null) ? trips[tripEditIndex] : null
        return (
            <div className="appContainer">
                <Router history={history}>
                    <Switch>
                        <Route path="/" exact>
                            <Home
                                tripData={trips}
                                deleteTrip={this.handleDeleteTrip}
                                editTrip={this.handleEditTrip} />
                        </Route>                
                        <Route path="/addTrip">
                            <EditTrip
                                editTrip={tripToEdit}
                                editTripIndex={tripEditIndex}
                                handleUpdate={this.handleUpdate}
                                handleSubmit={this.handleSubmit} />
                        </Route>
                    </Switch>
                </Router>                    
            </div>
        )
    }
  }

export default App