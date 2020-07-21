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

    const image1 = {
        name: 'dummyname1',
        fileUrlName: 'dummyurlname1',
        S3Url: 'dummys3url1'
    }
    const image2 = {
        name: 'dummyname2',
        fileUrlName: 'dummyurlname2',
        S3Url: 'dummys3url2'
    }
    const image3 = {
        name: 'dummyname3',
        fileUrlName: 'dummyurlname3',
        S3Url: 'dummys3url3'
    }
    const images = [image1, image2, image3]
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
        images,
        getTrip, getLastTripLoaded
    }
}

export default mockData