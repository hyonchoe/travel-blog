import React from 'react'
import { shallow } from 'enzyme'
import * as hooks from '@auth0/auth0-react'
import NavBar from './'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        pathname: 'dummypathname'
    })
}))

describe('NavBar', () => {
    it('matches snapshot authenticated', () => {
        jest.spyOn(hooks, 'useAuth0').mockImplementation(() => ({
            isAuthenticated: true,
            user: { name: 'dummyname', email: 'dummyemail', sub: 'dummysub' },
            logout: jest.fn(),
            loginWithPopup: jest.fn()
        }))
        
        const wrapper = shallow(
            <NavBar />
        )
        expect(wrapper).toMatchSnapshot()
    })

    it('matches snapshot not authenticated', () => {
        jest.spyOn(hooks, 'useAuth0').mockImplementation(() => ({
            isAuthenticated: false,
            user: null,
            logout: jest.fn(),
            loginWithPopup: jest.fn()
        }))
        const wrapper = shallow(
            <NavBar />
        )
        expect(wrapper).toMatchSnapshot()
    })
})