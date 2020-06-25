import React from 'react'
import { Switch, Route, Router, Link, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import moment from 'moment'

import history from './history'
import Home from './Home.js'
import EditTrip from './EditTrip.js'
import tripService from './services/tripService.js'
import './App.css'

const { Header, Content, Footer } = Layout

class App extends React.Component {
    state = {
        trips: [],
        /**[
             {
               _id: '', (assigned from MongoDB)
                title: 'asdf',
               startDate: null,
               endDate: null,
               details: 'asdf',
              },
              ...
         * ]
         */
         editTripIndex: null,
    }
    
    async componentDidMount() {
        const res = await tripService.getTrips()
        this.setState({
            trips: res
        })
        /*
        fetch('/trips')
            .then(result => result.json())
            .then(
                (result) => {
                    if (result.trips){
                        const curTrips = result.trips.map((trip) => {
                            trip.startDate = moment(trip.startDate)
                            trip.endDate = moment(trip.endDate)
                            return trip
                        })
    
                        this.setState({
                            trips: curTrips,
                        })
                    }
                },
                (error) => {
                    console.log(error)
                }
            )
        */
    }

    handleSubmit = async trip => {
        const res = await tripService.submitNewTrip(trip)
        console.log(res)
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
    handleCancel = () => {
        history.push('/')
    }
    
    render() {
        const trips = this.state.trips
        const tripEditIndex = this.state.editTripIndex
        let tripToEdit = (tripEditIndex !== null) ? trips[tripEditIndex] : null

        return (
            <div className="appContainer">
                <Router history={history}>
                    <Layout className="appLayout">
                        <Header className="appHeader">
                            <div className="logo" />
                            <TopMenus />
                        </Header>

                        <Content className="appContent" >
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
                                                handleSubmit={this.handleSubmit}
                                                handleCancel={this.handleCancel}
                                                />
                                        </Route>
                                    </Switch>
                        </Content>

                        <Footer className="appFooter">
                            Work in progress
                        </Footer>
                    </Layout>
                </Router>
            </div>
        )
    }
  }

const TopMenus = () =>{
    let location = useLocation()
    return (
        <Menu theme="dark" mode="horizontal" selectedKeys={[location.pathname]}>
            <Menu.Item key="/">
                <Link to="/">My Trips</Link>
            </Menu.Item>
            <Menu.Item key="/addTrip">
                <Link to="/addTrip">
                    Add/Edit Trip
                </Link>
            </Menu.Item>
        </Menu> 
    )   
}

export default App