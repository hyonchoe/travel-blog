import axios from 'axios'
import moment from 'moment'
import { message } from 'antd'

const CREATE_TRIP_ERR_MSG = 'Unable to create trip due to error'
const LOAD_TRIP_ERR_MSG = 'Unable to load trips due to error'
const DELETE_TRIP_ERR_MSG = 'Unable to delete trip due to error'
const UPDATE_TRIP_ERR_MSG = 'There was an issue with the trip update. Check the trip entry.'

export default {
    submitNewTrip: async (trip, getAccessTokenSilently) => {
        try {
            const headers = await getAuthHeader(getAccessTokenSilently)
            await axios.post('/trips', trip, headers)
            message.success(createTripMsg(trip.title))
            return true
        } catch (error){
            console.log(error)
            message.error(CREATE_TRIP_ERR_MSG)
            return false
        }
    },

    getTrips: async (getAccessTokenSilently) => {
        try {
            const headers = await getAuthHeader(getAccessTokenSilently)
            let res = await axios.get('/trips', headers)
            return processTripData(res.data)
        } catch (error){
            console.log(error)
            message.error(LOAD_TRIP_ERR_MSG)
            return []
        }
    },

    getPublicTrips: async (lastTripLoaded) => {
        try {
            const params = (lastTripLoaded) ? { params: {
                                    tripId: lastTripLoaded._id,
                                    startDate: lastTripLoaded.startDate.toISOString(),
                                    endDate: lastTripLoaded.endDate.toISOString(),
                                } }
                                : null
            let res = await axios.get('/publicTrips', params)
            return processTripData(res.data)
        } catch (error){
            console.log(error)
            message.error(LOAD_TRIP_ERR_MSG)
            return []
        }
    },

    updateTrip: async (updatedTrip, tripId, getAccessTokenSilently) => {
        try {
            const headers = await getAuthHeader(getAccessTokenSilently)
            await axios.put(`/trips/${tripId}`, updatedTrip, headers)
            message.success(updateTripMsg(updatedTrip.title))
        } catch (error) {
            console.log(error)
            message.error(UPDATE_TRIP_ERR_MSG)
        }
    },

    deleteTrip: async (tripId, tripTitle, getAccessTokenSilently) => {
        try {
            const headers = await getAuthHeader(getAccessTokenSilently)
            await axios.delete(`/trips/${tripId}`, headers)
            message.success(deleteTripMsg(tripTitle))
            return true
        } catch (error) {
            console.log(error)
            message.error(DELETE_TRIP_ERR_MSG)
            return false
        }
    },

    getS3SignedUrl: async (fileType, getAccessTokenSilently) => {
        try {
            const headers = await getAuthHeader(getAccessTokenSilently)
            let res = await axios.get(`/get-signed-url`, {
                ...headers,
                params: {
                    type: fileType,
                }
            })
            return res.data
        } catch (error) {
            console.log(error)
            return null
        }
    },
}

const createTripMsg = (tripTitle) => `Trip "${tripTitle}" added successfully`
const updateTripMsg = (tripTitle) => `Trip "${tripTitle}" updated successfully`
const deleteTripMsg = (tripTitle) => `Trip "${tripTitle}" removed successfully`
const getAuthHeader = async (getAccessTokenSilently) => {
    const token = await getAccessTokenSilently()
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }        
    }
}
const processTripData = (trips) => {
    if (trips){
        return processDates(trips)
    }
    return []
}
const processDates = (trips) => {
    const curTrips = trips.map((trip) => {
        trip.startDate = moment(trip.startDate)
        trip.endDate = moment(trip.endDate)
        return trip
    })

    return curTrips    
}