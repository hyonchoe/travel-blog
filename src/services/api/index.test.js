/**
 * Unit tests for APIs calls
 * 
 * Run by running 'npm test' in command line.
 */

import axios from 'axios'
import mockData from '../../testutils/mockData'
import tripService from './'

describe('API is calling correct axios HTTP methods with route', () => {
    const dummyTokenVal = 'dummytoken'
    const getAccessTokenSilently = jest.fn().mockReturnValue(dummyTokenVal)
    const headers = { 
        headers: { 'Authorization': `Bearer ${dummyTokenVal}` } 
    }
    beforeEach(() => {
        const dummyData = []
        axios.get = jest.fn().mockResolvedValue({ data: dummyData })
        axios.post = jest.fn()
        axios.put = jest.fn()
        axios.delete = jest.fn()
    })
    
    it('for submitting new trip', async () => {
        const dummyTrip = {}
        const res = await tripService.submitNewTrip(dummyTrip, getAccessTokenSilently)
        expect(axios.post).toHaveBeenCalledWith('/trips', dummyTrip, headers)
    })

    it('getting my trips', async () => {
        const res = await tripService.getTrips(getAccessTokenSilently)
        expect(axios.get).toHaveBeenCalledWith('/trips', headers)
    })

    it('for getting public trips initial load', async () => {
        const res = await tripService.getPublicTrips()
        expect(axios.get).toHaveBeenCalledWith('/publicTrips', null)
    })

    it('for getting public trips subsequent load', async () => {
        const lastTripLoaded = mockData().getLastTripLoaded()
        const params = {
            params: {
                tripId: lastTripLoaded._id,
                startDate: lastTripLoaded.startDate.toISOString(),
                endDate: lastTripLoaded.endDate.toISOString(),
            }
        }
        const res = await tripService.getPublicTrips(lastTripLoaded)
        expect(axios.get).toHaveBeenCalledWith('/publicTrips', params)
    })

    it('for updating existing trip', async () => {
        const dummyTripId = mockData().tripId
        const dummyTrip = mockData().getTrip()
        const res = await tripService.updateTrip(dummyTrip, dummyTripId, getAccessTokenSilently)
        expect(axios.put).toHaveBeenCalledWith(`/trips/${dummyTripId}`, dummyTrip, headers)
    })

    it('for deleting existing trip', async () => {
        const dummyTripId = mockData().tripId
        const dummyTripTitle = mockData().tripTitle
        const res = await tripService.deleteTrip(dummyTripId, dummyTripTitle, getAccessTokenSilently)
        expect(axios.delete).toHaveBeenCalledWith(`/trips/${dummyTripId}`, headers)
    })

    it('for getting S3 signed url', async () => {
        const dummyFileType = 'dummyfiletype'
        const res = await tripService.getS3SignedUrl(dummyFileType, getAccessTokenSilently)
        expect(axios.get).toHaveBeenCalledWith(`/get-signed-url`, {
            ...headers,
            params: {
                type: dummyFileType
            }
        })
    })
})