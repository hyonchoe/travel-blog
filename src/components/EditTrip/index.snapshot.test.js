/**
 * Snapshot tests for EditTrip component.
 * 
 * Run by running 'npm test' in command line.
 */

import React from 'react'
import { shallow } from 'enzyme'
import mockData from '../../testutils/mockData'
import EditTrip from './'

describe('EditTrip', () => {
    let clearEditTrip
    beforeEach(() => {
        clearEditTrip = jest.fn()
    })

    it('matches snapshot for creating new trip', () => {
        const wrapper = shallow(
            <EditTrip
                tripToEdit={null}
                clearEditTrip={clearEditTrip} />
        )
        expect(wrapper).toMatchSnapshot()
    })

    it('matches snapshot for editing existing trip', () => {
        const wrapper = shallow(
            <EditTrip
                tripToEdit={mockData().getTrip()}
                clearEditTrip={clearEditTrip} />
        )
        expect(wrapper).toMatchSnapshot()
    })
})