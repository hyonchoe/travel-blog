import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import Autocomplete from 'react-google-autocomplete'

// Central park: lat:40.769361, lng: -73.977655
// NY: lat: 40.730610,  lng: -73.935242

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

  const onPlaceSelected = (place) => {
    const addrComponents = place.address_components
    const latLngInfo = place.geometry.location
    const newLat = latLngInfo.lat()
    const newLng = latLngInfo.lng()
  
    const city = findSpecificAddrComp(addrComponents, addrTypes.city)
    const state = findSpecificAddrComp(addrComponents, addrTypes.state)
    const country = findSpecificAddrComp(addrComponents, addrTypes.country)
    const fmtAddr = place.formatted_address

    //TODO: update these to call prop functions
    //setMapCenter({lat: newLat, lng: newLng})
    //setMarkerLatLng({lat: newLat, lng: newLng})
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

  /**
   * mapCenterLat={}
mapCenterLng={}
markerLat={}
markerLng={}
   */

  
  let markers = null
  if (props.searchMode){
    if (props.markerLat && props.markerLng){
      markers = <Marker position={{ lat: props.markerLat, lng: props.markerLng }} /> 
    }
  } else {
    // TODO for displaying existing trip data
  }

  return (
      <div>
        <GoogleMap
          defaultZoom={10}
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