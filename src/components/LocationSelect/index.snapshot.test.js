/**
 * Snapshot test for LocationSelect component.
 * 
 * Run by running 'npm test' in command line.
 */

import React from 'react'
import { shallow } from 'enzyme'
import LocationSelect from './'

describe('LocationSelect', () => {
    it('matches snapshot', () => {
        const dummyForm = {}
        const dummyLayouts = {}
        const wrapper = shallow(
            <LocationSelect
                form={dummyForm}
                layouts={dummyLayouts}
                listName='dummylistname'
                latLngDelim=',' />
        )
        expect(wrapper).toMatchSnapshot()
    })
})