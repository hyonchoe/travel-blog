/**
 * Unit tests for useTripCreateUpdate() hook.
 * 
 * Run by running 'npm test' in command line.
 */

import { act } from '@testing-library/react'
import * as hooks from '@auth0/auth0-react'
import { testHook } from '../../../testutils/testHook'
import mockData from '../../../testutils/mockData'
import tripService from '../../../services/api'
import useTripCreateUpdate from './useTripCreateUpdate'

let useTripCUHook
describe('useTripCreateUpdate()', () => {
    jest.spyOn(hooks, 'useAuth0').mockImplementation(() => ({
        user: mockData().getAuth0UserInfo(),
        getAccessTokenSilently: jest.fn()
    }))

    beforeEach(async () => {
        tripService.submitNewTrip = jest.fn()
        tripService.updateTrip = jest.fn()

        await act(async () => {
            testHook(() => {
                useTripCUHook = useTripCreateUpdate()
            })
        })
    })

    it('calls correct API for creating new trip', async () => {
        const trip = mockData().getTrip()
        delete trip._id
        delete trip.userId
        delete trip.userName
        delete trip.userEmail

        await act( async () => {
            useTripCUHook.createTrip(trip)
        })
        expect(tripService.submitNewTrip).toHaveBeenCalled()
    })

    it('calls correct API for updating existing trip', async () => {
        const trip = mockData().getTrip()
        
        await act( async () => {
            useTripCUHook.updateTrip(trip, trip._id)
        })
        expect(tripService.updateTrip).toHaveBeenCalled()
    })
})