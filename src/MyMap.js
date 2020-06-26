import React, { useState, useEffect } from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import Geocode from 'react-geocode'
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
  })
  const [markerLatLng, setMarkerLatLng] = useState({
    lat: 40.769361,
    lng: -73.977655,
  })
  // Default coordinate is New York, NY
  const [mapCenter, setMapCenter] = useState({
    lat: props.center.lat,
    lng: props.center.lng,
  })

  const addrTypes = {
    city: 'locality',
    state: 'administrative_area_level_1',
    country: 'country',
  }

  useEffect(() => {
    async function updateLocation() {
      const addr = await getAddrFromCoord(markerLatLng.lat, markerLatLng.lng)
      setAddr(addr)
    }

    if (markerLatLng.lat){
      updateLocation()
    }else {
      setAddr({city: '', state: '', country: ''})
    }
  }, [markerLatLng])

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
    let latLngInfo = event.latLng
    let newLat = latLngInfo.lat()
    let newLng = latLngInfo.lng()

    setMapCenter({lat: newLat, lng: newLng})
    setMarkerLatLng({lat: newLat, lng: newLng})
  }

  const marker = <Marker 
                    title={'My titleas tooltip'}
                    name={'SOME NAME'}
                    position={{lat: markerLatLng.lat, lng: markerLatLng.lng}}
                    draggable={true}
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
        <Input name="city" readOnly={true} value={addr.city} />
        <Input name="state" readOnly={true} value={addr.state} />
        <Input name="country" readOnly={true} value={addr.country} />
      </div>
    );
  }
))

export default MyMap;