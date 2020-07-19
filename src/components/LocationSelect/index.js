import React, { useState } from 'react'
import { Form, Input, Button, Modal } from 'antd'
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons'
import MyMapContainer from '../MyMapContainer'
import useMap from './helpers/useMap'
import './style.css'

const LocationSelect = (props) => {
    const FMT_ADDR_FLD_NAME = 'fmtAddr'
    const LAT_LNG_FLD_NAME = 'latLng'
    const CITY_FLD_NAME = 'city'
    const STATE_FLD_NAME = 'state'
    const COUNTRY_FLD_NAME = 'country'
    const MAX_LOCATION_COUNT = 5

    const { mapCenter, markerLatLng, addr,
        clearMapStates, setLocationData } = useMap()
    const [modalVisible, setModalVisible] = useState(false)
    const [locFieldNameIndex, setLocFieldNameIndex] = useState(-1)

    const listName = props.listName
    const layout = props.layouts.layout
    const tailLayout = props.layouts.tailLayout

    const handleModalOk = () => {
        const updatedValues = props.form.getFieldValue(listName).slice()
        updatedValues[locFieldNameIndex] = {
            fmtAddr: addr.fmtAddr,
            latLng: (markerLatLng.lat) ? markerLatLng.lat + props.latLngDelim + markerLatLng.lng : null,
            city: addr.city,
            state: addr.state,
            country: addr.country,
        }
        props.form.setFieldsValue({locationList: updatedValues})

        clearMapStates()
        setModalVisible(false)
        setLocFieldNameIndex(-1)
    }
    const handleModalCancel = () => {
        clearMapStates()
        setModalVisible(false)
        setLocFieldNameIndex(-1)
    }
    const onButtonClicked = (locFieldIndex) => {
        setModalVisible(true)
        setLocFieldNameIndex(locFieldIndex)
    }

    return (
        <div>
            <Form.List name={listName}>
                {(fields, { add, remove }) => {
                return (
                    <div>
                    {fields.map((field, index) => (
                        <Form.Item
                            {...(index === 0 ? layout : tailLayout)}
                            label={index === 0 ? 'Location' : ''}
                            key={field.key} >
                            <Form.Item
                                {...field}
                                name={[field.name, FMT_ADDR_FLD_NAME]}
                                fieldKey={[field.fieldKey, FMT_ADDR_FLD_NAME]}
                                noStyle >
                                <Input placeholder="Where did you go?" readOnly={true} style={{ width: '60%' }} />
                            </Form.Item>
                            <Form.Item
                                {...field}
                                name={[field.name, LAT_LNG_FLD_NAME]}
                                fieldKey={[field.fieldKey, LAT_LNG_FLD_NAME]}
                                style={{ display: 'none' }} >
                                <Input readOnly={true} />
                            </Form.Item>
                            <Form.Item
                                {...field}
                                name={[field.name, CITY_FLD_NAME]}
                                fieldKey={[field.fieldKey, CITY_FLD_NAME]}
                                style={{ display: 'none' }} >
                                <Input readOnly={true} />
                            </Form.Item>
                            <Form.Item
                                {...field}
                                name={[field.name, STATE_FLD_NAME]}
                                fieldKey={[field.fieldKey, STATE_FLD_NAME]}
                                style={{ display: 'none' }} >
                                <Input readOnly={true} />
                            </Form.Item>
                            <Form.Item
                                {...field}
                                name={[field.name, COUNTRY_FLD_NAME]}
                                fieldKey={[field.fieldKey, COUNTRY_FLD_NAME]}
                                style={{ display: 'none' }} >
                                <Input readOnly={true} />
                            </Form.Item>
                            <Button type="link" onClick={() => onButtonClicked(index)}>Select location</Button>
                            <CloseCircleOutlined
                                className="dynamic-delete-button"
                                style={{ margin: '0 8px' }}
                                onClick={() => {
                                    remove(field.name);
                                }} />
                        </Form.Item>
                    ))}

                    { fields.length < MAX_LOCATION_COUNT &&
                    <Form.Item
                        {...tailLayout} >
                        <Button
                            type="dashed"
                            onClick={() => {
                                add()
                            }}
                            style={{ width: '60%' }}
                            >
                            <PlusOutlined /> Add location
                        </Button>
                    </Form.Item>
                    }
                    </div>
                );
                }}
            </Form.List>

            <Modal
                title="Search your trip location"
                visible={modalVisible}
                bodyStyle={{height: '550px'}}
                width="500px"
                maskClosable={false}
                destroyOnClose={true}
                okButtonProps={{ disabled: (markerLatLng.lat === null) }}
                onOk={handleModalOk}
                onCancel={handleModalCancel} >
                <MyMapContainer
                        searchMode={true}
                        tripLocations={null}
                        mapCenterLat={mapCenter.lat}
                        mapCenterLng={mapCenter.lng}
                        markerLat={markerLatLng.lat}
                        markerLng={markerLatLng.lng}
                        onLocSelected={setLocationData} />
            </Modal>
        </div>
    )
}

export default LocationSelect