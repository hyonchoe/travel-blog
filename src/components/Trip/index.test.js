/**
 * Unit tests for Trip component.
 * 
 * Run by running 'npm test' in command line.
 */

import React from 'react'
import { mount } from 'enzyme'
import { Popconfirm } from 'antd'
import { GlobalOutlined, DeleteOutlined } from '@ant-design/icons'
import mockData from '../../testutils/mockData'
import { checkIsMyTrip } from './'
import Trip from './'
import * as cardActionsModule from './helpers/cardActions'

describe('Trip is', () => {
    const myId = mockData().tripId
    const otherUserId = mockData().otherTripId

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
    const trip = mockData().getTrip()
    const tripProps = {
        isAuthenticated: true,
        userId: trip.userId,
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