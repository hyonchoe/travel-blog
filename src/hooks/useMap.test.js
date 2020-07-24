/**
 * Unit tests for useMap() hook.
 * 
 * Run by running 'npm test' in command line.
 */

import { act } from 'react-dom/test-utils'
import { testHook } from '../testutils/testHook'
import mockData from '../testutils/mockData'
import useMap from './useMap'

let useMapHook
describe('useMap()', () => {
    beforeEach(() => {
        testHook(() => {
            useMapHook = useMap()
        })
    })

    it('sets and clears map location data', () => {
        const locAddrInfo = mockData().loc1
        delete locAddrInfo.latLng
        const locLatLngInfo = {
            lat: 30.24,
            lng: 25.21,
        }
        
        act(() => {
            useMapHook.setLocationData(locAddrInfo, locLatLngInfo)
        })
        expect(useMapHook.addr).toEqual(locAddrInfo)
        expect(useMapHook.markerLatLng).toEqual(locLatLngInfo)
        expect(useMapHook.mapCenter).toEqual(locLatLngInfo)

        act(() => {
            useMapHook.clearMapStates()
        })
        expect(useMapHook.addr).toEqual(useMapHook.getInitialAddr())
        expect(useMapHook.markerLatLng).toEqual(useMapHook.getInitialMarker())
        expect(useMapHook.mapCenter).toEqual(useMapHook.getInitialMapCenter())
    })
})