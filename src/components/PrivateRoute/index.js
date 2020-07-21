/**
 * PrivateRoute component that checks for authentication,
 * otherwise redirects to main page.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

const PrivateRoute = ({ component: Component, ...rest }) => {
    PrivateRoute.propTypes = {
        component: PropTypes.elementType.isRequired
    }
    
    const { isAuthenticated } = useAuth0()

    return (
        <Route
            {...rest}
            render = {(props) => (
                isAuthenticated ? 
                    <Component {...props} {...rest} />
                    : <Redirect to='/' />
            )} />
    )
}

export default PrivateRoute