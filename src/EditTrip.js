import React, { useState, useRef } from 'react'
import { Button, Input, DatePicker, Form, Space, Modal, Upload  } from 'antd'
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import './EditTrip.css'
import MyMapContainer from './MyMapContainer.js'

import axios from 'axios'
import tripService from './services/tripService.js'

const EditTrip = props => {
    const [markerLatLng, setMarkerLatLng] = useState({
        lat: null,
        lng: null,
    })
    const [mapCenter, setMapCenter] = useState({
        // Default coordinate is New York, NY
        lat: 40.730610,
        lng: -73.935242,
    })
    const [addr, setAddr] = useState({
        city: '',
        state: '',
        country: '',
        fmtAddr: '',
    })
    const [disableDelBtns, setDisableDelBtns] = useState({
        loc0: true,
        loc1: true,
        loc2: true,
    })
    const [modalVisible, setModalVisible] = useState(false)        
    const [locFieldName, setLocFieldName] = useState('')

    const latLngDelim = ','
    const hiddenSuffix = '_hidden'
    const locations = {
        loc0: 'loc0',
        loc0Hidden: 'loc0' + hiddenSuffix,
        loc1: 'loc1',
        loc1Hidden: 'loc1' + hiddenSuffix,
        loc2: 'loc2',
        loc2Hidden: 'loc2' + hiddenSuffix,
    }

    const getInitialMapCenter = () => {
        return {
            lat: 40.730610,
            lng: -73.935242,
        }
    }
    const getInitialAddr = () => {
        return {
            city: '',
            state: '',
            country: '',
            fmtAddr: '',
        }
    }
    const getInitialMarker = () => {
        return {
            lat: null,
            lng: null,
        }
    }

    const handleModalOk = () => {
        let value = {}
        value[locFieldName] = addr.fmtAddr
        let locFieldNameLatLng = locFieldName + hiddenSuffix
        value[locFieldNameLatLng] = (markerLatLng.lat) ? markerLatLng.lat + latLngDelim + markerLatLng.lng : null
        form.setFieldsValue(value)

        let disableBtnsValue = {}
        disableBtnsValue[locFieldName] = (form.getFieldValue(locFieldName) === '')
        setDisableDelBtns({...disableDelBtns, ...disableBtnsValue})

        setModalVisible(false)
        clearMapStates()

        setLocFieldName('')
    }
    const handleModalCancel = () => {
        setModalVisible(false)
        clearMapStates()

        setLocFieldName('')
    }
    const onLocSelected = (locAddrInfo, locLatLngInfo) => {
        setAddr(locAddrInfo)
        setMarkerLatLng(locLatLngInfo)
        setMapCenter(locLatLngInfo)
    }
    const clearLocation = (curLocFieldName) => {
        let reset = {}
        reset[curLocFieldName]=''
        form.setFieldsValue(reset)

        let disableBtnsValue = {}
        disableBtnsValue[curLocFieldName] = true
        setDisableDelBtns({...disableDelBtns, ...disableBtnsValue})
    }
    const clearMapStates = () => {
        const resetAddr = getInitialAddr()
        const resetMarker = getInitialMarker()
        const resetMapCenter = getInitialMapCenter()

        setAddr(resetAddr)
        setMarkerLatLng(resetMarker)
        setMapCenter(resetMapCenter)
    }

    const onButtonClicked = (curLocFieldName) => {
        setModalVisible(true)
        setLocFieldName(curLocFieldName)
    }

    const getInitialLocValues = (existingLocations) => {
        let initialValues = {}
        const tempMapping = [
            {
                fmtAddr: locations.loc0,
                latLng: locations.loc0Hidden,
            },
            {
                fmtAddr: locations.loc1,
                latLng: locations.loc1Hidden,
            },
            {
                fmtAddr: locations.loc2,
                latLng: locations.loc2Hidden,
            },
        ]

        for(let i=0; i<existingLocations.length; i++){
            initialValues[tempMapping[i].fmtAddr] = existingLocations[i].fmtAddr
            initialValues[tempMapping[i].latLng] = existingLocations[i].latLng[0] + latLngDelim + existingLocations[i].latLng[1]
        }

        return initialValues
    }    

    const [form] = Form.useForm()
    const existingTrip = props.editTrip
    let btnName = 'Submit'
    if (existingTrip){
        let initialValues = {
            title: existingTrip.title,
            dates: [existingTrip.startDate, existingTrip.endDate],
            details: existingTrip.details,            
        }
        /*
        form.setFieldsValue({
            title: existingTrip.title,
            dates: [existingTrip.startDate, existingTrip.endDate],
            details: existingTrip.details,
            
        })*/

        form.setFieldsValue({...initialValues, ...getInitialLocValues(existingTrip.locations)})

        btnName = 'Update'
    }

    const onFinish = values => {
        let counter = 0
        let locationData = []
        
        // Get location data
        if (values[locations.loc0Hidden]){
            locationData[counter] = {
                fmtAddr: values[locations.loc0],
                latLng: values[locations.loc0Hidden].split(latLngDelim),
            }
            counter++
        }
        if (values[locations.loc1Hidden]){
            locationData[counter] = {
                fmtAddr: values[locations.loc1],
                latLng: values[locations.loc1Hidden].split(latLngDelim),                
            }
            counter++
        }
        if (values[locations.loc2Hidden]){
            locationData[counter] = {
                fmtAddr: values[locations.loc2],
                latLng: values[locations.loc2Hidden].split(latLngDelim),
            }
            counter++
        }

        // Get image upload data
        let imageInfoData = []
        if(fileList){
            fileList.forEach((file) => {
                if(nameToUrlName.hasOwnProperty(file.uid)){
                    const curFileNameInfo = nameToUrlName[file.uid]
                    imageInfoData.push({
                        name: curFileNameInfo.name,
                        fileUrlName: curFileNameInfo.fileUrlName,
                    })
                }
            })
        }

        const tripData = {
            title: values.title,
            startDate: values.dates[0],
            endDate: values.dates[1],
            details: values.details,
            locations: locationData,
            images: imageInfoData,
        }
        
        if (props.editTrip){
            props.handleUpdate(tripData, props.editTripId)
        }
        else{
            props.handleSubmit(tripData)
        }
    }
    const onCancel = () => {
        props.handleCancel()
    }

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 10, },
    }
    const tailLayout = {
        wrapperCol: { offset: 8, span: 12 }
    }

    // TODO: UPLOAD ----------------------------------------------------------
    const [previewInfo, setPreviewInfo] = useState({
        previewVisible: false,
        previewImage: '',
        privewTitle: '',
    })
    const [fileList, setFileList] = useState([]) 
    /**
     * File is object:
     *  {
            uid: '',
            name: '',
            stats: '',
            url: '',
        }
        */
    const [fileReader, setFileReader] = useState(new FileReader())
    const myImage = useRef('')
    /**
     * Object of images with rc_uid key
     * { 
     *      rc_uid: {name: '', fileUrlName: ''},
     *      ...
     * }
     */
    const [nameToUrlName, setNameToUrlName] = useState({})
    
    const handleCancel = () => {
        setPreviewInfo({ previewVisible: false })
    }

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }

        setPreviewInfo({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/')+1),
        })
    }

    const handleChange = (info) => {
        const file = info.file
        const fileList = info.fileList
        if (file.status === 'done'){
            return
        }

        const reader = new FileReader()
        reader.onloadend = (obj) => {
                myImage.current = obj.srcElement.result
        }
        reader.readAsArrayBuffer(file.originFileObj);
        setFileList(fileList)
    }
    const customRequest = async (option) => {
        const { onSuccess, onError, file, action, onProgress } = option
        const url = action
        
        console.log("customRequest: " + url)

        await new Promise(resolve => waitUntilImageLoaded(resolve))
        const type = 'image/jpeg'
        axios.put(url, myImage.current, {
            onUploadProgress: e => {
                onProgress({ percent: (e.loaded / e.total) * 100 })
            },
            headers: {
                'Content-Type': type,
            },
        })
            .then(response => {
                onSuccess(response.body)
                myImage.current = ''
            })
            .catch(error => {
                onError(error)
                myImage.current = ''
            })
    }
    const waitUntilImageLoaded = (resolve) => {
        setTimeout( () => {
            if (myImage.current){
                resolve()
            } else {
                waitUntilImageLoaded(resolve)
            }
        }, 100)
    }

    const handleUpload = async (file) => {
        const fileName = file.name
        const fileType = file.type
        let signedUrl = ''

        try{
            const urlInfo = await tripService.getS3SignedUrl(fileType)
            signedUrl = urlInfo.signedUrl
            const fileUID = file.uid
            const fileNameInfo = {
                name: fileName,
                fileUrlName: urlInfo.fileUrlName,
            }
            setNameToUrlName({...nameToUrlName,  [fileUID]: fileNameInfo })
            
        } catch (err) {
            console.log("handleUpload "+err)
        }
        
        // TODO: error handling
        return signedUrl
    }
    //----------------------------------------------------------

    return (
        <Form
            form={form}
            {...layout}
            layout="horizontal"
            onFinish={onFinish} >
                <Form.Item
                    label="Trip Title"
                    name="title"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your trip title.',
                        },
                    ]}
                    >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Date of Trip"
                    name="dates"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your trip date.',
                        },
                    ]} >
                    <DatePicker.RangePicker
                        allowClear={true} />
                </Form.Item>

                <Form.Item
                    label="Details"
                    name="details"
                    rules={[
                        {
                            required: true,
                            message: 'Pleaes input your trip details.',
                        },
                    ]} >
                    <Input.TextArea
                        autoSize={ {minRows:4, maxRows:20} } />
                </Form.Item>
            
                <Form.Item
                    label="Location (up to three)" >
                    <Form.Item
                        style={{display: 'block', margin: '0'}} >
                        <Form.Item
                            name={locations.loc0}
                            style={{ display: 'inline-block' }}
                             >
                            <Input readOnly={true} placeholder='Where did you go?' />
                        </Form.Item>
                        <CloseCircleOutlined
                            className="dynamic-delete-button"
                            disabled={disableDelBtns.loc0}
                            style={{ margin: '0 8px' }}
                            onClick={() => clearLocation(locations.loc0)} />
                        <Button type="link" onClick={() => onButtonClicked(locations.loc0)}>Select location</Button>
                    </Form.Item>
                    <Form.Item 
                        name={locations.loc0Hidden}
                        noStyle
                        style={{ display: 'none' }} >
                        <Input readOnly={true} style={{ display: 'none' }} />
                    </Form.Item>

                    <Form.Item
                        style={{display: 'block', margin: '0'}} >
                        <Form.Item
                            name={locations.loc1}
                            style={{ display: 'inline-block' }} >
                            <Input readOnly={true} placeholder='Where did you go?' />
                        </Form.Item>
                        <CloseCircleOutlined
                            className="dynamic-delete-button"
                            disabled={disableDelBtns.loc1}
                            style={{ margin: '0 8px' }}
                            onClick={() => clearLocation(locations.loc1)}
                        />
                        <Button type="link" onClick={() => onButtonClicked(locations.loc1)}>Select location</Button>
                    </Form.Item>
                    <Form.Item 
                        name={locations.loc1Hidden}
                        noStyle
                        style={{ display: 'none' }} >
                        <Input readOnly={true} style={{ display: 'none' }} />
                    </Form.Item>

                    <Form.Item
                        style={{display: 'block', margin: '0'}} >
                        <Form.Item
                            name={locations.loc2}
                            style={{ display: 'inline-block' }} >
                            <Input readOnly={true} placeholder='Where did you go?' />
                        </Form.Item>
                        <CloseCircleOutlined
                            className="dynamic-delete-button"
                            disabled={disableDelBtns.loc2}
                            style={{ margin: '0 8px' }}
                            onClick={() => clearLocation(locations.loc2)}
                        />
                        <Button type="link" onClick={() => onButtonClicked(locations.loc2)}>Select location</Button>
                    </Form.Item>
                    <Form.Item 
                        name={locations.loc2Hidden}
                        noStyle
                        style={{ display: 'none' }} >
                        <Input readOnly={true} style={{ display: 'none' }} />
                    </Form.Item>
                </Form.Item>
                
                {/* TODO: UPLOAD */}
                <Form.Item
                    label="Photos" >
                    <Upload
                        action={handleUpload}
                        customRequest={customRequest}
                        listType="picture-card"
                        onPreview={handlePreview}
                        onChange={handleChange} >
                        { fileList.length >=2 ? null : <UploadButton /> }
                    </Upload>
                    <Modal
                        visible={previewInfo.previewVisible}
                        title={previewInfo.previewTitle}
                        footer={null}
                        onCancel={handleCancel}
                        >
                        <img alt="example" style={{ width: '100%' }} src={previewInfo.previewImage} />
                    </Modal>
                </Form.Item>

                <Form.Item
                    {...tailLayout} >
                        <Space>
                            <Button type="primary" htmlType="submit">{btnName}</Button>
                            {existingTrip && 
                                <Button type="link" onClick={onCancel}>Cancel</Button>
                            }
                        </Space>
                </Form.Item>

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
                        onLocSelected={onLocSelected} />
            </Modal>            
        </Form>
    )
}

const UploadButton = () => {
    return (
        <div>
            <PlusOutlined />
            <div className="ant-upload-text">Upload</div>
        </div>
    )
}
const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

export default EditTrip