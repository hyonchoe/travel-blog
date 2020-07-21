/**
 * Unit tests for useTripData() hook
 * 
 * Run by running 'npm test' in command line.
 */

import { act } from 'react-dom/test-utils'
import { testHook } from '../../../testutils/testHook'
import useTripData from './useTripData'
import tripService from '../../../services/api'

let useTripDataHook
describe('useTripData()', () => {
    const mockTripData = [ { dummyData: 'dummyData' } ]

    beforeEach(() => {
        tripService.getTrips = jest.fn().mockResolvedValue(mockTripData)
        tripService.getPublicTrips = jest.fn().mockResolvedValue(mockTripData)
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
                const mockTripData2 = [ { dummyData: 'dummyData2' } ]
                tripService.getPublicTrips = jest.fn().mockResolvedValue(mockTripData2)
                
                await act( async () => {
                    useTripDataHook.onLoadMore()
                })

                expect(tripService.getPublicTrips).toHaveBeenCalledWith(mockTripData[0])
            })
        })
    })  
})