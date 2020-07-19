import React from 'react'
import { Card } from 'antd'
import { LocationSpans, TravelerName, CardTitle, TripTabContent, TripDates, getCardActions } from './helpers/tripComponents'
import useTripTabs from './helpers/useTripTabs'
import './style.css'

const Trip = (props) => {
    const { tabState, onTabChange, getTabList } = useTripTabs()
    const { 
        isAuthenticated,
        userId,
        showMyTrips,
        trip,
        launchMapModal,
        editTrip,
        deleteTrip,
    } = props

    const locAddr = LocationSpans(trip.locations, 'spanLocation')
    const isMyTrip = checkIsMyTrip(isAuthenticated, userId, trip.userId)
    const travelerName = TravelerName(showMyTrips, isMyTrip, { 
                                userName: trip.userName,
                                userEmail: trip.userEmail
                        })
    return (
        <Card
            title={CardTitle(trip.title, trip.public, 'privateIcon')}
            hoverable={true}
            bordered={true}
            extra={TripDates(trip)}
            actions={getCardActions(trip, isMyTrip, launchMapModal, editTrip, deleteTrip)}
            tabList={getTabList(trip.images)}
            activeTabKey={ tabState.key }
            tabProps={ {size: 'small'} }
            onTabChange={(key) => onTabChange(key, 'key') } >
            <TripTabContent 
                tabKey={tabState.key}
                curTrip={trip}
                locAddr={locAddr}
                travelerName={travelerName}
                cssStyle={{name: 'divTravelerName', loc: 'divLocation' }} />
        </Card>
    )
}

export const checkIsMyTrip = (isAuthenticated, userId, tripUserId) => {
    return isAuthenticated && (userId === tripUserId)
}

export default Trip