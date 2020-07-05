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
                return processDates(res.data)
            }
        } catch (error){
            console.log(error)
        }
    
        return []
    },

    getPublicTrips: async () => {
        try {
            let res = await axios.get('/publicTrips')
            if (res.data){
                return processDates(res.data)
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

const processDates = (trips) => {
    const curTrips = trips.map((trip) => {
        trip.startDate = moment(trip.startDate)
        trip.endDate = moment(trip.endDate)
        return trip
    })

    return curTrips    
}