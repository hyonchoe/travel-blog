/**
 * Unit tests for useTripCreateUpdate() hook.
 * 
 * Run by running 'npm test' in command line.
 */

import { act } from '@testing-library/react'
import * as hooks from '@auth0/auth0-react'
import { testHook } from '../../../testutils/testHook'
import tripService from '../../../services/api'
import useTripCreateUpdate from './useTripCreateUpdate'

let useTripCUHook
describe('useTripCreateUpdate()', () => {
    jest.spyOn(hooks, 'useAuth0').mockImplementation(() => ({
        user: { name: 'dummyname', email: 'dummyemail', sub: 'dummysub' },
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
        const dummyTrip = {}
        await act( async () => {
            useTripCUHook.createTrip(dummyTrip)
        })
        expect(tripService.submitNewTrip).toHaveBeenCalled()
    })

    it('calls correct API for updating existing trip', async () => {
        const dummyTrip = {}
        const dummyTripId = 'dummyId'
        await act( async () => {
            useTripCUHook.updateTrip(dummyTrip, dummyTripId)
        })
        expect(tripService.updateTrip).toHaveBeenCalled()
    })
})