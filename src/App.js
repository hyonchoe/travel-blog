import React from 'react'
import { Switch, Route, Router, Link, useLocation } from 'react-router-dom'
import { Layout, Menu, Modal, Button, Upload } from 'antd'

import history from './history'
import Home from './Home.js'
import EditTrip from './EditTrip.js'
import MyMapContainer from './MyMapContainer.js'
import tripService from './services/tripService.js'
import './App.css'

import S3Uploader from './S3Uploader.js'

const { Header, Content, Footer } = Layout

class App extends React.Component {
    state = {
        /**
           trips:
                [
                    {
                    _id: '', (assigned from MongoDB)
                        title: '',
                    startDate: null (string), TODO: should be date object
                    endDate: null (string), TODO: should be date object
                    details: '',
                    locations: null (array),
                    pictures: null (array),
                    },
                    ...
                ]
         */        
        trips: [],
        editTripId: null,
        modalVisible: false,
        tripLocationsForMap: null,
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
    launchMapModal = (tripTitle, tripLocations) => {
        this.setState({
            modalVisible: true,
            tripLocationsForMap: tripLocations,
        })
    }
    handleModalOk = () => {
        this.setState({
            modalVisible: false,
            tripLocationsForMap: null,
        })
    }
    
    render() {
        const trips = this.state.trips
        const tripEditId = this.state.editTripId
        const modalVisible = this.state.modalVisible
        const tripLocations = this.state.tripLocationsForMap
        const mapCenterLat = (tripLocations) ? tripLocations[0].latLng[0] : null
        const mapCenterLng = (tripLocations) ? tripLocations[0].latLng[1] : null

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
                            {/* TODO: add logo */}
                            <div className="logo" />
                            <TopMenus />
                        </Header>

                        <Content className="appContent" >
                                    <Switch>
                                        <Route path="/" exact>
                                            <Home
                                                tripData={trips}
                                                deleteTrip={this.handleDeleteTrip}
                                                editTrip={this.handleEditTrip}
                                                launchMapModal={this.launchMapModal} />
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

                                        <Route path="/upload">
                                            <S3Uploader />
                                        </Route>
                                    </Switch>                                    
                        </Content>

                        <Footer className="appFooter">
                            Work in progress
                        </Footer>
                    </Layout>
                </Router>
                <Modal
                    title='Trip locations'
                    visible={modalVisible}
                    maskClosable={false}
                    bodyStyle={{height: '500px'}}
                    width='500px'
                    onCancel={this.handleModalOk}
                    footer={[
                        <Button
                            key="back"
                            type="primary"
                            onClick={this.handleModalOk} >
                            Close
                        </Button>
                    ]} >
                    <MyMapContainer
                        searchMode={false}
                        tripLocations={tripLocations}
                        mapCenterLat={mapCenterLat}
                        mapCenterLng={mapCenterLng} />
                </Modal>
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