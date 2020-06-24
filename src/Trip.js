import React from 'react'
import { Typography, Card, Button } from 'antd'

class Trip extends React.Component {
    /**
     * Will be adding state information to this component later on
     * when more actions can be taken, such as viewing images, and so on.
     */    
     render() {
        const dateFormat="dddd, MMMM Do YYYY"
        let dateStr = this.props.startDate.format(dateFormat)
        if (this.props.endDate){
            dateStr += " - " + this.props.endDate.format(dateFormat)
        }

        const editDeleteActions = <CardAddlActions
                                        index={this.props.index}
                                        editTrip={this.props.editTrip}
                                        deleteTrip={this.props.deleteTrip} />
        return (
            <div className="tripContainer">
                <Card
                    title={this.props.title}
                    hoverable={true}
                    bordered={true}
                    extra={editDeleteActions}>
                    <Card.Meta title={dateStr}/>
                    <TripDetails details={this.props.details} />
                </Card>
            </div>
        )
    }
}

const TripDetails = (props) => {
    return (
        <Typography.Paragraph>{props.details}</Typography.Paragraph>
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

export default Trip