/**
 * Navigation component for application
 */

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { Menu, Button } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import './style.css'

const BREAKING_PT_MD = 768

const NavBar = () => {
    const location = useLocation()
    const { isAuthenticated, user, logout, loginWithPopup } = useAuth0()
    const { windowWidth } = useWindowDimensions()
    const collapsed = useCollapsedMenu(windowWidth)

    //#region Helper components
    /**
     * Helper component for user related menu item
     */
    const UserMenuItem = () => {
        return (
            <Menu.Item
                className={ (collapsed) ? "" : "userMenus"} >
                {!isAuthenticated && (
                    <Button onClick={()=>loginWithPopup()}>Log in</Button>
                )}
                {isAuthenticated && !collapsed && (
                UserNameSpan()
                )}
                {isAuthenticated && (
                    <Button onClick={()=>logout()}>Log out</Button>
                )}
            </Menu.Item>
        )
    }
    /**
     * Helper component for public trips menu item
     */
    const TravelerFeedMenuItem = () => {
        return (
            <Menu.Item key="/">
                <Link to="/">Travelers' Feed</Link>
            </Menu.Item>
        )
    }
    /**
     * Helper component for my trips menu item
     */
    const MyTripsMenuItem = () => {
        if (isAuthenticated){
            return (
                <Menu.Item key="/myTrips">
                    <Link to="/myTrips">My Trips</Link>
                </Menu.Item>
            )
        }
        return null
    }
    /**
     * Helper component for add/edit trip menu item
     */
    const AddTripsMenuItem = () => {
        if (isAuthenticated){
            return (
                <Menu.Item key="/addTrip">
                    <Link to="/addTrip"> Add/Edit Trip </Link>
                </Menu.Item>
            )
        }
        return null
    }
    /**
     * Helper component for user name menu item (just for display)
     */
    const UserNameMenuItem = () => {
        if(isAuthenticated){
            return (
                <Menu.Item
                    className="userMenus" >
                    {UserNameSpan()}
                </Menu.Item>
            )
        }
        return null
    }
    /**
     * Helper component for displaying user information
     */
    const UserNameSpan = () => {
        return (
            <span className="userInfo">Hello, {(user.name) ? user.name : user.email}</span>
        )
    }
    //#endregion

    return (
        <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]} >
            { collapsed &&
            <Menu.SubMenu
                icon={<MenuOutlined />}
                className="collapsedMenu" >
                {TravelerFeedMenuItem()}
                {MyTripsMenuItem()}
                {AddTripsMenuItem()}
                {UserMenuItem()}
            </Menu.SubMenu>
            }
            { collapsed &&
            UserNameMenuItem()
            }
            
            { !collapsed &&
            TravelerFeedMenuItem()
            }
            { !collapsed && 
            MyTripsMenuItem()
            }
            { !collapsed && 
            AddTripsMenuItem()
            }
            { !collapsed &&
            UserMenuItem()
            }
        </Menu> 
    )   
}

//#region Helper methods
/**
 * Checks if collapsed menu should be used instead of full menu
 * @param {number} windowWidth
 * @returns {boolean} True to use collapse menu, false otherwise
 */
const useCollapsedMenu = (windowWidth) => {
    return windowWidth < BREAKING_PT_MD
}
//#endregion

export default NavBar