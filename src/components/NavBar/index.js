import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Button } from 'antd'
import { useAuth0 } from '@auth0/auth0-react'
import './style.css'

const NavBar = () =>{
    const location = useLocation()
    const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0()
    
    return (
        <Menu 
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]} >
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

            <Menu.Item
                className="userMenus" >
                {!isAuthenticated && (
                    <Button onClick={()=>loginWithRedirect()}>Log in</Button>
                )}
                {isAuthenticated && (
                <span className="userInfo">Hello, {(user.name) ? user.name : user.email}</span>
                )}                
                {isAuthenticated && (
                    <Button onClick={()=>logout()}>Log out</Button>
                )}
            </Menu.Item>
        </Menu> 
    )   
}

export default NavBar