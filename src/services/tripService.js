import axios from 'axios'
import moment from 'moment'

export default {
    submitNewTrip: async (trip, getAccessTokenSilently) => {
        const headers = await getAuthHeader(getAccessTokenSilently)
        let res = await axios.post('/trips', trip, headers)
        return res
    },

    getTrips: async (getAccessTokenSilently) => {
        try {
            const headers = await getAuthHeader(getAccessTokenSilently)
            let res = await axios.get('/trips', headers)
            if (res.data){
                return processTripData(res.data, true)
            }
        } catch (error){
            console.log(error)
        }
    
        return []
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
            if (res.data){
                return processTripData(res.data, false)
            }
        } catch (error){
            console.log(error)
        }

        return []
    },

    updateTrip: async (updatedTrip, tripId, getAccessTokenSilently) => {
        try {
            const headers = await getAuthHeader(getAccessTokenSilently)
            let res = await axios.put(`/trips/${tripId}`, updatedTrip, headers)
            console.log(res)
            return res
        } catch (error) {
            console.log(error)
            return null
        }
    },

    deleteTrip: async (tripId, getAccessTokenSilently) => {
        try {
            const headers = await getAuthHeader(getAccessTokenSilently)
            let res = await axios.delete(`/trips/${tripId}`, headers)
            console.log(res)
            return res
        } catch (error) {
            console.log(error)
            return null
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

    uploadToS3: async (file, signedUrl) => {
        console.log(file)
        console.log(signedUrl)
        try{
            let res = await axios.put(`/uploadToS3`, file)
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }
}

const getAuthHeader = async (getAccessTokenSilently) => {
    const token = await getAccessTokenSilently()
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }        
    }
}

const processTripData = (trips, sort) => {
    trips = processDates(trips)
    if (sort){
        sortTrips(trips)
    }

    return trips
}

const processDates = (trips) => {
    const curTrips = trips.map((trip) => {
        trip.startDate = moment(trip.startDate)
        trip.endDate = moment(trip.endDate)
        return trip
    })

    return curTrips    
}

// Sort by end date first, then start date.
// Most recent dates should appear first in the list
const sortTrips = (trips) => {
    trips.sort((a, b) => {
        if (a.endDate.isSame(b.endDate, 'day')){
            return (a.startDate.isAfter(b.startDate, 'day')) ? -1 : 1
        }
        else if(a.endDate.isAfter(b.endDate, 'day')) {
            return -1
        }
        else {
            return 1
        }
    })
}