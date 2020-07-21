import moment from 'moment'

const mockData = () => {
    //#region Data values
    const tripId = 'dummytripid'
    const otherTripId = 'otherdummytripid'
    const userId = 'dummyuserid'
    const userName = 'dummyusername'
    const userEmail = 'dummyuseremail'
    const title = 'dummytitle'
    const isPublic = true
    const details = 'dummydetails'
    const loc1 = {
        fmtAddr: 'dummyfmtaddr1',
        latLng: [1, 1],
        city: 'dummycity1',
        state: 'dummystate1',
        country: 'dummycountry1',
    }
    const loc2 = {
        fmtAddr: 'dummyfmtaddr2',
        latLng: [2, 2],
        city: 'dummycity2',
        state: 'dummystate2',
        country: 'dummycountry2',
    }
    const locations = [loc1, loc2]
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
    //#endregion

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

    const getUserInfo = () => ({
        userName,
        userEmail,
    })

    const getAuth0UserInfo = () => ({
        name: 'dummyname',
        email: 'dummyemail',
        sub: 'dummysub'
    })

    return {
        tripId, otherTripId, title, startDate, endDate,
        images, locations, loc1,
        getTrip, getLastTripLoaded, getUserInfo,
        getAuth0UserInfo
    }
}

export default mockData