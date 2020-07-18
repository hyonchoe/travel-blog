import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { Menu, Button } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import useWindowDimensions from './useWindowDimensions'
import './style.css'


const breakingPointMd = 768

const NavBar = () =>{
    const location = useLocation()
    const { isAuthenticated, user, logout, loginWithPopup } = useAuth0()
    const { windowWidth } = useWindowDimensions()
    const collapsed = useCollapsedMenu(windowWidth)

    const UserMenuItem = () => {
        if (collapsed){
            return (
            <Menu.Item>
                {!isAuthenticated && (
                    <Button onClick={()=>loginWithPopup()}>Log in</Button>
                )}
                {isAuthenticated && (
                    <Button onClick={()=>logout()}>Log out</Button>
                )}
            </Menu.Item>               
            )
        }
       
        return (
            <Menu.Item
                className="userMenus" >
                {!isAuthenticated && (
                    <Button onClick={()=>loginWithPopup()}>Log in</Button>
                )}
                {isAuthenticated &&  (
                UserNameSpan()
                )}
                {isAuthenticated && (
                    <Button onClick={()=>logout()}>Log out</Button>
                )}
            </Menu.Item>
        )
    }
    const TravelerFeedMenuItem = () => {
        return (
            <Menu.Item key="/">
                <Link to="/">Travelers' Feed</Link>
            </Menu.Item>
        )
    }
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
    const UserNameSpan = () => {
        return (
            <span className="userInfo">Hello, {(user.name) ? user.name : user.email}</span>
        )
    }

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

const useCollapsedMenu = (windowWidth) => {
    return windowWidth < breakingPointMd
}

export default NavBar