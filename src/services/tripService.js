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
    }
}