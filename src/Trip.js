import React from 'react'
import { Typography, Card } from 'antd'
import { GlobalOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';


import './Trip.css'

class Trip extends React.Component {
    /**
     * Will be adding state information to this component later on
     * when more actions can be taken, such as viewing images, and so on.
     */    

     state = {
         key: 'journal',
     }

    onTabChange = () => {

    }

     render() {
        const curTrip = this.props.trip
        const dateFormat="dddd, MMMM Do YYYY"
        let dateStr = curTrip.startDate.format(dateFormat)
        if (curTrip.endDate){
            dateStr += " - " + curTrip.endDate.format(dateFormat)
        }

        const locAddr = LocationSpans(curTrip.locations)
        const tabList = [
            {
                key: 'journal',
                tab: 'Journal',
            },
            {
                key: 'pictures',
                tab: 'Pictures',
            },
        ]
        return (
            <div className="tripContainer">
                <Card
                    title={curTrip.title}
                    hoverable={true}
                    bordered={true}
                    extra={dateStr}
                    actions={[
                        <GlobalOutlined key="map" onClick={() => this.props.launchMapModal(curTrip.title, curTrip.locations)} />,
                        <EditOutlined key="edit" onClick={() => this.props.editTrip(curTrip._id) } />,
                        <DeleteOutlined key="delete" onClick={() => this.props.deleteTrip(curTrip._id) } />,
                    ]}
                    tabList={tabList}
                    activeTabKey={ this.state.key }
                    tabProps={ {size: 'small'} }
                    onTabChange={() => this.onTabChange }
                    >
                    {locAddr && 
                    <div className="divLocation"> {locAddr} </div>
                    }
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
const LocationSpans = (locations) => {
    if (!locations) return null

    return locations.map((loc) => (
        <span className="spanLocation">{loc.fmtAddr}</span>
    ))
}

export default Trip