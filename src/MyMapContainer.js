import React from "react";
import MyMap from "./MyMap.js";

export default class MyMapContainer extends React.Component {
	render() {
        const api_key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY
        const mapURL = `https://maps.googleapis.com/maps/api/js?key=${api_key}&v=3.exp&libraries=geometry,drawing,places`
        
		return (
			<MyMap
				searchMode={this.props.searchMode}
				tripLocations={this.props.tripLocations}
				mapCenterLat={ this.props.mapCenterLat }
				mapCenterLng={ this.props.mapCenterLng }
				markerLat={ this.props.markerLat }
				markerLng={ this.props.markerLng }
				onLocSelected={this.props.onLocSelected}
                googleMapURL={mapURL}
				loadingElement={<div style={{ height: `100%` }} />}
				containerElement={<div style={{ height: `450px`, width: `450px` }} />}
				mapElement={<div style={{ height: `100%` }} />}
			/>
		);
	}
}