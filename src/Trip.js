import React from 'react'
import { Typography, Card } from 'antd'

class Trip extends React.Component {
    /**
     * Will be adding state information to this component later on
     * when more actions can be taken, such as viewing images, and so on.
     */
    render() {
        return (
            <div className="tripContainer">
                <Card
                    title={this.props.title}
                    hoverable={true}
                    bordered={true}
                    extra="More">
                    <Card.Meta title={this.props.date}/>
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