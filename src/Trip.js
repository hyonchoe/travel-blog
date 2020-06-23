import React from 'react'

class Trip extends React.Component {
    /**
     * Will be adding state information to this component later on
     * when more actions can be taken, such as viewing images, and so on.
     */
    render() {
        return (
            <div className="tripContainer">
                <TripTitle title={this.props.title}/>
                <TripDate date={this.props.date} />
                <TripDetails details={this.props.details} />
            </div>
        )
    }
}

const TripTitle = (props) => {
    return <h1>{props.title}</h1>
}
const TripDate = (props) => {
    return <h4>{props.date}</h4>
}
const TripDetails = (props) => {
    return (
        <textarea readOnly={true} value={props.details} />
    )
}

export default Trip