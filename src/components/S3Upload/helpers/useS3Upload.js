import { useState, useRef } from 'react'
import axios from 'axios'
import { useAuth0 } from '@auth0/auth0-react'
import tripService from '../../../services/api'

const useS3Upload = (images) => {
    const myImage = useRef('')
    const [fileReader, setFileReader] = useState(new FileReader())
    const [fileList, setFileList] = useState(getInitialImgValues(images))
    const [previewInfo, setPreviewInfo] = useState({
        previewVisible: false,
        previewImage: '',
        privewTitle: '',
    })
    
    const { getAccessTokenSilently } = useAuth0()

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
            console.log(err)
            throw err
        }
    }
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
    const waitUntilImageLoaded = (resolve) => {
        setTimeout( () => {
            if (myImage.current){
                resolve()
            } else {
                waitUntilImageLoaded(resolve)
            }
        }, 100)
    }
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
            fileReader.readAsArrayBuffer(file.originFileObj);
        }
    }
    const initialFileList = () => {
        return getInitialImgValues(images)
    }
    const initialNameToUrlNameMap = () => {
        return getInitialNameToUrlMapping(images)
    }
    const previewCancel = () => {
        setPreviewInfo({ previewVisible: false })
    }
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
    if (!images){
        return initialValues
    } 

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

const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}

export default useS3Upload