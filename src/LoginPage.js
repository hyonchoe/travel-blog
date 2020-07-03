import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

// Redirects to Auth0 universal login
const LoginPage = () => {    
    const { loginWithRedirect } = useAuth0()
    
    return (<div>{loginWithRedirect()}</div>)
}

export default LoginPage