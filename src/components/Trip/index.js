import React from 'react'
import { Card } from 'antd'
import './style.css'

import { LocationSpans, TravelerName, getCardTitle, TripTabContent, TripDates } from './tripComponents'
import { getTabList, getCardActions } from './cardActions'
import useTripTabs from './useTripTabs'

const Trip = (props) => {
    const { tabState, onTabChange } = useTripTabs()
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
    const isMyTrip = isAuthenticated && (userId === trip.userId)
    const travelerName = TravelerName(showMyTrips, isMyTrip, { 
                                userName: trip.userName,
                                userEmail: trip.userEmail
                        })
    return (
        <Card
            title={getCardTitle(trip.title, trip.public, 'privateIcon')}
            hoverable={true}
            bordered={true}
            extra={TripDates(trip)}
            actions={getCardActions(trip, isMyTrip, launchMapModal, editTrip, deleteTrip)}
            tabList={getTabList(trip.images)}
            activeTabKey={ tabState.key }
            tabProps={ {size: 'small'} }
            onTabChange={(key) => onTabChange(key, 'key') }
            >
            <TripTabContent 
                tabKey={tabState.key}
                curTrip={trip}
                locAddr={locAddr}
                travelerName={travelerName}
                cssStyle={{name: 'divTravelerName', loc: 'divLocation' }}
                 />
        </Card>
    )
}

export default Trip