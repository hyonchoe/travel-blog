import React, { useState, useEffect } from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import Geocode from 'react-geocode'
import Autocomplete from 'react-google-autocomplete'
import { Input } from "antd";

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY)
Geocode.setLanguage('en')
Geocode.enableDebug()

// Central park: lat:40.769361, lng: -73.977655
// NY: lat: 40.730610,  lng: -73.935242
//TODO:
// - Remve pre-set lat and lng
// - Implement autocomplete box and create marker from there

const MyMap = withScriptjs(withGoogleMap((props) =>{
  const [addr, setAddr] = useState({
    city: '',
    state: '',
    country: '',
    formattedAddr: '',
  })
  const [markerLatLng, setMarkerLatLng] = useState({
    lat: (props.searchResult) ? props.searchResult.lat : null,
    lng: (props.searchResult) ? props.searchResult.lng : null,
  })
  // Default coordinate is New York, NY
  const [mapCenter, setMapCenter] = useState({
    lat: props.center.lat,
    lng: props.center.lng,
  })
  const [placeId, setPlaceId] = useState('')

  const addrTypes = {
    city: 'locality',
    state: 'administrative_area_level_1',
    country: 'country',
  }

  useEffect(() => {
    /*
    async function updateLocation() {
      const addr = await getAddrFromCoord(markerLatLng.lat, markerLatLng.lng)
      setAddr(addr)
    }
    */

    if (markerLatLng.lat){
      //updateLocation()
    }else {
      setAddr({city: '', state: '', country: ''})
    }
  }, [markerLatLng])

  /*
  const getAddrFromCoord = async (lat, lng) => {
      let addr = {}
      try {
        const response = await Geocode.fromLatLng(lat, lng)
        const addrComponents = response.results[0].address_components
  
        let city = findSpecificAddrComp(addrComponents, addrTypes.city)
        let state = findSpecificAddrComp(addrComponents, addrTypes.state)
        let country = findSpecificAddrComp(addrComponents, addrTypes.country)
        addr['city'] = city
        addr['state'] = state
        addr['country'] = country
      } catch (error) {
        console.error(error)
      }

      return addr
  }
  */

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

  const onMarkerDragEnd = (event) => {
    const latLngInfo = event.latLng
    const newLat = latLngInfo.lat()
    const newLng = latLngInfo.lng()

    setMapCenter({lat: newLat, lng: newLng})
    setMarkerLatLng({lat: newLat, lng: newLng})
  }
  const onPlaceSelected = (place) => {
    const addrComponents = place.address_components
    const latLngInfo = place.geometry.location
    const newLat = latLngInfo.lat()
    const newLng = latLngInfo.lng()
  
    const city = findSpecificAddrComp(addrComponents, addrTypes.city)
    const state = findSpecificAddrComp(addrComponents, addrTypes.state)
    const country = findSpecificAddrComp(addrComponents, addrTypes.country)
    addr['city'] = city
    addr['state'] = state
    addr['country'] = country
    addr['formattedAddr'] = place.formatted_address

    setPlaceId(place.place_id)
    setMapCenter({lat: newLat, lng: newLng})
    setMarkerLatLng({lat: newLat, lng: newLng})
  }

  const marker = <Marker 
                    title={'My titleas tooltip'}
                    name={'SOME NAME'}
                    position={{lat: markerLatLng.lat, lng: markerLatLng.lng}}
                    draggable={false}
                    onDragEnd={onMarkerDragEnd}
                    /> 
  return (
      <div>
        <GoogleMap
          defaultZoom={10}
          center={ { lat: mapCenter.lat, lng: mapCenter.lng } }
          >
            {marker}
        </GoogleMap>

        <Autocomplete
          style={{
            width: '100%',
            height: '40px',
            paddingLeft: '16px',
            marginTop: '2px',
            marginBottom: '100px'
          }}
          onPlaceSelected = { onPlaceSelected }
          types={['(regions)']}
        />

        <Input name="city" readOnly={true} value={addr.city} />
        <Input name="state" readOnly={true} value={addr.state} />
        <Input name="country" readOnly={true} value={addr.country} />
      </div>
    );
  }
))

export default MyMap;