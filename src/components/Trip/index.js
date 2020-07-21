/**
 * Trip component for displaying individual trip information in a card
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'
import { LocationSpans, TravelerName, CardTitle, TripTabContent, TripDates, getCardActions } from './helpers/tripComponents'
import useTripTabs from './helpers/useTripTabs'
import './style.css'

const Trip = (props) => {
    Trip.propTypes = {
        /** Flag for user is authenticated */
        isAuthenticated: PropTypes.bool.isRequired,
        /** Authenticated user ID */
        userId: PropTypes.string.isRequired,
        /** Flag for being in My Trips page */
        showMyTrips: PropTypes.bool.isRequired,
        /** Trip data */
        trip: PropTypes.object.isRequired,
        /** Callback for launching map */
        launchMapModal: PropTypes.func.isRequired,
        /** Callback for editing trip */
        editTrip: PropTypes.func.isRequired,
        /** Callback for deleting trip */
        deleteTrip: PropTypes.func.isRequired,
    }
    Trip.defaultProps = {
        isAuthenticated: false,
        userId: '',
        showMyTrips: false,
        trip: {},
        launchMapModal: () => {},
        editTrip: () => {},
        deleteTrip: () => {},
    }

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

//#region Helper methods
/**
 * Checks if given trip is authenticated user's trip
 * @param {boolean} isAuthenticated Flag for user is authenticated
 * @param {string} userId Authenticated user ID
 * @param {string} tripUserId User ID of the trip owner
 * @returns {boolean} True if user's trip, false otherwise
 */
export const checkIsMyTrip = (isAuthenticated, userId, tripUserId) => {
    return isAuthenticated && (userId === tripUserId)
}
//#endregion

export default Trip