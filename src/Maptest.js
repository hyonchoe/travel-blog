import React, { useState } from 'react'
import { Row, Col, Input, Button, Modal  } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons';
import './Maptest.css'
import MyMapContainer from './MyMapContainer.js'

const Maptest = props => {
    // Central park: lat:40.769361, lng: -73.977655
    // NY: lat: 40.730610,  lng: -73.935242    
    //const search = { lat:40.769361, lng: -73.977655 }
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedLoc, setSelectedLoc] = useState({
        lat: null,
        lng: null,
        fmtAddr: '',
    })
    const [fieldInfo, setFieldInfo] = useState({
        fmtAddr: '',
    })
    const [disableDelBtn, setDisableDelBtn] = useState(true)

    const getInitialLocValue = () => {
        return { fmtAddr: '', }
    }

    const handleModalOk = () => {
        const loc = { fmtAddr: selectedLoc.fmtAddr}
        setFieldInfo(loc)
        setDisableDelBtn(false)
        setModalVisible(false)
    }
    const handleModalCancel = () => {
        setModalVisible(false)
    }
    const onLocSelected = (fmtAddr, latlng) => {
        let lala = {}
        lala['fmtAddr'] = fmtAddr

        setSelectedLoc({...selectedLoc, ...lala})
    }
    const clearLocation = () => {
        const reset = getInitialLocValue()
        setFieldInfo(reset)
        setDisableDelBtn(true)
    }

    return (
        <Row>
            <Col span={4} />
            <Col span={10}>
                <Input name="hacTest" readOnly={true} placeholder='Where did you go?' value={fieldInfo.fmtAddr}/>
            </Col>
            <Col span={6}> 
                <Button type="link" onClick={() => setModalVisible(true)}>Select location</Button>
                <CloseCircleOutlined
                      className="dynamic-delete-button"
                      disabled={disableDelBtn}
                      style={{ margin: '0 8px' }}
                      onClick={() => clearLocation()}
                />
            </Col>
            <Col span={4} />
            <Modal
                title="Search for the trip location"
                visible={modalVisible}
                bodyStyle={{height: '550px'}}
                width="500px"

                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <MyMapContainer
                        searchMode={true}
                        tripLocations={null}
                        onLocSelected={onLocSelected}
                        />
            </Modal>
        </Row>
    )
}

export default Maptest