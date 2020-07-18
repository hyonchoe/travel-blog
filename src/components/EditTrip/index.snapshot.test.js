import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment'
import EditTrip from './'

describe('EditTrip', () => {
    let clearEditTrip
    beforeEach(() => {
        clearEditTrip = jest.fn()
    })

    it('matches snapshot for creating new trip', () => {

        const wrapper = shallow(
            <EditTrip
                editTrip={null}
                clearEditTrip={clearEditTrip} />
        )
        expect(wrapper).toMatchSnapshot()
    })

    it('matches snapshot for editing existing trip', () => {
        const dummyStartDate = moment('2020-07-01', 'YYYY-MM-DD')
        const dummyEndDate = moment('2020-07-04', 'YYYY-MM-DD')
        const dummyLocations = [
            { 
                fmtAddr: 'dummyfmtaddr1',
                latLng: [1, 1],
                city: 'dummycity1',
                state: 'dummystate1',
                country: 'dummycountry1',
            },
            { 
                fmtAddr: 'dummyfmtaddr2',
                latLng: [2, 2],
                city: 'dummycity2',
                state: 'dummystate2',
                country: 'dummycountry2',
            }
        ]
        const dummyImages = [
            {
                name: 'dummyname',
                fileUrlName: 'dummyurlname',
                S3Url: 'dummys3url'
            }
        ]
        const dummyTrip = {
            _id: 'dummyid',
            userId: 'dummyuserid',
            userName: 'dummyusername',
            userEmail: 'dummyuseremail',
            title: 'dummytitle',
            startDate: dummyStartDate,
            endDate: dummyEndDate,
            public: true,
            details: 'dummydetails',
            locations: dummyLocations,
            images: dummyImages,
        }
        const wrapper = shallow(
            <EditTrip
                editTrip={dummyTrip}
                clearEditTrip={clearEditTrip} />
        )
        expect(wrapper).toMatchSnapshot()
    })
})