import React from 'react'
import { Typography, Card } from 'antd'

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

        return (
            <div className="tripContainer">
                <Card
                    title={this.props.title}
                    hoverable={true}
                    bordered={true}
                    extra="More">
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

export default Trip