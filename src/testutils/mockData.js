import moment from 'moment'

const mockData = () => {
    const tokenVal = 'dummytoken'
    
    const tripId = 'dummytripid'
    const otherTripId = 'otherdummytripid'
    const userId = 'dummyuserid'
    const userName = 'dummyusername'
    const userEmail = 'dummyuseremail'
    const title = 'dummytitle'
    const isPublic = true
    const details = 'dummydetails'
    const locations = [
        {fmtAddr: 'dummyaddr'}
    ]
    const images = []
    const startDate = moment('2020-07-01', 'YYYY-MM-DD')
    const endDate = moment('2020-07-04', 'YYYY-MM-DD')

    const fileType = 'dummyfiletype'

    const getTrip = () => ({
        _id: tripId,
        userId,
        userName,
        userEmail,
        title,
        startDate,
        endDate,
        public: isPublic,
        details,
        locations,
        images
    })

    const getLastTripLoaded = () => ({
        _id: tripId,
        startDate: startDate,
        endDate: endDate,
    })

    return {
        tokenVal,
        tripId, otherTripId, startDate, endDate,
        fileType,
        getTrip, getLastTripLoaded
    }
}

export default mockData