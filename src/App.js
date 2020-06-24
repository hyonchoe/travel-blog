import React from 'react'
import { Switch, Route, Router, Link, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd';

import history from './history'
import Home from './Home.js'
import EditTrip from './EditTrip.js'
import './App.css'

const { Header, Content, Footer } = Layout

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