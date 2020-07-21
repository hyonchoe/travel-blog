/**
 * Snapshot tests for S3Upload component.
 * 
 * Run by running 'npm test' in command line.
 */

import React from 'react'
import { shallow } from 'enzyme'
import mockData from '../../testutils/mockData'
import S3Upload from './'

describe('S3Upload', () => {
    it('matches snapshot', () => {
        const dummyFormObject = {}
        const wrapper = shallow(
            <S3Upload 
                form={dummyFormObject}
                fieldName='dummyfieldname'
                images={mockData().images} />
        )
        expect(wrapper).toMatchSnapshot()
    })
})