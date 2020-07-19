import React from 'react'
import { shallow } from 'enzyme'
import PrivateRoute from './'

describe('PrivateRoute', () => {
    const dummyComponent = (<div className='dummy'></div>)
    
    it('matches snapshot for my trips', () => {
        const handleEditTrip = jest.fn()
        const wrapper = shallow(
            <PrivateRoute 
                path='/myTrips'
                component={dummyComponent}
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
                component={dummyComponent}
                editTrip={true}
                clearEditTrip={clearEditTrip} />
        )
        expect(wrapper).toMatchSnapshot()
    })
})