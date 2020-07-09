import React from 'react'
import ReactDom from 'react-dom'
import App from './App'
import './index.css'

import { Auth0Provider } from '@auth0/auth0-react'

ReactDom.render(
    <Auth0Provider
        domain={process.env.REACT_APP_AUTH0_DOMAIN}
        clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
        audience={process.env.REACT_APP_AUTH0_AUDIENCE}
        redirectUri={process.env.REACT_APP_AUTH0_CB_URL}
        useRefreshTokens={true} >
        <App />
    </Auth0Provider>,
    document.getElementById('root')
)