import React from 'react'
import { shallow } from 'enzyme'
import LocationSelect from './'

describe('LocationSelect', () => {
    it('handles pop-up close on okay correctly', () => {
        const dummyForm = {}
        const wrapper = shallow(
            <LocationSelect
                form={dummyForm}
                listName='dummylistname'
                latLngDelim=',' />
        )
        expect(wrapper).toMatchSnapshot()
    })
})