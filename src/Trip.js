import React from 'react'
import { Typography, Card, Modal, Popconfirm } from 'antd'
import { GlobalOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
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
        //TODO
    }
    onGlobeClicked = (curTrip) => {
        if (curTrip.locations){
            this.props.launchMapModal(curTrip.title, curTrip.locations)
        }
    }

    showDeleteConfirm = (tripId, tripInstance) => {
        confirm({
          title: 'Are you sure you want to delete this trip?',
          icon: <ExclamationCircleOutlined />,
          content: 'After deletion, it will not be recoverable.',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            tripInstance.props.deleteTrip(tripId)
          },
          onCancel() {}
        });
    }
    popoverConfirm = (tripId) => {
        this.props.editTrip(tripId)
    }
    popoverCancel = () => {
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
                        <GlobalOutlined key="map" onClick={() => this.onGlobeClicked(curTrip) } />,
                        <Popconfirm
                            title="Are you sure about editing this trip?"
                            onConfirm={() => this.popoverConfirm(curTrip._id)}
                            onCancel={() => this.popoverCancel()}
                            okText="Yes"
                            cancelText="No" >
                            <EditOutlined key="edit" />
                        </Popconfirm>,
                        <DeleteOutlined key="delete" onClick={() => this.showDeleteConfirm(curTrip._id, this)} />,
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
const { confirm } = Modal


export default Trip