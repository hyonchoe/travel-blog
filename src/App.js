import React from 'react'
import { Switch, Route, Router } from 'react-router-dom'
import { Layout  } from 'antd'
import history from './history'

import MyTrips from './MyTrips.js'
import EditTrip from './EditTrip.js'
import './App.css'

import Splash from './Splash.js'
import PrivateRoute from './PrivateRoute.js'
import LoginPage from './LoginPage.js'
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
                                    <Splash />
                                </Route>
                                <PrivateRoute
                                    path="/myTrips"
                                    component={MyTrips}
                                    editTrip={this.handleEditTrip} />
                                <PrivateRoute 
                                    path="/addTrip"
                                    component={EditTrip}
                                    editTrip={tripToEdit}
                                    clearEditTrip={this.clearEditTrip} />
                                <Route path='/login' component={LoginPage}>
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

export default App