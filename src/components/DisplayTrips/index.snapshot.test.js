/**
 * Snapshot tests for DisplayTrips component.
 * 
 * Run by running 'npm test' in command line.
 */

import React from 'react'
import { shallow } from 'enzyme'
import DisplayTrips from './'

describe('DisplayTrips', () => {
    const handleEditTrip = jest.fn()
    
    it('matches snapshot for public trips', () => {
        const wrapper = shallow(
            <DisplayTrips
                showMyTrips={false}
                editTrip={handleEditTrip} />
        )
        expect(wrapper).toMatchSnapshot()
    })

    it('matches snapshot for my trips', () => {
        const wrapper = shallow(
            <DisplayTrips
                showMyTrips={true}
                editTrip={handleEditTrip} />
        )
        expect(wrapper).toMatchSnapshot()
    })
})