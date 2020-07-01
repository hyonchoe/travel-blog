import React, { useState, useRef } from 'react'
import { Button, Input, DatePicker, Form, Space, Modal, Upload  } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import './EditTrip.css'

import axios from 'axios'
import tripService from './services/tripService.js'
import LocationSelect from './LocationSelect';

const EditTrip = props => {
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
    const [fileReader, setFileReader] = useState(new FileReader())
    const [previewInfo, setPreviewInfo] = useState({
        previewVisible: false,
        previewImage: '',
        privewTitle: '',
    })
    
    const getInitialImgValues = (images) => {
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
        getInitialImgValues(props.editTrip.images)
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
    // TODO:
    const getInitialNameToUrlMapping = (images) => {
        let mapping = {}
        images.forEach((img) => {
            mapping[img.fileUrlName] = { 
                name: img.name,
                fileUrlName: img.fileUrlName,
                pendingFileUrl: img.S3Url,
            }
        })

        return mapping
    }
    const [nameToUrlName, setNameToUrlName] = useState(
        (props.editTrip && props.editTrip.images) ?
        getInitialNameToUrlMapping(props.editTrip.images)
        : {}
    )
    
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
        const curFileList = info.fileList
        setFileList(curFileList)
        
        if (file.status === 'done' || file.status === 'removed'){
            if(file.status === 'done'){
                fileReader.onloadend = null
            }
            return
        }

        if (!fileReader.onloadend){
            fileReader.onloadend = (obj) => {
                myImage.current = obj.srcElement.result
            }
            fileReader.readAsArrayBuffer(file.originFileObj);
        }
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

                <LocationSelect form={form} editTrip={existingTrip} />

                <Form.Item
                    {...tailLayout} >
                        <Space>
                            <Button type="primary" htmlType="submit">{btnName}</Button>
                            {existingTrip && 
                                <Button type="link" onClick={onCancel}>Cancel</Button>
                            }
                        </Space>
                </Form.Item>
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