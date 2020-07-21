/**
 * S3Upload component to use in Form for uploading images to AWS S3
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Upload, message  } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import useS3Upload from './helpers/useS3Upload'

const S3Upload = (props) => {
    S3Upload.propTypes = {
        /** FormInstance for the form this component is being used in */
        form: PropTypes.object.isRequired,
        /** Field name for the component, used to access values from the form */
        fieldName: PropTypes.string.isRequired,
        /** Existing trip images */
        images: PropTypes.array
    }
    S3Upload.defaultProps = {
        fieldName: 's3upload'
    }

    const UPLOAD_LIMIT = 2

    const { previewInfo, fileList,
            previewCancel, showPreview, getS3SignedUrl, upload, chkUploadUpdates,
            initialFileList, initialNameToUrlNameMap, uploadInProgress } = useS3Upload(props.images)
    
    /**
     * Gets initial values for trip with existing images
     * @returns {Object} Uploaded images data
     */
    const getInitialValues = () => {
        return {
            fileList: initialFileList(),
            nameToUrlNameMap: initialNameToUrlNameMap(),
        }
    }

    /**
     * Updates the form with latest value and check status of upload action
     * @param {Object} info Upload info
     */
    const handleChange = (info) => {
        const file = info.file
        const curFileList = info.fileList
        props.form.setFieldsValue({
            [props.fieldName]: {
                fileList: curFileList,
            }})
        chkUploadUpdates(file, curFileList)
    }

    /**
     * Gets signed URL to upload file to and updates mapping
     * for original file and URL file name
     * @param {Object} file Upload file
     * @returns {string} Signed URL
     */
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

    return (
        <Form.Item
            label="Photos"
            name={props.fieldName}
            initialValue={getInitialValues()}
            rules={[{
                validator: (rule, value) => {
                        if (uploadInProgress(value.fileList)){
                            message.error('File upload is not completed yet.')
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
                { fileList.length >= UPLOAD_LIMIT ? null : <UploadButton /> }
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

//#region Helper components
/**
 * Simple Upload button component
 */
const UploadButton = () => {
    return (
        <div>
            <PlusOutlined />
            <div className="ant-upload-text">Upload</div>
        </div>
    )
}
//#endregion

export default S3Upload