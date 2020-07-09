import React from 'react'
import { Switch, Route, Router } from 'react-router-dom'
import { Layout  } from 'antd'
import history from './history'

import DisplayTrips from './DisplayTrips.js'
import EditTrip from './EditTrip.js'
import './App.css'

import PrivateRoute from './PrivateRoute.js'
import NavBar from './NavBar.js'

const { Header, Content, Footer } = Layout

class App extends React.Component {
    state = {
        tripToEdit: null,
    }
    
    componentDidMount() {}

    handleEditTrip = (trip) => {
        this.setState({
            tripToEdit: trip
        })
    }
    clearEditTrip = () => {
        this.setState({
            tripToEdit: null
        })
    }
    
    render() {
        const tripToEdit = this.state.tripToEdit

        return (
            <div className="appContainer">
                <Router history={history}>
                    <Layout className="appLayout">
                        <Header className="appHeader">
                            {/* TODO: add logo */}
                            <div className="logo" />
                            <NavBar />
                        </Header>

                        <Content className="appContent" >
                            <Switch>
                                <Route path="/" exact>
                                    <DisplayTrips
                                        showMyTrips={false}
                                        editTrip={this.handleEditTrip} />
                                </Route>
                                <PrivateRoute
                                    path="/myTrips"
                                    component={DisplayTrips}
                                    showMyTrips={true}
                                    editTrip={this.handleEditTrip} />
                                <PrivateRoute 
                                    path="/addTrip"
                                    component={EditTrip}
                                    editTrip={tripToEdit}
                                    clearEditTrip={this.clearEditTrip} />
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

export default App