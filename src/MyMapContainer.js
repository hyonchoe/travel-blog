import React from "react";
import MyMap from "./MyMap.js";

export default class MyMapContainer extends React.Component {
	render() {
        const api_key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY
        const mapURL = `https://maps.googleapis.com/maps/api/js?key=${api_key}&v=3.exp&libraries=geometry,drawing,places`
        
		return (
			<MyMap
				center={this.props.center}
				searchResult={this.props.searchResult}
                googleMapURL={mapURL}
				loadingElement={<div style={{ height: `100%` }} />}
				containerElement={<div style={{ height: `500px`, width: `500px` }} />}
				mapElement={<div style={{ height: `100%` }} />}
			/>
		);
	}
}