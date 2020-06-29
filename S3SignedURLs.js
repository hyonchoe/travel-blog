require('dotenv').config()
const AWS = require('aws-sdk')
const BUCKET_REGION = process.env.S3_BUCKET_REGION
const ID = process.env.S3_ID
const ACCESS_KEY = process.env.S3_ACCESS_KEY
const BUCKET_NAME = process.env.S3_BUCKET_NAME

AWS.config.update({region: BUCKET_REGION})
const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: ACCESS_KEY,
    signatureVersion: 'v4',
})

genSignedUrlPut = (name, type) => {
    return new Promise((resolve, reject) => {
        const params = { 
            Bucket: BUCKET_NAME, 
            Key: name, 
            Expires: 120, 
            ContentType: type,
            ACL:'public-read',
        }
        s3.getSignedUrl('putObject', params, (err, url) => {
          if (err) {
            console.log(err)
            reject(err)
          }
          const pendingFileUrl = `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${name}`
          resolve({ signedUrl: url, pendingFileUrl: pendingFileUrl })
        })
      })
}

module.exports = { genSignedUrlPut }