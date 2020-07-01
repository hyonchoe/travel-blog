const express = require('express')
const cors = require('cors')
const moment = require('moment')
const { MongoClient } = require('mongodb')
const { response } = require('express')
const ObjectId = require("mongodb").ObjectID
const { genSignedUrlPut, getImageS3URL, deleteS3Images, copyToPermanentBucket } = require('./S3Service')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const port = process.env.PORT || 5000
const dbusername = process.env.DB_ADMIN_USERNAME
const dbpassword = process.env.DB_ADMIN_PASSWORD
const dbname = process.env.DB_NAME
const uri = `mongodb+srv://${dbusername}:${dbpassword}@travelblog-ugmhk.mongodb.net/${dbname}?retryWrites=true&w=majority`

app.listen(port, () => console.log(`Listening on port ${port}`))

// Create a trip (POST)
app.post('/trips', async (req, res) => {
    const mgClient = new MongoClient(uri, { useUnifiedTopology: true })
    const tripLocations = req.body.locations
    const tripImages = req.body.images

    // No need to save S3Url to database
    tripImages.forEach((img) => {
        delete img.S3Url
    })
    processTripLocData(tripLocations)

    const newTrip = {
        title: req.body.title,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        details: req.body.details,
        locations: tripLocations,
        images: tripImages,
    }

    try {
        const client = await mgClient.connect()
        // Copy over user submitted images from temp bucket to permanent bucket
        for(let i=0; i <tripImages.length; i++){
            await copyToPermanentBucket(tripImages[i].fileUrlName)
        }
        // Insert new trip information to the DB
        let result = await client.db("trips").collection("tripInfo").insertOne(newTrip)

        res.send(result)
    } catch (error){
        console.log(error)

        res.send(error)
    }
})

// Delete existing trip (DEL)
app.delete('/trips/:tripId', async (req, res) => {
    const mgClient = new MongoClient(uri, { useUnifiedTopology: true })
    const tripId = req.params.tripId

    try {
        const client = await mgClient.connect()
        // Delete trip from DB
        let result = await client.db("trips").collection("tripInfo").findOneAndDelete({"_id": ObjectId(tripId)})
        // If there are images to remove from S3, remove them
        if (result.value && result.value.images && result.value.images.length > 0){
            const imagesToRemove = result.value.images.map((img) => {
                return { Key: img.fileUrlName }
            })
            deleteS3Images(imagesToRemove)
        }

        res.send(result)
    } catch (error){
        console.log(error)
        
        res.send(error)
    }
})

// Get existing trips (GET)
app.get('/trips', async (req, res) => {
    const mgClient = new MongoClient(uri, { useUnifiedTopology: true })

    try {
        const client = await mgClient.connect()
        // Find all existing trips
        const result = await client.db("trips").collection("tripInfo").find({}).toArray()
        // Populate S3Url for trips' images 
        result.forEach((trip) => {
            const tripImages = trip.images
            if (tripImages && tripImages.length > 0) {
                tripImages.forEach((imgInfo) => {
                    imgInfo.S3Url = getImageS3URL(imgInfo.fileUrlName)
                })
            }
        })

        res.send(result)
    } catch (error) {
        console.log(error)

        res.send(error)
    }
})

// Update existing trip (PUT)
app.put('/trips/:tripId', async (req, res) => {
    const mgClient = new MongoClient(uri, { useUnifiedTopology: true })
    const tripId = req.params.tripId
    const tripLocations = req.body.locations
    const tripImages = req.body.images
    
    // No need to save S3Url to database
    tripImages.forEach((img) => {
        delete img.S3Url
    })    
    processTripLocData(tripLocations)
    
    const updatedTrip = {
        title: req.body.title,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        details:req.body.details,
        locations: tripLocations,
        images: tripImages,
    }

    try{
        const client = await mgClient.connect()

        // Find existing image information for the trip first to calculate
        // what is new and what is removed
        let result = await client.db("trips").collection("tripInfo").findOne({"_id": ObjectId(tripId)}, {projection: {_id:0 , images:1}})
        let imagesToRemove = []
        let imagesToAdd = []
        if (result) {
            const existingImages = result.images
            imagesToRemove = getImagesToRemove(existingImages, tripImages)
            imagesToAdd = getImagesToAdd(existingImages, tripImages)
        }
        
        // Copy over newly added images from temp bucket to permanent bucket
        for(let i=0; i<imagesToAdd.length; i++){
            await copyToPermanentBucket(imagesToAdd[i])
        }
        // Delete existing images that are removed by the user
        if (imagesToRemove.length > 0){
            deleteS3Images(imagesToRemove)
        }
        // Update trip information in the DB
        result = await client.db("trips").collection("tripInfo").updateOne({"_id": ObjectId(tripId)}, { $set: updatedTrip })

        res.send(result)
    } catch (error){
        console.log(error)

        res.send(error)
    }
})

// Generate S3 signed URL for photo upload
app.get('/get-signed-url', async (req, res) => {
    //TODO: Can add some validation for allowed file type check here
    const fileType = req.query.type
    const urlFileName = new ObjectId().toString()

    try {
        const urlInfo = await genSignedUrlPut(urlFileName, fileType)
        
        res.send(urlInfo)
    } catch (error) {
        console.log(err)

        res.send(err)        
    }
})

const getImagesToRemove = (existingImages, updatedImages) => {
    let remove = []
    let updatedImagesUrlNames = updatedImages.map((img) => {
        return img.fileUrlName
    })
    existingImages.forEach((img) => {
        if (!updatedImagesUrlNames.includes(img.fileUrlName)){
            remove.push({ Key: img.fileUrlName })
        }
    })

    return remove
}
const getImagesToAdd = (existingImages, updatedImages) => {
    let add = []
    let existingImagesUrlNames = existingImages.map((img) => {
        return img.fileUrlName
    })
    updatedImages.forEach((img) => {
        if (!existingImagesUrlNames.includes(img.fileUrlName)){
            add.push(img.fileUrlName)
        }
    })

    return add
}

const processTripLocData = (tripLocations) => {
    tripLocations.forEach((loc) => {
        loc.latLng[0] = parseFloat(loc.latLng[0])
        loc.latLng[1] = parseFloat(loc.latLng[1])
    })
}