/**
 * Snapshot test for NavBar component.
 * 
 * Run by running 'npm test' in command line.
 */

import React from 'react'
import { shallow } from 'enzyme'
import * as hooks from '@auth0/auth0-react'
import mockData from '../../testutils/mockData'
import * as windowHooks from '../../hooks/useWindowDimensions'
import NavBar from './'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        pathname: 'dummypathname'
    })
}))

const auth0UserInfo = mockData().getAuth0UserInfo()

describe('NavBar', () => {
    describe('for full menu', () =>{
        beforeEach(() => {
            jest.spyOn(windowHooks, 'default').mockImplementation(() => ({
                windowWidth: 1000
            }))
        })

        it('matches snapshot authenticated', () => {
            jest.spyOn(hooks, 'useAuth0').mockImplementation(() => ({
                isAuthenticated: true,
                user: auth0UserInfo,
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
    
    describe('for collapsed menu', () => {
        beforeEach(() => {
            jest.spyOn(windowHooks, 'default').mockImplementation(() => ({
                windowWidth: 400
            }))
        })

        it('matches snapshot authenticated', () => {
            jest.spyOn(hooks, 'useAuth0').mockImplementation(() => ({
                isAuthenticated: true,
                user: auth0UserInfo,
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
})