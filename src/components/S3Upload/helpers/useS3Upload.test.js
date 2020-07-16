import { act } from 'react-dom/test-utils'
import useS3Upload from './useS3Upload'
import { testHook } from '../../../testUtils'
import tripService from '../../../services/api'

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
        expect(useS3UploadHook.uploadInProgress([{ status: 'done' }])).toBe(false)
    })

    it('is in progress', () => {
        expect(useS3UploadHook.uploadInProgress([{ status: 'uploading' }])).toBe(true)
        expect(useS3UploadHook.uploadInProgress([{ status: 'done' }, { status: 'uploading' }])).toBe(true)
    })
})

describe('Preview', () => {
    beforeEach(() => {
        testHook(() => {
            useS3UploadHook = useS3Upload()
        })
    })

    it('has right data', () => {
        let file = { name: 'dummyname', url: 'dummyurl' }
        act(() => {
            useS3UploadHook.showPreview(file)
        })
        let expected = { previewImage: 'dummyurl', previewVisible: true, previewTitle: 'dummyname' }
        expect(useS3UploadHook.previewInfo).toEqual(expected)

        file = { name: 'dummyname', preview: 'dummypreviewdata' }
        act(() => {
            useS3UploadHook.showPreview(file)
        })
        expected = { previewImage: 'dummypreviewdata', previewVisible: true, previewTitle: 'dummyname' }
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
        const names =  ['dummyname1', 'dummyname2', 'dummyname3']
        const fileUrlNames = ['dummyurlname1', 'dummyurlname2', 'dummyurlname3']
        const s3Urls = ['dummys3url1', 'dummys3url2', 'dummys3url3']
        
        beforeEach(() => {
            testHook(() => {
                useS3UploadHook = useS3Upload([
                    {name: names[0], fileUrlName: fileUrlNames[0], S3Url: s3Urls[0]},
                    {name: names[1], fileUrlName: fileUrlNames[1], S3Url: s3Urls[1]},
                    {name: names[2], fileUrlName: fileUrlNames[2], S3Url: s3Urls[2]},
                ])
            })
        })

        it('is correct for file list', ()=> {
            const expected = [
                {uid: fileUrlNames[0], name: names[0], status: 'done', url: s3Urls[0] },
                {uid: fileUrlNames[1], name: names[1], status: 'done', url: s3Urls[1] },
                {uid: fileUrlNames[2], name: names[2], status: 'done', url: s3Urls[2] },
            ]
            expect(useS3UploadHook.initialFileList()).toEqual(expected)
        })
    
        it('is correct for name to url-name map', ()=> {
            const expected = {
                [fileUrlNames[0]]: {
                    name: names[0],
                    fileUrlName: fileUrlNames[0],
                    pendingFileUrl: s3Urls[0],
                },
                [fileUrlNames[1]]: {
                    name: names[1],
                    fileUrlName: fileUrlNames[1],
                    pendingFileUrl: s3Urls[1],
                },
                [fileUrlNames[2]]: {
                    name: names[2],
                    fileUrlName: fileUrlNames[2],
                    pendingFileUrl: s3Urls[2],
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