/**
 * Hook for handling uploading to S3.
 * 
 * Run by running 'npm test' in command line.
 */

import { act } from 'react-dom/test-utils'
import useS3Upload from './useS3Upload'
import { testHook } from '../../../testutils/testHook'
import tripService from '../../../services/api'
import mockData from '../../../testutils/mockData'

const doneStatus = 'done'
const uploadingStatus = 'uploading'
let useS3UploadHook

describe('Upload', () => {
    beforeEach(() => {
        testHook(() => {
            useS3UploadHook = useS3Upload()
        })
    })

    it('is not in progress', () => {
        expect(useS3UploadHook.uploadInProgress()).toBe(false)
        expect(useS3UploadHook.uploadInProgress([])).toBe(false)
        expect(useS3UploadHook.uploadInProgress([{ status: doneStatus }])).toBe(false)
    })

    it('is in progress', () => {
        expect(useS3UploadHook.uploadInProgress([{ status: uploadingStatus }])).toBe(true)
        expect(useS3UploadHook.uploadInProgress([{ status: doneStatus }, { status: uploadingStatus }])).toBe(true)
    })
})

describe('Preview', () => {
    beforeEach(() => {
        testHook(() => {
            useS3UploadHook = useS3Upload()
        })
    })

    it('has right data', () => {
        const dummyName = 'dummyname'
        const dummyUrl = 'dummyurl'
        const dummyPreviewData = 'dummypreviewdata'

        let file = { name: dummyName, url: dummyUrl }
        act(() => {
            useS3UploadHook.showPreview(file)
        })
        let expected = { previewImage: dummyUrl, previewVisible: true, previewTitle: dummyName }
        expect(useS3UploadHook.previewInfo).toEqual(expected)

        file = { name: dummyName, preview: dummyPreviewData }
        act(() => {
            useS3UploadHook.showPreview(file)
        })
        expected = { previewImage: dummyPreviewData, previewVisible: true, previewTitle: dummyName }
        expect(useS3UploadHook.previewInfo).toEqual(expected)
    })
})

describe('Initial values for', () => {
    describe('new trip/no existing images', () => {
        beforeEach(() => {
            testHook(() => {
                useS3UploadHook = useS3Upload()
            })
        })

        it('is correct for file list', ()=> {
            expect(useS3UploadHook.initialFileList().length).toBe(0)
        })
    
        it('is correct for name to url-name map', ()=> {
            expect(useS3UploadHook.initialNameToUrlNameMap()).toEqual({})
        })
    })

    describe('trip with existing images', () => {
        const images = mockData().images
        const expectedUrlNames = [...images.map((img) => (img.fileUrlName))]
        const expectedUids = expectedUrlNames
        const expectedNames = [...images.map((img) => (img.name))]
        const expectedS3Urls = [...images.map((img) => (img.S3Url))]
        
        beforeEach(() => {
            testHook(() => {
                useS3UploadHook = useS3Upload(images)
            })
        })

        it('is correct for file list', ()=> {
            const expected = [
                {uid: expectedUids[0], name: expectedNames[0], status: doneStatus, url: expectedS3Urls[0] },
                {uid: expectedUids[1], name: expectedNames[1], status: doneStatus, url: expectedS3Urls[1] },
                {uid: expectedUids[2], name: expectedNames[2], status: doneStatus, url: expectedS3Urls[2] },
            ]
            expect(useS3UploadHook.initialFileList()).toEqual(expected)
        })
    
        it('is correct for name to url-name map', ()=> {
            const expected = {
                [expectedUids[0]]: {
                    name: expectedNames[0],
                    fileUrlName: expectedUrlNames[0],
                    pendingFileUrl: expectedS3Urls[0],
                },
                [expectedUids[1]]: {
                    name: expectedNames[1],
                    fileUrlName: expectedUrlNames[1],
                    pendingFileUrl: expectedS3Urls[1],
                },
                [expectedUids[2]]: {
                    name: expectedNames[2],
                    fileUrlName: expectedUrlNames[2],
                    pendingFileUrl: expectedS3Urls[2],
                },
            }
            expect(useS3UploadHook.initialNameToUrlNameMap()).toEqual(expected)
        })
    })
})

describe('S3 signed url', () =>{
    beforeEach(() => {
        testHook(() => {
            useS3UploadHook = useS3Upload()
        })
    })

    it('is generated successfully', async () => {
        const dummyFileName = 'dummyfilename'
        const dummyFileType = 'dummyfiletype'
        const dummyUID = 'dummyuid'
        const dummyUrlName = 'dummyurlname'
        const dummyFileUrl = 'dummyfileurl'
        const dummySignedUrl = 'dummysignedurl'

        tripService.getS3SignedUrl = jest.fn().mockResolvedValue({
            fileUrlName: dummyUrlName,
            pendingFileUrl: dummyFileUrl,
            signedUrl: dummySignedUrl
        })

        const expectedFileNameInfo = {
            [dummyUID]:
            {
                name: dummyFileName,
                fileUrlName: dummyUrlName,
                pendingFileUrl: dummyFileUrl,
            }
        }
        const response = await useS3UploadHook.getS3SignedUrl(dummyFileName, dummyFileType, dummyUID)
        const expected = { signedUrl: dummySignedUrl, fileNameInfo: expectedFileNameInfo }
        expect(response).toEqual(expected)
    })
})