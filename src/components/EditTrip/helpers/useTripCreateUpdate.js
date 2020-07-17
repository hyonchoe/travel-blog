import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import tripService from '../../../services/api'

const useTripCreateUpdate = () => {
    const [savingInProgress, setSavingInProgress] = useState(false)

    const { user, getAccessTokenSilently } = useAuth0()

    const createTrip = async (trip) => {
        setSavingInProgress(true)
        trip.userName = user.given_name
        trip.userEmail = user.email
        const res = await tripService.submitNewTrip(trip, getAccessTokenSilently)
        setSavingInProgress(false)

        return res
    }

    const updateTrip = async (updatedTrip, tripId) => {
        setSavingInProgress(true)
        await tripService.updateTrip(updatedTrip, tripId, getAccessTokenSilently)
        setSavingInProgress(false)
    }

    return { savingInProgress, createTrip, updateTrip }
}

export default useTripCreateUpdate