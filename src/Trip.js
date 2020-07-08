import React from 'react'
import { Typography, Card, Modal, Popconfirm, Tooltip } from 'antd'
import { GlobalOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, LockOutlined } from '@ant-design/icons';
import history from './history'

import PictureCarousel from './PictureCarousel.js'
import './Trip.css'

class Trip extends React.Component {
     state = {
         key: 'journal',
     }

    onTabChange = (key, type) => {
        let updatedTabKey = {}
        updatedTabKey[type] = key
        this.setState(updatedTabKey)
        /*
        TODO: Below does the same thing. Should update to use that pattern in this project
        - this.setState({ [type]: key });
        */
    }
    onGlobeClicked = (curTrip) => {
        if (curTrip.locations && curTrip.locations.length>0){
            this.props.launchMapModal(curTrip.title, curTrip.locations)
        }
    }
    showDeleteConfirm = (tripId, tripInstance) => {
        confirm({
          title: 'Are you sure you want to delete this trip?',
          icon: <ExclamationCircleOutlined />,
          content: 'After deletion, it will not be recoverable.',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          async onOk() {
            await tripInstance.props.deleteTrip(tripId)
          },
          onCancel() {},
        });
    }
    popoverConfirm = (selectedTrip) => {
        this.props.editTrip(selectedTrip)
        history.push('/addTrip')
    }
    popoverCancel = () => {}

    getTabList = () => {
        let cardTabList = [{ key: 'journal', tab: 'Journal', }]
        
        const tripImages = this.props.trip.images
        if (tripImages && tripImages.length > 0){
            cardTabList.push({ key: 'images', tab: 'Photos' })
        }
        
        //TODO
        //cardTabList.push({ key: 'videos', tab: 'Videos', })
        return cardTabList
    }
    getCardActions = (curTrip) => {
        const actions = []
        actions.push(
            <Tooltip title="View this trip locations on a map">
                <GlobalOutlined key="map" onClick={() => this.onGlobeClicked(curTrip) } />
            </Tooltip>
        )

        if (this.isCurUserTrip()){
            actions.push(
                <Tooltip title="Edit this trip information">
                    <Popconfirm
                        title="Are you sure about editing this trip?"
                        onConfirm={() => this.popoverConfirm(curTrip)}
                        onCancel={() => this.popoverCancel()}
                        okText="Yes"
                        cancelText="No" >
                        <EditOutlined key="edit" />
                    </Popconfirm>
                </Tooltip>            
            )
            actions.push(
                <Tooltip title="Delete this trip">
                    <DeleteOutlined key="delete" onClick={() => this.showDeleteConfirm(curTrip._id, this)} />
                </Tooltip>            
            )
        }

        return actions
    }

    isCurUserTrip = () => {
        return this.props.isAuthenticated && this.props.userId === this.props.trip.userId
    }

     render() {
        const curTrip = this.props.trip
        const dateFormat="dddd, MMMM Do YYYY"
        let dateStr = curTrip.startDate.format(dateFormat)
        if (curTrip.endDate){
            dateStr += " - " + curTrip.endDate.format(dateFormat)
        }

        const locAddr = LocationSpans(curTrip.locations)
        const travelerName = (this.props.showMyTrips) ? '' 
                                : TravelerName((this.isCurUserTrip()) ? 'me' : curTrip.userName, curTrip.userEmail)
        
        return (
            <Card
                title={getCardTitle(curTrip.title, curTrip.public)}
                hoverable={true}
                bordered={true}
                extra={dateStr}
                actions={this.getCardActions(curTrip)}
                tabList={this.getTabList()}
                activeTabKey={ this.state.key }
                tabProps={ {size: 'small'} }
                onTabChange={(key) => this.onTabChange(key, 'key') }
                >
                <TripTabContent tabKey={this.state.key} curTrip={curTrip} locAddr={locAddr} travelerName={travelerName} />
            </Card>
        )
    }
}

const { confirm } = Modal
const TripDetails = (props) => {
    return (
        <Typography>
            {props.travelerName && 
            <div className="divTravelerName">{props.travelerName}</div>
            }
            {props.locAddr && 
            <div className="divLocation"> {props.locAddr} </div>
            }
            { 
            props.details.split('\n').map( (line) => { 
                if (line) {
                    return <p>{line}</p>
                }
                return ""
            })
            }
        </Typography>
    )
}
const LocationSpans = (locations) => {
    if (!locations) return null

    return locations.map((loc) => (
        <span className="spanLocation">{loc.fmtAddr}</span>
    ))
}
const TravelerName = (travelerName, travelerEmail) => {
    let name = (travelerName) ? travelerName : travelerEmail
    if (!name){
        name = 'someone'
    }

    return <span>Travelled by {name}</span>
}
const TripTabContent = (props) => {
    let contentComponent = null
    switch (props.tabKey){
        case 'journal':
            contentComponent = <TripDetails details={props.curTrip.details} locAddr={props.locAddr} travelerName={props.travelerName} />
            break

        case 'images':
            contentComponent = <PictureCarousel images={props.curTrip.images}/>
            break

        /* TODO
        case 'videos':
            contentComponent = <span>THIS IS FOR VIDEOS</span>
            break
        */

        default:
            contentComponent = <TripDetails details={props.curTrip.details} locAddr={props.locAddr} travelerName={props.travelerName} />
            break
    }
    
    return contentComponent
}

const getCardTitle = (title, isPublic) => {
    if (isPublic){
        return <span>{title}</span>
    }

    return (
        <span>
            {title}<LockOutlined className="privateIcon" />
        </span>
    )
}

export default Trip