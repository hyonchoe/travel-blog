import React from 'react'
import ReactDom from 'react-dom'
import App from './components/App'
import './style.css'

import { Auth0Provider } from '@auth0/auth0-react'

const isDev = false

const domain = (isDev) ? process.env.REACT_APP_AUTH0_DOMAIN : process.env.REACT_APP_AUTH0_DOMAIN_PRD
const clientId = (isDev) ? process.env.REACT_APP_AUTH0_CLIENT_ID : process.env.REACT_APP_AUTH0_CLIENT_ID_PRD
const audience = (isDev) ? process.env.REACT_APP_AUTH0_AUDIENCE : process.env.REACT_APP_AUTH0_AUDIENCE_PRD
const redirectUri = (isDev) ? process.env.REACT_APP_AUTH0_CB_URL : process.env.REACT_APP_AUTH0_CB_URL_PRD

ReactDom.render(
    <Auth0Provider
        domain={domain}
        clientId={clientId}
        audience={audience}
        redirectUri={redirectUri}
        useRefreshTokens={true} >
        <App />
    </Auth0Provider>,
    document.getElementById('root')
)