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
    
    const getInitialMapCenter = () => {
        return {
            lat: 40.730610,
            lng: -73.935242,
        }
    }
    const getInitialAddr = () => {
        return {
            city: '',
            state: '',
            country: '',
            fmtAddr: '',
        }
    }
    const getInitialMarker = () => {
        return {
            lat: null,
            lng: null,
        }
    }
    const clearMapStates = () => {
        const resetAddr = getInitialAddr()
        const resetMarker = getInitialMarker()
        const resetMapCenter = getInitialMapCenter()

        setAddr(resetAddr)
        setMarkerLatLng(resetMarker)
        setMapCenter(resetMapCenter)
    }
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