/**
 * Hook for handling image uploads to S3
 */

import { useState, useRef } from 'react'
import axios from 'axios'
import { useAuth0 } from '@auth0/auth0-react'
import tripService from '../../../services/api'

const useS3Upload = (images) => {
    const { getAccessTokenSilently } = useAuth0()
    const myImage = useRef('')
    const [fileReader, setFileReader] = useState(new FileReader())
    const [fileList, setFileList] = useState(getInitialImgValues(images))
    const [previewInfo, setPreviewInfo] = useState({
        previewVisible: false,
        previewImage: '',
        privewTitle: '',
    })

    /**
     * Gets signed URL to upload file to
     * @param {string} fileName Upload file name
     * @param {*} fileType Uplaod file type
     * @param {*} fileUID Client generated unique ID for upload file
     * @returns {Object} Signed URL data
     */
    const getS3SignedUrl = async (fileName, fileType, fileUID) => {
        try{
            const urlInfo = await tripService.getS3SignedUrl(fileType, getAccessTokenSilently)
            const fileNameInfo = {
                [fileUID]:
                    {
                        name: fileName,
                        fileUrlName: urlInfo.fileUrlName,
                        pendingFileUrl: urlInfo.pendingFileUrl,
                    }
            }
            return { signedUrl: urlInfo.signedUrl, fileNameInfo: fileNameInfo }
        } catch (err) {
            console.error(err)
            throw err
        }
    }

    /**
     * Uploads the file to S3.
     * 1) Wait until image is done loaded
     * 2) Start upload to S3
     * 3) Check on the progress and clean up when done
     * @param {Object} option Upload custom request options
     */
    const upload = async (option) => {
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

    /**
     * @callback resolveCallback
     */
    /**
     * Waits until image is done loaded
     * @param {resolveCallback} resolve Resolve callback for Promise
     */
    const waitUntilImageLoaded = (resolve) => {
        setTimeout( () => {
            if (myImage.current){
                resolve()
            } else {
                waitUntilImageLoaded(resolve)
            }
        }, 100)
    }

    /**
     * Checks upload progress.
     * - Starts file load
     * - Upload starts
     * - Checks for upload being done. 
     * Also checks for 'removed' update to upload file list.
     * @param {Object} file Upload file
     * @param {Array} curFileList File list for the uploads
     */
    const chkUploadUpdates = (file, curFileList) => {
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
            fileReader.readAsArrayBuffer(file.originFileObj)
        }
    }

    /**
     * Gets initial file list for trip
     * @returns {Array} File list with existing images data
     */
    const initialFileList = () => {
        return getInitialImgValues(images)
    }

    /**
     * Gets initial name-urlname mapping for the trip
     * @returns {Object} Name mapping for existing images data
     */
    const initialNameToUrlNameMap = () => {
        return getInitialNameToUrlMapping(images)
    }

    /**
     * Closes image preview modal
     */
    const previewCancel = () => {
        setPreviewInfo({ previewVisible: false })
    }

    /**
     * Opens image preview modal.
     * If no existing data to use, then image is loaded.
     * @param {Object} file Upload file
     */
    const showPreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }

        setPreviewInfo({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/')+1),
        })
    }

    /**
     * Checks if any upload is currently in progress
     * @param {Array} curFileList File list for the uploads
     * @returns {boolean} True if any upload is in progress, false otherwise
     */
    const uploadInProgress = (curFileList) => {
        let uploadInProgress = false
        if(curFileList){
            for(let i=0; i<curFileList.length; i++){
                if(curFileList[i].status === 'uploading'){
                    uploadInProgress = true
                    break
                }
            }
        }
        return uploadInProgress
    }

    return { previewInfo, fileList,
            previewCancel, showPreview, getS3SignedUrl,
            upload, chkUploadUpdates, initialFileList, initialNameToUrlNameMap, uploadInProgress }
}

//#region Helper methods
/**
 * Gets initial file list to use for upload using existing trip images
 * @param {Array} images Trip images data
 * @returns {Array} File list populated with existing images data
 */
const getInitialImgValues = (images) => {
    let initialValues = []
    if (!images){
        return initialValues
    } 

    /**
     * File is object:
     *  {
            uid: '',
            name: '',
            status: '',
            url: '',
        }
    */    
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

/**
 * Gets initial name-urlname mapping for existing trip images
 * @param {Array} images Trip images data
 * @returns {Object} Name-urlname mapping for existing trip images
 */
const getInitialNameToUrlMapping = (images) => {    
    let mapping = {}
    if (!images){
        return mapping
    }

    images.forEach((img) => {
        mapping[img.fileUrlName] = { 
            name: img.name,
            fileUrlName: img.fileUrlName,
            pendingFileUrl: img.S3Url,
        }
    })

    return mapping
}

/**
 * Loads/Reads the file
 * @param {Object} file Upload file
 */
const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
}
//#endregion

export default useS3Upload