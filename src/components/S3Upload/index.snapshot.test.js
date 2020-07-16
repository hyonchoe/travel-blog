import React from 'react'
import { shallow } from 'enzyme'
import S3Upload from './'

describe('S3Upload', () => {
    it('matches snapshot', () => {
        const dummyFormObject = {}
        const dummyImages = [ 
            {name: 'dummyname1', fileUrlName: 'dummyurlname1', S3Url: 'dummys3url1'},
            {name: 'dummyname2', fileUrlName: 'dummyurlname2', S3Url: 'dummys3url2'},
        ]
        const wrapper = shallow(
            <S3Upload 
                form={dummyFormObject}
                fieldName='dummyfieldname'
                images={dummyImages} />
        )
        expect(wrapper).toMatchSnapshot()
    })
})