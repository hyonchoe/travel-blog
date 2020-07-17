import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import Autocomplete from 'react-google-autocomplete'
import { getLocAddrInfo } from './helpers/mapUtils'

const MyMap = withScriptjs(withGoogleMap((props) =>{

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

    const locAddrInfo = {}
    locAddrInfo['city'] = parsedAddrInfo.city
    locAddrInfo['state'] = parsedAddrInfo.state
    locAddrInfo['country'] = parsedAddrInfo.country
    locAddrInfo['fmtAddr'] = fmtAddr

    const locLatLngInfo = {}
    locLatLngInfo['lat'] = newLat
    locLatLngInfo['lng'] = newLng

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
    );
  }
))

export default MyMap;