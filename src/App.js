import React from 'react'
import { Switch, Route, Router, Link, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'

import history from './history'
import Home from './Home.js'
import EditTrip from './EditTrip.js'
import tripService from './services/tripService.js'
import './App.css'

const { Header, Content, Footer } = Layout

class App extends React.Component {
    state = {
        /**
         * [
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
        trips: [],
        editTripId: null,
    }
    
    async componentDidMount() {
        const res = await tripService.getTrips()
        this.setState({
            trips: res
        })
    }

    handleSubmit = async trip => {
        const res = await tripService.submitNewTrip(trip)
        console.log(res)
        trip._id = res.data.insertedId
        this.setState({
            trips: [...this.state.trips, trip]
        })
        history.push('/')
    }
    handleDeleteTrip = async tripId => {
        const res = await tripService.deleteTrip(tripId)
        console.log(res)
        this.setState({
            trips: this.state.trips.filter((trip) => {
                return trip._id !== tripId
            })
        })
    }
    handleEditTrip = tripId => {
        this.setState({
            editTripId: tripId,
        })
        history.push('/addTrip')
    }
    handleUpdate = async (updatedTrip, tripId) => {
        const res = await tripService.updateTrip(updatedTrip, tripId)
        console.log(res)
        this.setState({
            trips: this.state.trips.map((trip) => {
                return (trip._id === tripId) ? {...trip, ...updatedTrip} : trip
            }),
            editTripId: null,
        })
        history.push('/')
    }
    handleCancel = () => {
        history.push('/')
    }
    
    render() {
        const trips = this.state.trips
        const tripEditId = this.state.editTripId
        let tripToEdit = null
        for(let i=0; tripEditId!== null && i<trips.length; i++){
            if(trips[i]._id === tripEditId){
                tripToEdit = trips[i]
                break
            }
        }

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
                                                editTripId={tripEditId}
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