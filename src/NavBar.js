import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'antd'
import { useAuth0 } from '@auth0/auth0-react'
import './NavBar.css'

const NavBar = () =>{
    const location = useLocation()
    const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0()

    const handleClick = (e) => {
        if (e.key === 'login' || e.key === 'logout'){
            (isAuthenticated) ? logout() : loginWithRedirect()
        }
    }

    return (
        <Menu 
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            onClick={handleClick} >
            <Menu.Item key="/">
                <Link to="/">Travelers' Feed</Link>
            </Menu.Item>
            {isAuthenticated && (
            <Menu.Item key="/myTrips">
                <Link to="/myTrips">My Trips</Link>
            </Menu.Item>                
            )}
            {isAuthenticated && ( 
            <Menu.Item key="/addTrip">
                <Link to="/addTrip"> Add/Edit Trip </Link>
            </Menu.Item>
            )}

            {!isAuthenticated && (
            <Menu.Item key='login' className="userMenus"> Log in </Menu.Item>
            )}
            {isAuthenticated && (
            <Menu.Item key='logout' className="userMenus"> Log out </Menu.Item>
            )}
            {isAuthenticated && (
            <Menu.Item key='userName' className="userMenus userInfo" >Hello, {(user.name) ? user.name : user.email}</Menu.Item>
            )}
        </Menu> 
    )   
}

export default NavBar