/**
 * Snapshot tests for PictureCarousel component
 * 
 * Run by running 'npm test' in command line.
 */

import React from 'react'
import { shallow } from 'enzyme'
import PictureCarousel from './'

describe('PictureCarousel', () => {
    it('matches snapshot for image divs it hosts', () => {
        const tripImages = [
            { name: 'dummyname', S3Url: 'dummyurl' },
            { name: 'dummyname2', S3Url: 'dummyurl2' },
        ]
        const wrapper = shallow(
            <PictureCarousel images={tripImages} />
        )
        expect(wrapper).toMatchSnapshot()
    })
})