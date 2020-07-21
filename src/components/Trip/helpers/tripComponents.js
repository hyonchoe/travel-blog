/**
 * Helper components/functions to use for Trip component
 */

import React from 'react'
import { Typography, Tooltip, Popconfirm } from 'antd'
import { LockOutlined, GlobalOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { journalKey, imageKey } from './useTripTabs'
import PictureCarousel from '../../PictureCarousel'
import { onGlobeClicked, popoverConfirm, popoverCancel, showDeleteConfirm } from './cardActions'

/**
 * Array of spans that displays trip locations
 * @param {Array} locations Trip location data
 * @param {string} cssStyle CSS style to use
 */
export const LocationSpans = (locations, cssStyle) => {
    if (!locations) return null

    return locations.map((loc, index) => (
        <span className={cssStyle} key={index}>{loc.fmtAddr}</span>
    ))
}

/**
 * Displays traveler's name/identifier
 * @param {boolean} showMyTrips Flag for My Trips page
 * @param {boolean} isMyTrip Flag for trip being user's trip
 * @param {Object} userInfo User info
 */
export const TravelerName = (showMyTrips, isMyTrip, userInfo) => {    
    if (showMyTrips) return ''
    
    let name = (isMyTrip) ? 'me' : (userInfo.userName) ? userInfo.userName : userInfo.userEmail
    if (!name){
        name = 'someone'
    }

    return <span>Travelled by {name}</span>
}

/**
 * Displays trip title
 * @param {string} title Trip title
 * @param {boolean} isPublic Flag for trip available for public access
 * @param {string} cssStyle CSS style to use
 */
export const CardTitle = (title, isPublic, cssStyle) => {
    if (isPublic){
        return <span>{title}</span>
    }

    return (
        <span>
            {title}<LockOutlined className={cssStyle} />
        </span>
    )
}

/**
 * Displays trip data corresponding to currently selected card tab
 * @param {Object} props Component props
 */
export const TripTabContent = (props) => {
    let contentComponent = null
    switch (props.tabKey){
        case journalKey:
            contentComponent = <TripDetails 
                                details={props.curTrip.details}
                                locAddr={props.locAddr}
                                travelerName={props.travelerName}
                                cssStyle={props.cssStyle} />
            break

        case imageKey:
            contentComponent = <PictureCarousel images={props.curTrip.images}/>
            break

        default:
            contentComponent = <TripDetails 
                                details={props.curTrip.details}
                                locAddr={props.locAddr}
                                travelerName={props.travelerName}
                                cssStyle={props.cssStyle} />
            break
    }
    
    return contentComponent
}

/**
 * Displays trip's dates
 * @param {Object} curTrip Trip data
 */
export const TripDates = (curTrip) => {
    const dateFormat="dddd, MMMM Do YYYY"
    let dateStr = curTrip.startDate.format(dateFormat)
    if (curTrip.endDate){
        dateStr += " - " + curTrip.endDate.format(dateFormat)
    }
    
    return dateStr
}

/**
 * @callback launchMapCallback
 */
/**
 * @callback editTripCallback
 */
/**
 * @callback deleteTripCallback
 */
/**
 * Array of components that is used as actions on Trip component
 * @param {Object} curTrip Trip data
 * @param {boolean} isCurUserTrip Flag for trip being user's trip
 * @param {launchMapCallback} launchMapCallback Callback to use for launch map action
 * @param {editTripCallback} editTripCallback Callback to use for edit trip action
 * @param {deleteTripCallback} deleteCallback Callback to use for delete trip action
 */
export const getCardActions = (curTrip, isCurUserTrip, launchMapCallback, editTripCallback, deleteCallback) => {
    const actions = []
    actions.push(
        <Tooltip title="View this trip locations on a map" key ={0}>
            <GlobalOutlined key="map" onClick={() => onGlobeClicked(curTrip, launchMapCallback) } />
        </Tooltip>
    )

    if (isCurUserTrip){
        actions.push(
            <Tooltip title="Edit this trip information" key={1}>
                <Popconfirm
                    title="Are you sure about editing this trip?"
                    onConfirm={() => popoverConfirm(curTrip, editTripCallback)}
                    onCancel={() => popoverCancel()}
                    okText="Yes"
                    cancelText="No" >
                    <EditOutlined key="edit" />
                </Popconfirm>
            </Tooltip>            
        )
        actions.push(
            <Tooltip title="Delete this trip" key={2}>
                <DeleteOutlined key="delete" onClick={() => showDeleteConfirm(curTrip._id, curTrip.title, deleteCallback)} />
            </Tooltip>
        )
    }

    return actions
}

/**
 * Displays trip details with some additional data if applicable
 * @param {Object} props Component props
 */
const TripDetails = (props) => {
    return (
        <Typography>
            {props.travelerName && 
            <div className={props.cssStyle.name}>{props.travelerName}</div>
            }
            {props.locAddr && 
            <div className={props.cssStyle.loc}>{props.locAddr}</div>
            }
            { 
            props.details.split('\n').map((line, index) => { 
                if (line) {
                    return <p key={index}>{line}</p>
                }
                return ""
            })
            }
        </Typography>
    )
}