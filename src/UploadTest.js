import React, { useState } from 'react'
import { Upload, Modal, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import tripService from './services/tripService.js'

const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

const UploadTest = () => {
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
    
    const handleCancel = () => {
        setPreviewInfo({ previewVisible: false })
    }

    const handlePreview = async (file) => {
        if (!file.url && file.preview) {
            file.preivew = await getBase64(file.originFileObj)
        }

        setPreviewInfo({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/')+1),
        })
    }

    const handleChange = ({ fileList }) => {
        setFileList(fileList)
    }

    //TODO
    const uploadFile = async (file) => {
        const fileName = file.name
        const fileType = file.type
        const signedUrl = await tripService.getS3SignedUrl(fileName, fileType)
        if (signedUrl){
            await tripService.uploadFile(file)
        }
    }

    const hacTest = async () => {
        console.log('button clicked')
        const signedUrl = await tripService.getS3SignedUrl('testName', 'image/jpeg')
        console.log(signedUrl)
    }

    return (
        <div>
            <Upload
                customRequest={uploadFile}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange} >
                { fileList.length >=2 ? null : <UploadButton /> }
            </Upload>

            <Button onClick={hacTest}>CLICK ME</Button>
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

export default UploadTest