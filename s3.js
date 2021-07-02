require('dotenv').config()
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

// Uploads a file to s3
function uploadFile(file, mainPath) {
    const fileStream = fs.createReadStream(file.path)

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: mainPath+file.filename
    }

    return s3.upload(uploadParams).promise()
}
exports.uploadFile = uploadFile

// Delete a file to s3
function deleteFileStream(fileKey, mainPath) {
    const deleteParams = {
        Key: mainPath+fileKey,
        Bucket: bucketName  
    }
    console.log(deleteParams)

    return s3.deleteObject(deleteParams, (error, data) => {
        if (error) {
            console.log(error)
        } else {
            console.log("File has been deleted successfully");
        }
    })
}
exports.deleteFileStream = deleteFileStream