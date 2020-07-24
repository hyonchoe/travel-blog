/**
 * Hook for handling map selection data
 */

import { useState } from 'react'

const useMap = () => {
    const [mapCenter, setMapCenter] = useState({
        // Default coordinate is New York, NY
        lat: 40.730610,
        lng: -73.935242,
    })
    const [markerLatLng, setMarkerLatLng] = useState({
        lat: null,
        lng: null,
    })
    const [addr, setAddr] = useState({
        city: '',
        state: '',
        country: '',
        fmtAddr: '',
    })
    
    /**
     * Gets initial map center data.
     * It's set to New York, NY
     */
    const getInitialMapCenter = () => {
        return {
            lat: 40.730610,
            lng: -73.935242,
        }
    }

    /**
     * Gets initial address data,
     * which is empty.
     */
    const getInitialAddr = () => {
        return {
            city: '',
            state: '',
            country: '',
            fmtAddr: '',
        }
    }

    /**
     * Gets initial map marker data,
     * which is null
     */
    const getInitialMarker = () => {
        return {
            lat: null,
            lng: null,
        }
    }

    /**
     * Clears out map selection data
     */
    const clearMapStates = () => {
        const resetAddr = getInitialAddr()
        const resetMarker = getInitialMarker()
        const resetMapCenter = getInitialMapCenter()

        setAddr(resetAddr)
        setMarkerLatLng(resetMarker)
        setMapCenter(resetMapCenter)
    }

    /**
     * Sets data for the selected location
     * @param {Object} locAddrInfo Address data to use
     * @param {Object} locLatLngInfo Latitude and longitude data to use
     */
    const setLocationData = (locAddrInfo, locLatLngInfo) => {
        setAddr(locAddrInfo)
        setMarkerLatLng(locLatLngInfo)
        setMapCenter(locLatLngInfo)
    }

    return { mapCenter, markerLatLng, addr,
            getInitialAddr, getInitialMapCenter, getInitialMarker,
            clearMapStates, setLocationData }
}

export default useMap