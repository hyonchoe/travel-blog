import React from 'react'
import { mount } from 'enzyme'
import moment from 'moment'
import { Popconfirm } from 'antd'
import { GlobalOutlined, DeleteOutlined } from '@ant-design/icons'
import { checkIsMyTrip } from './'
import Trip from './'
import * as cardActionsModule from './helpers/cardActions'

describe('Trip is ', () => {
    const myId = 'myid'
    const otherUserId = 'otherid'

    it('my trip', () => {
        expect(checkIsMyTrip(true, myId, myId)).toBe(true)
    })

    it('not my trip b/c not logged in', () => {
        expect(checkIsMyTrip(false, myId, myId)).toBe(false)
    })

    it('not my trip b/c not different user id', () => {
        expect(checkIsMyTrip(false, myId, otherUserId)).toBe(false)
    })
})

describe('Trip card', () => {
    const dummyStartDate = moment('2020-07-01', 'YYYY-MM-DD')
    const dummyEndDate = moment('2020-07-04', 'YYYY-MM-DD')
    const trip = {
        _id: 'dummytripid',
        userId: 'dummyuserid',
        userName: 'dummyusername',
        userEmail: 'dummyuseremail',
        title: 'dummytitle',
        startDate: dummyStartDate,
        endDate: dummyEndDate,
        public: true,
        details: 'dummydetails',
        locations: [{fmtAddr: 'dummyaddr'}],
        images: [],
    }
    
    const tripProps = {
        isAuthenticated: true,
        userId: 'dummyuserid',
        showMyTrips: true,
        trip: trip,
    }

    it('actions call appropraite callbacks for launching map, editing trip, and deleting trip', () => {
        const launchMapModal = jest.fn()
        const editTrip = jest.fn()
        const deleteTrip = jest.fn()
        const tripCard = mount(<Trip
                                {...tripProps}
                                launchMapModal= {launchMapModal}
                                editTrip= {editTrip}
                                deleteTrip= {deleteTrip} />)
        
        // Launch map
        tripCard.find(GlobalOutlined).simulate('click')        
        expect(launchMapModal).toHaveBeenCalled()

        // Edit trip
        tripCard.find(Popconfirm).props().onConfirm()
        expect(editTrip).toHaveBeenCalled()

        // Delete trip
        const spyShowDeleteConfirm = jest.spyOn(cardActionsModule, 'showDeleteConfirm')
        tripCard.find(DeleteOutlined).simulate('click')
        expect(spyShowDeleteConfirm).toHaveBeenCalled()
        spyShowDeleteConfirm.mockRestore()
    })

    it('action for launching map does not occur when there are no locations', () => {
        const launchMapModal = jest.fn()
        const editTrip = jest.fn()
        const deleteTrip = jest.fn()
        const tripCard = mount(<Trip 
                                {...tripProps}
                                trip={ {...trip, locations:[]} }
                                launchMapModal= {launchMapModal}
                                editTrip= {editTrip}
                                deleteTrip= {deleteTrip} />)
        
        // Attempt to launch map - should not be launched
        tripCard.find(GlobalOutlined).simulate('click')        
        expect(launchMapModal).not.toHaveBeenCalled()
    })
})

