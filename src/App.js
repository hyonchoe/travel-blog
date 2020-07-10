import React from 'react'
import { Switch, Route, Router } from 'react-router-dom'
import { Layout } from 'antd'
import history from './history'

import DisplayTrips from './DisplayTrips.js'
import EditTrip from './EditTrip.js'
import './App.css'

import PrivateRoute from './PrivateRoute.js'
import NavBar from './NavBar.js'

import Page404 from './Page404.js'

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
                                <Route component={Page404} />
                            </Switch>
                        </Content>

                        <Footer className="appFooter">
                            <span className="footerWord">Travel</span>
                            <span className="footerWord">Explore</span>
                            <span className="footerWord">Learn</span>
                            <span className="footerWord">Remember</span>
                        </Footer>
                    </Layout>
                </Router>
            </div>
        )
    }
  }

export default App