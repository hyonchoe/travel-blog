import React, { useState, useRef } from 'react'
import { Upload, Modal, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import tripService from './services/tripService.js'

import axios from 'axios'

const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

const S3Uploader = () => {
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

    //TODO
    const handleUpload = async (file) => {
        const fileName = file.name
        const fileType = file.type
        let urlInfo = null

        console.log("handleUpload "+fileName)
        console.log("handleUpload "+fileType)

        try{
            urlInfo = await tripService.getS3SignedUrl(fileName, fileType)
        } catch (err) {
            console.log("handleUpload "+err)
        }
        
        console.log("handleUpload "+urlInfo.signedUrl)
        
        // TODO: error handling?
        return (urlInfo) ? urlInfo.signedUrl : ''
    }

    return (
        <div>
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
        </div>
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

export default S3Uploader