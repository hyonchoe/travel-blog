import React from 'react'
import { shallow } from 'enzyme'
import Error404 from './'

describe('Error404', () => {
    it('matches snapshot', () => {
        const wrapper = shallow(
            <Error404 />
        )
        expect(wrapper).toMatchSnapshot()
    })
})