/**
 * Snapshot tests for PrivateRoute component.
 * 
 * Run by running 'npm test' in command line.
 */

import React from 'react'
import { shallow } from 'enzyme'
import PrivateRoute from './'

describe('PrivateRoute', () => {
    const DummyComponent = () => {
        return (
            <div className='dummy'></div>
        )
    }
    
    it('matches snapshot for my trips', () => {
        const handleEditTrip = jest.fn()
        const wrapper = shallow(
            <PrivateRoute 
                path='/myTrips'
                component={DummyComponent}
                showMyTrips={true}
                editTrip={handleEditTrip} />
        )
        expect(wrapper).toMatchSnapshot()
    })

    it('matches snapshot for add trips', () => {
        const clearEditTrip = jest.fn()
        const wrapper = shallow(
            <PrivateRoute
                path='/addTrip'
                component={DummyComponent}
                tripToEdit={null}
                clearEditTrip={clearEditTrip} />
        )
        expect(wrapper).toMatchSnapshot()
    })
})