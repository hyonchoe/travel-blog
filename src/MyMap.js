import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import Autocomplete from 'react-google-autocomplete'

const MyMap = withScriptjs(withGoogleMap((props) =>{

  const addrTypes = {
    city: 'locality',
    state: 'administrative_area_level_1',
    country: 'country',
  }

  const findSpecificAddrComp = (addrComponents, target) => {
    for (let i=0; i<addrComponents.length; i++){
      const comp = addrComponents[i]
      const found = comp.types.find( val => (val === target))
      if (found){
        return (target !== addrTypes.state) ? comp.long_name : comp.short_name
      }      
    }
    return ''
  }

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
  
    const city = findSpecificAddrComp(addrComponents, addrTypes.city)
    const state = findSpecificAddrComp(addrComponents, addrTypes.state)
    const country = findSpecificAddrComp(addrComponents, addrTypes.country)
    const fmtAddr = place.formatted_address

    const locAddrInfo = {}
    locAddrInfo['city'] = city
    locAddrInfo['state'] = state
    locAddrInfo['country'] = country
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
          center={ { lat: props.mapCenterLat, lng: props.mapCenterLng } }
          >
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
          types={['(regions)']}
        />
        }
      </div>
    );
  }
))

export default MyMap;