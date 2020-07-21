import moment from 'moment'

const mockData = () => {
    const tokenVal = 'dummytoken'
    
    const tripId = 'dummytripid'
    const tripTitle = 'dummytitle'
    const startDate = moment('2020-07-01', 'YYYY-MM-DD')
    const endDate = moment('2020-07-04', 'YYYY-MM-DD')

    const fileType = 'dummyfiletype'

    const getTrip = () => ({
        _id: tripId,
        title: tripTitle,
        startDate: startDate,
        endDAte: endDate,
    })

    const getLastTripLoaded = () => ({
        _id: tripId,
        startDate: startDate,
        endDate: endDate,
    })

    return {
        tokenVal,
        tripId, startDate, endDate,
        fileType,
        getTrip, getLastTripLoaded
    }
}

export default mockData