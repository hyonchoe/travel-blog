import React from 'react'
import ReactDom from 'react-dom'
import App from './App'
import './index.css'

import { Auth0Provider } from '@auth0/auth0-react'
import AUTH_CONFIG from './auth0-variables.js'

ReactDom.render(
    <Auth0Provider
        domain={AUTH_CONFIG.domain}
        clientId={AUTH_CONFIG.clientId}
        redirectUri={AUTH_CONFIG.callbackUrl} >
        <App />
    </Auth0Provider>,
    document.getElementById('root')
)