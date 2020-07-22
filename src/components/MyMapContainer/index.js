/**
 * Wrapper for MyMap component
 */

import React from "react"
import PropTypes from 'prop-types'
import MyMap from "./MyMap.js"

const MyMapContainer = props => {
	MyMapContainer.propTypes = {
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
		onLocSelected: PropTypes.func
	}
	MyMapContainer.defaultProps = {
		searchMode: false,
		tripLocations: []
	}
	
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
			mapElement={<div style={{ height: `100%` }} />} />
	)
}

export default MyMapContainer