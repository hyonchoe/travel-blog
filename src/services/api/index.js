/**
 * Interacts with backend to handle API actions
 */

import axios from 'axios'
import moment from 'moment'
import { message } from 'antd'

const CREATE_TRIP_ERR_MSG = 'Unable to create trip due to error'
const LOAD_TRIP_ERR_MSG = 'Unable to load trips due to error'
const DELETE_TRIP_ERR_MSG = 'Unable to delete trip due to error'
const UPDATE_TRIP_ERR_MSG = 'There was an issue with the trip update. Check the trip entry.'

export default {
    /**
     * Create new trip
     * @param {Object} trip Trip data to create
     * @param {function() : string} getAccessTokenSilently auth0 function for user authentication/authorization
     * @returns {boolean} True for successful interaction, false otherwise
     */
    submitNewTrip: async (trip, getAccessTokenSilently) => {
        try {
            const headers = await getAuthHeader(getAccessTokenSilently)
            await axios.post('/trips', trip, headers)
            message.success(createTripMsg(trip.title))
            return true
        } catch (error){
            console.error(error)
            message.error(CREATE_TRIP_ERR_MSG)
            return false
        }
    },

    /**
     * Get user trips
     * @param {function() : string} getAccessTokenSilently auth0 function for user authentication/authorization
     * @returns {Array} User trips data
     */
    getTrips: async (getAccessTokenSilently) => {
        try {
            const headers = await getAuthHeader(getAccessTokenSilently)
            let res = await axios.get('/trips', headers)
            return processTripData(res.data)
        } catch (error){
            console.error(error)
            message.error(LOAD_TRIP_ERR_MSG)
            return []
        }
    },

    /**
     * Get public trips
     * @param {Object} lastTripLoaded Last trip loaded data
     * @returns {Array} Public trips data
     */
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
            console.error(error)
            message.error(LOAD_TRIP_ERR_MSG)
            return []
        }
    },

    /**
     * Update existing trip
     * @param {Object} updatedTrip Updated trip data
     * @param {string} tripId Id of the trip
     * @param {function() : string} getAccessTokenSilently auth0 function for user authentication/authorization
     */
    updateTrip: async (updatedTrip, tripId, getAccessTokenSilently) => {
        try {
            const headers = await getAuthHeader(getAccessTokenSilently)
            await axios.put(`/trips/${tripId}`, updatedTrip, headers)
            message.success(updateTripMsg(updatedTrip.title))
        } catch (error) {
            console.error(error)
            message.error(UPDATE_TRIP_ERR_MSG)
        }
    },

    /**
     * Deletes existing trip
     * @param {string} tripId Id of the trip
     * @param {string} tripTitle Title of the trip
     * @param {function() : string} getAccessTokenSilently auth0 function for user authentication/authorization
     */
    deleteTrip: async (tripId, tripTitle, getAccessTokenSilently) => {
        try {
            const headers = await getAuthHeader(getAccessTokenSilently)
            await axios.delete(`/trips/${tripId}`, headers)
            message.success(deleteTripMsg(tripTitle))
            return true
        } catch (error) {
            console.error(error)
            message.error(DELETE_TRIP_ERR_MSG)
            return false
        }
    },

    /**
     * Gets signed S3 url for uploading image to S3
     * @param {string} fileType File type (i.e. image/jpeg)
     * @param {function() : string} getAccessTokenSilently auth0 function for user authentication/authorization
     * @returns {Object} Signed URL data with name information
     */
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
            console.error(error)
            return null
        }
    },
}

//#region Helper methods
/**
 * Gets message for successful trip creation
 * @param {string} tripTitle Trip title
 * @returns {string} Message to display
 */
const createTripMsg = (tripTitle) => `Trip "${tripTitle}" added successfully`

/**
 * Gets message for successful trip update
 * @param {string} tripTitle Trip title
 * @returns {string} Message to display
 */
const updateTripMsg = (tripTitle) => `Trip "${tripTitle}" updated successfully`

/**
 * Gets message for successful trip deletion
 * @param {string} tripTitle Trip title
 * @returns {string} Message to display
 */
const deleteTripMsg = (tripTitle) => `Trip "${tripTitle}" removed successfully`

/**
 * Gets header data with user authorization information to use for HTTP requests
 * @param {function() : string} getAccessTokenSilently auth0 function for user authentication/authorization
 * @returns {Object} Header data with user 
 */
const getAuthHeader = async (getAccessTokenSilently) => {
    const token = await getAccessTokenSilently()
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }        
    }
}

/**
 * Processes trips data obtained from API calls to use in the client
 * @param {Array} trips Trips data
 * @returns {Array} Processed trips data
 */
const processTripData = (trips) => {
    if (trips){
        return processDates(trips)
    }
    return []
}

/**
 * Parses date information to moment objects
 * @param {Array} trips Trips data
 * @returns {Array} Trips data with moment objects for date data
 */
const processDates = (trips) => {
    const curTrips = trips.map((trip) => {
        trip.startDate = moment(trip.startDate)
        trip.endDate = moment(trip.endDate)
        return trip
    })

    return curTrips
}
//#endregion