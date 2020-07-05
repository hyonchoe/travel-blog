import React from 'react'
import { Button } from 'antd'

const Splash = () => {

    const sendPublicAPI = async () => {
    }
    const sendPrivateAPI = async () => {
    }

    return (
        <div>
        <Button onClick={sendPublicAPI}>Splash public button</Button>
        <Button onClick={sendPrivateAPI}>Splash private button</Button>
        </div>
    )
}

export default Splash