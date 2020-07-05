import React from 'react'
import { Button } from 'antd'
import tripService from './services/tripService.js'
import { useAuth0 } from '@auth0/auth0-react'

const Splash = () => {
    const { getAccessTokenSilently } = useAuth0()

    const sendPublicAPI = async () => {
        await tripService.testPublicApi()
    }
    const sendPrivateAPI = async () => {
        await tripService.testPrivateApi(getAccessTokenSilently)
    }

    return (
        <div>
        <Button onClick={sendPublicAPI}>Splash public button</Button>
        <Button onClick={sendPrivateAPI}>Splash private button</Button>
        </div>
    )
}

export default Splash