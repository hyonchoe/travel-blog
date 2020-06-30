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
    const [disableDelBtns, setDisableDelBtns] = useState([
        (props.editTrip && props.editTrip.locations && props.editTrip.locations.length > 0) ? false : true,
        (props.editTrip && props.editTrip.locations && props.editTrip.locations.length > 1) ? false : true,
        (props.editTrip && props.editTrip.locations && props.editTrip.locations.length > 2) ? false : true,
    ])
    const [modalVisible, setModalVisible] = useState(false)
    const [locFieldNameIndex, setLocFieldNameIndex] = useState(-1)

    const latLngDelim = ','
    const hiddenSuffix = '_hidden'
    
    const locationFldNames = [
        {
            fmtAddr: 'loc0',
            latLng: 'loc0' + hiddenSuffix,
        },
        {
            fmtAddr: 'loc1',
            latLng: 'loc1' + hiddenSuffix,
        },
        {
            fmtAddr: 'loc2',
            latLng: 'loc2' + hiddenSuffix,
        },
    ]

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
        value[locationFldNames[locFieldNameIndex].fmtAddr] = addr.fmtAddr
        value[locationFldNames[locFieldNameIndex].latLng] = (markerLatLng.lat) ? markerLatLng.lat + latLngDelim + markerLatLng.lng : null
        form.setFieldsValue(value)
        
        let btnDisableValues = disableDelBtns.slice() // copying it
        btnDisableValues[locFieldNameIndex] = false
        setDisableDelBtns(btnDisableValues)

        setModalVisible(false)
        clearMapStates()

        setLocFieldNameIndex(-1)
    }
    const handleModalCancel = () => {
        setModalVisible(false)
        clearMapStates()

        setLocFieldNameIndex(-1)
    }
    const onLocSelected = (locAddrInfo, locLatLngInfo) => {
        setAddr(locAddrInfo)
        setMarkerLatLng(locLatLngInfo)
        setMapCenter(locLatLngInfo)
    }
    const clearLocation = (curLocFldIndex) => {
        let reset = {}
        reset[locationFldNames[curLocFldIndex].fmtAddr] = ''
        reset[locationFldNames[curLocFldIndex].latLng] = ''
        form.setFieldsValue(reset)

       let btnDisableValues = disableDelBtns.slice() // copying it
       btnDisableValues[curLocFldIndex] = true
       setDisableDelBtns(btnDisableValues)
    }
    const clearMapStates = () => {
        const resetAddr = getInitialAddr()
        const resetMarker = getInitialMarker()
        const resetMapCenter = getInitialMapCenter()

        setAddr(resetAddr)
        setMarkerLatLng(resetMarker)
        setMapCenter(resetMapCenter)
    }

    const onButtonClicked = (locFieldNameIndex) => {
        setModalVisible(true)
        setLocFieldNameIndex(locFieldNameIndex)
    }

    const getInitialFormValues = () => {
        if (props.editTrip){
            let initialValues = {
                title: existingTrip.title,
                dates: [existingTrip.startDate, existingTrip.endDate],
                details: existingTrip.details,            
            }
            const locInitialValues = getInitialLocValues(existingTrip.locations)
            initialValues = {...initialValues, ...locInitialValues}
            
            return initialValues
        }

        return {}
    }

    const getInitialLocValues = (existingLocations) => {
        let initialValues = {}

        for(let i=0; i<existingLocations.length; i++){
            initialValues[locationFldNames[i].fmtAddr] = existingLocations[i].fmtAddr
            initialValues[locationFldNames[i].latLng] = existingLocations[i].latLng[0] + latLngDelim + existingLocations[i].latLng[1]
        }

        return initialValues
    }

    const onFinish = values => {
        let counter = 0
        let locationData = []
        
        // Get location data
        if (values[locationFldNames[0].latLng]){
            locationData[counter] = {
                fmtAddr: values[locationFldNames[0].fmtAddr],
                latLng: values[locationFldNames[0].latLng].split(latLngDelim).map((coordinate) =>{
                    return parseFloat(coordinate)
                }),
            }
            counter++
        }
        if (values[locationFldNames[1].latLng]){
            locationData[counter] = {
                fmtAddr: values[locationFldNames[1].fmtAddr],
                latLng: values[locationFldNames[1].latLng].split(latLngDelim).map((coordinate) =>{
                    return parseFloat(coordinate)
                }),
            }
            counter++
        }
        if (values[locationFldNames[2].latLng]){
            locationData[counter] = {
                fmtAddr: values[locationFldNames[2].fmtAddr],
                latLng: values[locationFldNames[2].latLng].split(latLngDelim).map((coordinate) =>{
                    return parseFloat(coordinate)
                }),
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
                        S3Url: curFileNameInfo.pendingFileUrl,
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
    
    const getInitialImgvalues = (images) => {
        let initialValues = []
        images.forEach((img) => {
            initialValues.push({
                uid: img.fileUrlName,
                name: img.name,
                status: 'done',
                url: img.S3Url
            })
        })

        return initialValues
    }    
    
    const [fileList, setFileList] = useState(
        (props.editTrip && props.editTrip.images) ?
        getInitialImgvalues(props.editTrip.images)
        : []
    )
    /**
     * File is object:
     *  {
            uid: '',
            name: '',
            stats: '',
            url: '',
        }
        */
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
        setFileList(fileList)
        
        if (file.status === 'done' || file.status === 'removed'){
            return
        }

        const reader = new FileReader()
        reader.onloadend = (obj) => {
                myImage.current = obj.srcElement.result
        }
        reader.readAsArrayBuffer(file.originFileObj);
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
                pendingFileUrl: urlInfo.pendingFileUrl,
            }
            setNameToUrlName({...nameToUrlName,  [fileUID]: fileNameInfo })
            
        } catch (err) {
            console.log("handleUpload "+err)
        }
        
        // TODO: error handling
        return signedUrl
    }
    //----------------------------------------------------------

    const [form] = Form.useForm()
    const existingTrip = props.editTrip
    let btnName = (existingTrip) ? 'Update' : 'Submit'

    return (
        <Form
            form={form}
            {...layout}
            initialValues={getInitialFormValues()}
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
                            name={locationFldNames[0].fmtAddr}
                            style={{ display: 'inline-block' }}
                             >
                            <Input readOnly={true} placeholder='Where did you go?' />
                        </Form.Item>
                        <CloseCircleOutlined
                            className="dynamic-delete-button"
                            disabled={disableDelBtns[0]}
                            style={{ margin: '0 8px' }}
                            onClick={() => clearLocation(0)} />
                        <Button type="link" onClick={() => onButtonClicked(0)}>Select location</Button>
                    </Form.Item>
                    <Form.Item 
                        name={locationFldNames[0].latLng}
                        noStyle
                        style={{ display: 'none' }} >
                        <Input readOnly={true} style={{ display: 'none' }} />
                    </Form.Item>

                    <Form.Item
                        style={{display: 'block', margin: '0'}} >
                        <Form.Item
                            name={locationFldNames[1].fmtAddr}
                            style={{ display: 'inline-block' }} >
                            <Input readOnly={true} placeholder='Where did you go?' />
                        </Form.Item>
                        <CloseCircleOutlined
                            className="dynamic-delete-button"
                            disabled={disableDelBtns[1]}
                            style={{ margin: '0 8px' }}
                            onClick={() => clearLocation(1)}
                        />
                        <Button type="link" onClick={() => onButtonClicked(1)}>Select location</Button>
                    </Form.Item>
                    <Form.Item 
                        name={locationFldNames[1].latLng}
                        noStyle
                        style={{ display: 'none' }} >
                        <Input readOnly={true} style={{ display: 'none' }} />
                    </Form.Item>

                    <Form.Item
                        style={{display: 'block', margin: '0'}} >
                        <Form.Item
                            name={locationFldNames[2].fmtAddr}
                            style={{ display: 'inline-block' }} >
                            <Input readOnly={true} placeholder='Where did you go?' />
                        </Form.Item>
                        <CloseCircleOutlined
                            className="dynamic-delete-button"
                            disabled={disableDelBtns[2]}
                            style={{ margin: '0 8px' }}
                            onClick={() => clearLocation(2)}
                        />
                        <Button type="link" onClick={() => onButtonClicked(2)}>Select location</Button>
                    </Form.Item>
                    <Form.Item 
                        name={locationFldNames[2].latLng}
                        noStyle
                        style={{ display: 'none' }} >
                        <Input readOnly={true} style={{ display: 'none' }} />
                    </Form.Item>
                </Form.Item>
                
                {/* TODO: UPLOAD */}
                <Form.Item
                    label="Photos" >
                    <Upload
                        fileList={fileList}
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