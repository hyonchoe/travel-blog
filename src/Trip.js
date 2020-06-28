import React from 'react'
import { Typography, Card, Button } from 'antd'

import './Trip.css'

class Trip extends React.Component {
    /**
     * Will be adding state information to this component later on
     * when more actions can be taken, such as viewing images, and so on.
     */    

     render() {
        const curTrip = this.props.trip
        const dateFormat="dddd, MMMM Do YYYY"
        let dateStr = curTrip.startDate.format(dateFormat)
        if (curTrip.endDate){
            dateStr += " - " + curTrip.endDate.format(dateFormat)
        }
        
        const locAddr = LocationSpans(curTrip.locations)
        const editDeleteActions = <CardAddlActions
                                        index={curTrip._id}
                                        editTrip={this.props.editTrip}
                                        deleteTrip={this.props.deleteTrip} />
        return (
            <div className="tripContainer">
                <Card
                    title={curTrip.title}
                    hoverable={true}
                    bordered={true}
                    extra={editDeleteActions}>
                    <div className="divDateLocation">
                        <div> {dateStr} </div>
                        {locAddr && 
                        <div> {locAddr} </div>
                        }
                    </div>
                    <TripDetails details={curTrip.details} />
                </Card>
            </div>
        )
    }
}

const TripDetails = (props) => {
    return (
        <Typography>
            { 
                props.details.split('\n').map( (line) => { 
                    if (line) {
                        return <p>{line}</p>
                    }
                    return ""
                })
            }
        </Typography>
    )
}
const CardAddlActions = (props) => {
    const handleEditTrip = props.editTrip
    const handleDeleteTrip = props.deleteTrip
    const index = props.index

    return (
        <div>
            <Button type="link" onClick={()=>handleEditTrip(index)}>
                Edit
            </Button>
            <Button type="link" onClick={()=>handleDeleteTrip(index)}>
                Delete
            </Button>    
        </div>
    )
}
const LocationSpans = (locations) => {
    if (!locations) return null

    return locations.map((loc) => (
        <span className="spanLocation">{loc.fmtAddr}</span>
    ))
}

export default Trip