import React from 'react'
import { Form, Modal, Upload, message  } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import useS3Upload from './helpers/useS3Upload'

const S3Upload = (props) => {
    const { previewInfo, fileList, previewCancel, showPreview,
            getS3SignedUrl, upload, chkUploadUpdates,
            initialFileList, initialNameToUrlNameMap, uploadInProgress } = useS3Upload(props.images)
    
    const getInitialValues = () => {
        return {
            fileList: initialFileList(),
            nameToUrlNameMap: initialNameToUrlNameMap(),
        }
    }

    const handleChange = (info) => {
        const file = info.file
        const curFileList = info.fileList
        props.form.setFieldsValue({
            [props.fieldName]: {
                fileList: curFileList,
            }})
        chkUploadUpdates(file, curFileList)
    }

    const getSignedUrl = async (file) => {
        let signedUrl = ''
        try {
            const fileUrlInfo = await getS3SignedUrl(file.name, file.type, file.uid)
            signedUrl = fileUrlInfo.signedUrl
            
            const fileNameInfo = fileUrlInfo.fileNameInfo
            const curNameToUrlName = props.form.getFieldValue(props.fieldName).nameToUrlNameMap
            const updatedNameToUrlName = {...curNameToUrlName,  ...fileNameInfo }
            props.form.setFieldsValue({
                [props.fieldName]: {
                    nameToUrlNameMap: updatedNameToUrlName,
                }})
        } catch (err) {
            message.error('There was an issue with upload.')
        }
        
        return signedUrl
    }

    const uploadInProgressMsg = () => {
        message.error('File upload is not completed yet.')
    }

    const uploadLimit = 2

    return (
        <Form.Item
            label="Photos"
            name={props.fieldName}
            initialValue={getInitialValues()}
            rules={[{
                validator: (rule, value) => {
                        if (uploadInProgress(value.fileList)){
                            uploadInProgressMsg()
                            return Promise.reject('')
                            
                        }
                        return Promise.resolve()
                    }
                }]} >
            <Upload
                fileList={fileList}
                action={getSignedUrl}
                customRequest={upload}
                listType="picture-card"
                onPreview={showPreview}
                onChange={handleChange} >
                { fileList.length >= uploadLimit ? null : <UploadButton /> }
            </Upload>
            <Modal
                visible={previewInfo.previewVisible}
                title={previewInfo.previewTitle}
                footer={null}
                onCancel={previewCancel}
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

export default S3Upload