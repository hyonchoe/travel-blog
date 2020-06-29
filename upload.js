require('dotenv').config()
const fs = require('fs')
const AWS = require('aws-sdk')
AWS.config.update({region: 'us-east-2'})

const ID = process.env.S3_ID
const ACCESS_KEY = process.env.S3_ACCESS_KEY
const BUCKET_NAME = process.env.S3_BUCKET_NAME

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: ACCESS_KEY,
})

const uploadFile = (fileName) => {
    const fileContent = fs.readFileSync(fileName)

    const params = {
        Bucket: BUCKET_NAME,
        Key: 'upload_test2.jpg',
        Body: fileContent,
    }

    s3.upload(params, (err, data) => {
        if (err) {
            throw err
        }
        console.log(`File uploaded successfully. ${data.Location}`)
    })
}

uploadFile('./test_images/test_image2.jpg')
