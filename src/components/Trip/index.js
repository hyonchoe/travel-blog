import React from 'react'
import { Card, } from 'antd'
import './style.css'

import { LocationSpans, TravelerName, getCardTitle, TripTabContent, TripDates } from './tripComponents'
import { getTabList, getCardActions } from './cardActions'

class Trip extends React.Component {
     state = {
         key: 'journal',
     }

    // TODO: turn this into custom hook after changing Trip to functional?
    onTabChange = (key, type) => {
        let updatedTabKey = {}
        updatedTabKey[type] = key
        this.setState(updatedTabKey)
        /*
        TODO: Below does the same thing. Should update to use that pattern in this project
        - this.setState({ [type]: key });
        */
    }

     render() {
        const curTrip = this.props.trip
        const locAddr = LocationSpans(curTrip.locations)
        const isMyTrip = this.props.isAuthenticated && (this.props.userId === this.props.trip.userId)
        const travelerName = TravelerName(this.props.showMyTrips, isMyTrip, { 
                                    userName: curTrip.userName,
                                    userEmail: curTrip.userEmail
                            })
        return (
            <Card
                title={getCardTitle(curTrip.title, curTrip.public)}
                hoverable={true}
                bordered={true}
                extra={TripDates(curTrip)}
                actions={getCardActions(curTrip, isMyTrip, this.props.launchMapModal, this.props.editTrip, this)}
                tabList={getTabList(this.props.trip.images)}
                activeTabKey={ this.state.key }
                tabProps={ {size: 'small'} }
                onTabChange={(key) => this.onTabChange(key, 'key') }
                >
                <TripTabContent tabKey={this.state.key} curTrip={curTrip} locAddr={locAddr} travelerName={travelerName} />
            </Card>
        )
    }
}

export default Trip