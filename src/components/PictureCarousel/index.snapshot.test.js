/**
 * Snapshot tests for PictureCarousel component
 * 
 * Run by running 'npm test' in command line.
 */

import React from 'react'
import { shallow } from 'enzyme'
import mockData from '../../testutils/mockData'
import PictureCarousel from './'

describe('PictureCarousel', () => {
    it('matches snapshot for image divs it hosts', () => {
        const wrapper = shallow(
            <PictureCarousel images={mockData().images} />
        )
        expect(wrapper).toMatchSnapshot()
    })
})