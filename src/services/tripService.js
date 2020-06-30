import axios from 'axios'
import moment from 'moment'

export default {
    submitNewTrip: async (trip) => {
        let res = await axios.post('/trips', trip)
        return res
    },

    getTrips: async () => {
        try{
            let res = await axios.get('/trips')
            if (res.data){
                const curTrips = res.data.map((trip) => {
                    trip.startDate = moment(trip.startDate)
                    trip.endDate = moment(trip.endDate)
                    return trip
                })

                return curTrips
            }
        } catch (error){
            console.log(error)
        }
    
        return []
    },

    updateTrip: async (updatedTrip, tripId) => {
        try {
            let res = await axios.put(`/trips/${tripId}`, updatedTrip)
            console.log(res)
            return res
        } catch (error) {
            console.log(error)
            return null
        }
    },

    deleteTrip: async (tripId) => {
        try {
            let res = await axios.delete(`/trips/${tripId}`)
            console.log(res)
            return res
        } catch (error) {
            console.log(error)
            return null
        }
    },

    //TODO
    getS3SignedUrl: async (fileType) => {
        try {
            let res = await axios.get(`/get-signed-url`, {
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