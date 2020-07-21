/**
 * Hook for handling trip creation or update to server
 */

import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import tripService from '../../../services/api'

const useTripCreateUpdate = () => {
    const { user, getAccessTokenSilently } = useAuth0()
    const [savingInProgress, setSavingInProgress] = useState(false)

    /**
     * Creates new trip
     * @param {Object} trip Trip data to create
     * @returns {boolean} True for success, false otherwise
     */
    const createTrip = async (trip) => {
        setSavingInProgress(true)
        trip.userName = user.given_name
        trip.userEmail = user.email
        const res = await tripService.submitNewTrip(trip, getAccessTokenSilently)
        setSavingInProgress(false)

        return res
    }

    /**
     * Updates existing trip with given data
     * @param {Object} updatedTrip Trip data for update
     * @param {string} tripId Trip ID for trip to update
     */
    const updateTrip = async (updatedTrip, tripId) => {
        setSavingInProgress(true)
        await tripService.updateTrip(updatedTrip, tripId, getAccessTokenSilently)
        setSavingInProgress(false)
    }

    return { savingInProgress, createTrip, updateTrip }
}

export default useTripCreateUpdate