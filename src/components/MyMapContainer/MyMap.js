/**
 * MyMap component for using Google Map and Autocomplete
 */

import React from "react"
import PropTypes from 'prop-types'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import Autocomplete from 'react-google-autocomplete'
import { getLocAddrInfo } from './helpers/mapUtils'

const MyMap = withScriptjs(withGoogleMap((props) =>{
  MyMap.propTypes= {
    /** Flag for using search vs view mode */
    searchMode: PropTypes.bool.isRequired,
    /** Location data to turn into markers */
    tripLocations: PropTypes.array.isRequired,
    /** Center of the map - latitude */
    mapCenterLat: PropTypes.number.isRequired,
    /** Center of the map - longitutde */
    mapCenterLng: PropTypes.number.isRequired,
    /** Latitude for marker used when searching */
    markerLat: PropTypes.number,
    /** Longitude for marker used when searching */
    markerLng: PropTypes.number,
    /** Callback to call when location selection is made */
    onLocSelected: PropTypes.func.isRequired,
    /** URL with API key to use for Google Maps */
    googleMapURL: PropTypes.string.isRequired,
    /** Container needed for HOCs */
    loadingElement: PropTypes.node.isRequired,
    /** Container needed for HOCs */
    containerElement: PropTypes.node.isRequired,
    /** Container needed for HOCs */
    mapElement: PropTypes.node.isRequired
  }
  MyMap.defaultProps = {
    searchMode: false,
    tripLocations: [],
    onLocSelected: () => {}
  }
  
  /**
   * Creates array of Markers to use on the map
   * @param {Array} tripLocations Location data with latitude and longitude
   * @returns {Array} Markers to use on the map
   */
  const createMarkers = (tripLocations) => {
    const latLngs = []
    tripLocations.forEach((loc)=> {
      const latLngPos = {
        lat: loc.latLng[0],
        lng: loc.latLng[1],
      }
      latLngs.push(latLngPos)
    })

    return latLngs.map((latLng) => (
      <Marker position={{ lat: latLng.lat, lng: latLng.lng, }} />
    ))
  }

  /**
   * Parses out the location information from selected Google Place,
   * and calls the callback with the data
   * @param {Object} place Google Place object from Autocomplete
   */
  const onPlaceSelected = (place) => {
    if (!place.address_components || !place.geometry){
        return
    }

    const addrComponents = place.address_components
    const latLngInfo = place.geometry.location
    const newLat = latLngInfo.lat()
    const newLng = latLngInfo.lng()
  
    const parsedAddrInfo = getLocAddrInfo(addrComponents)
    const fmtAddr = place.formatted_address

    const locAddrInfo = {
      city: parsedAddrInfo.city,
      state: parsedAddrInfo.state,
      country: parsedAddrInfo.country,
      fmtAddr: fmtAddr
    }
    const locLatLngInfo = {
      lat: newLat,
      lng: newLng
    }

    props.onLocSelected(locAddrInfo, locLatLngInfo)
  }
  
  let markers = null
  let zoomLevel = 10
  if (props.searchMode){
    if (props.markerLat && props.markerLng){
      markers = <Marker position={{ lat: props.markerLat, lng: props.markerLng }} /> 
    }
  } else {
    zoomLevel = 6
    if(props.tripLocations){
        markers = createMarkers(props.tripLocations)
    }
  }

  return (
      <div>
        <GoogleMap
          defaultZoom={zoomLevel}
          center={ { lat: props.mapCenterLat, lng: props.mapCenterLng } } >
            {markers}
        </GoogleMap>        
        {props.searchMode &&
        <Autocomplete
          style={{
            width: '100%',
            height: '40px',
            paddingLeft: '16px',
            marginTop: '2px',
            marginBottom: '2px'
          }}
          onPlaceSelected = { onPlaceSelected }
          types={['(regions)']} />
        }
      </div>
    )
  }
))

export default MyMap