import React from 'react'
import { Typography } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import PictureCarousel from '../PictureCarousel'
    
export const LocationSpans = (locations, cssStyle) => {
    if (!locations) return null

    return locations.map((loc) => (
        <span className={cssStyle}>{loc.fmtAddr}</span>
    ))
}

export const TravelerName = (showMyTrips, isMyTrip, userInfo) => {    
    if (showMyTrips) return ''
    
    let name = (isMyTrip) ? 'me' : (userInfo.userName) ? userInfo.userName : userInfo.userEmail
    if (!name){
        name = 'someone'
    }

    return <span>Travelled by {name}</span>
}

export const getCardTitle = (title, isPublic, cssStyle) => {
    if (isPublic){
        return <span>{title}</span>
    }

    return (
        <span>
            {title}<LockOutlined className={cssStyle} />
        </span>
    )
}

export const TripTabContent = (props) => {
    let contentComponent = null
    switch (props.tabKey){
        case 'journal':
            contentComponent = <TripDetails 
                                details={props.curTrip.details}
                                locAddr={props.locAddr}
                                travelerName={props.travelerName}
                                cssStyle={props.cssStyle} />
            break

        case 'images':
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

export const TripDates = (curTrip) => {
    const dateFormat="dddd, MMMM Do YYYY"
    let dateStr = curTrip.startDate.format(dateFormat)
    if (curTrip.endDate){
        dateStr += " - " + curTrip.endDate.format(dateFormat)
    }    
    
    return dateStr
}

const TripDetails = (props) => {
    return (
        <Typography>
            {props.travelerName && 
            <div className={props.cssStyle.name}>{props.travelerName}</div>
            }
            {props.locAddr && 
            <div className={props.cssStyle.loc}> {props.locAddr} </div>
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