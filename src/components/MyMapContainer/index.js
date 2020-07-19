import React from "react"
import MyMap from "./MyMap.js"

const MyMapContainer = props => {
	const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY
	const mapURL = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=3.exp&libraries=geometry,drawing,places`

	return (    
			<MyMap
				searchMode={ props.searchMode }
				tripLocations={ props.tripLocations }
				mapCenterLat={ props.mapCenterLat }
				mapCenterLng={ props.mapCenterLng }
				markerLat={ props.markerLat }
				markerLng={ props.markerLng }
				onLocSelected={ props.onLocSelected }
                googleMapURL={mapURL}
				loadingElement={<div style={{ height: `100%` }} />}
				containerElement={<div style={{ height: `450px`, width: `450px` }} />}
				mapElement={<div style={{ height: `100%` }} />}
			/>
	)
}

export default MyMapContainer