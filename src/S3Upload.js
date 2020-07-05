import React, { useState, useRef } from 'react'
import axios from 'axios'
import { PlusOutlined } from '@ant-design/icons';
import { Form, Modal, Upload, message  } from 'antd'
import { useAuth0 } from '@auth0/auth0-react'

import tripService from './services/tripService.js'

const S3Upload = (props) => {
    const myImage = useRef('')
    const [fileReader, setFileReader] = useState(new FileReader())
    const [previewInfo, setPreviewInfo] = useState({
        previewVisible: false,
        previewImage: '',
        privewTitle: '',
    })

    const { getAccessTokenSilently } = useAuth0()
    
    /**
     * File is object:
     *  {
            uid: '',
            name: '',
            status: '',
            url: '',
        }
    */
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
    const [fileList, setFileList] = useState(getInitialImgValues(props.images))
    /**
     * Object of images with rc_uid key
     * { 
     *      rc_uid: {name: '', fileUrlName: ''},
     *      ...
     * }
     */
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
    const getInitialValues = () => {
        return {
            fileList: getInitialImgValues(props.images),
            nameToUrlNameMap: getInitialNameToUrlMapping(props.images),
        }
    }

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
        props.form.setFieldsValue({
            [props.fieldName]: {
                fileList: curFileList,
            }})
        
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

        await new Promise(resolve => waitUntilImageLoaded(resolve))
        const type = file.type
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
            })
            .catch(error => {
                onError(error)
            })
            .finally(() => {
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
            const urlInfo = await tripService.getS3SignedUrl(fileType, getAccessTokenSilently)
            signedUrl = urlInfo.signedUrl
            const fileUID = file.uid
            const fileNameInfo = {
                name: fileName,
                fileUrlName: urlInfo.fileUrlName,
                pendingFileUrl: urlInfo.pendingFileUrl,
            }
            const curNameToUrlName = props.form.getFieldValue(props.fieldName).nameToUrlNameMap
            const updatedNameToUrlName = {...curNameToUrlName,  [fileUID]: fileNameInfo }
            
            props.form.setFieldsValue({
                [props.fieldName]: {
                    nameToUrlNameMap: updatedNameToUrlName,
                }})
        } catch (err) {
            console.log(err)
        }
        
        // TODO: error handling
        return signedUrl
    }
    const uploadInProgressMsg = () => {
        message.error('File upload is not completed yet.')
    }

    return (
        <Form.Item
            label="Photos"
            name={props.fieldName}
            initialValue={getInitialValues()}
            rules={[{
                validator: (rule, value) => {
                        const curFileList = value.fileList
                        let uploadInProgress = false
                        if(curFileList){
                            console.log(curFileList.length)
                            for(let i=0; i<curFileList.length; i++){
                                console.log(curFileList[i].status)
                                if(curFileList[i].status === 'uploading'){
                                    uploadInProgress = true
                                    break
                                }
                            }
                        }

                        if (uploadInProgress){
                            uploadInProgressMsg()
                            return Promise.reject('')
                            
                        }
                        return Promise.resolve()
                    }
                }]}
             >
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
                <img alt="preview" style={{ width: '100%' }} src={previewInfo.previewImage} />
            </Modal>
        </Form.Item>
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

export default S3Upload