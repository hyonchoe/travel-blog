/**
 * Unit tests for useTripData() hook
 * 
 * Run by running 'npm test' in command line.
 */

import { act } from 'react-dom/test-utils'
import { testHook } from '../../../testutils/testHook'
import mockData from '../../../testutils/mockData'
import useTripData from './useTripData'
import tripService from '../../../services/api'

let useTripDataHook
describe('useTripData()', () => {
    const publicTripsData = [ mockData().getTrip() ]
    const privateTrip = mockData().getTrip()
    privateTrip.public = false
    const privateTripsData = [ privateTrip ]

    beforeEach(() => {
        tripService.getTrips = jest.fn().mockResolvedValue(privateTripsData)
        tripService.getPublicTrips = jest.fn().mockResolvedValue(publicTripsData)
        tripService.deleteTrip = jest.fn()
    })
    
    describe('for my trips', () => {
        beforeEach(async () => {
            await act(async () => {
                testHook(() => {
                    useTripDataHook = useTripData(true)
                })
            })
        })

        describe('calls correct API', () => {
            it('for loading', () => {
                expect(tripService.getTrips).toHaveBeenCalled()
            })

            it('for deleting', async () => {
                await act( async () => {
                    useTripDataHook.handleDeleteTrip()
                })
                
                expect(tripService.deleteTrip).toHaveBeenCalled()
            })
        })
    })


    describe('for public trips', () => {
        beforeEach(async () => {
            await act(async () => {
                testHook(() => {
                    useTripDataHook = useTripData(false)
                })
            })
        })
        
        describe('calls correct API', () => {
            it('for initial loading', () => {
                expect(tripService.getPublicTrips).toHaveBeenCalled()
            })
    
            it('for reloading', async () => {
                tripService.getPublicTrips = jest.fn()
                
                await act( async () => {
                    useTripDataHook.reloadTripData()
                })
    
                expect(tripService.getPublicTrips).toHaveBeenCalled()
            })

            it('for loading more', async () => {
                const otherPublicTrip = mockData().getTrip()
                otherPublicTrip._id = otherPublicTrip._id + 'other'
                const morePublicTripsData = [ otherPublicTrip ]
                tripService.getPublicTrips = jest.fn().mockResolvedValue(morePublicTripsData)
                
                await act( async () => {
                    useTripDataHook.onLoadMore()
                })

                expect(tripService.getPublicTrips).toHaveBeenCalledWith(publicTripsData[0])
            })
        })
    })  
})