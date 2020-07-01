const express = require('express')
const cors = require('cors')
const moment = require('moment')
const { MongoClient } = require('mongodb')
const { response } = require('express')
const ObjectId = require("mongodb").ObjectID
const { genSignedUrlPut, getImageS3URL } = require('./S3SignedURLs')
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

// Get existing trips (GET)
app.get('/trips', (req, res) => {
    const mgClient = new MongoClient(uri, { useUnifiedTopology: true })

    mgClient.connect((error, client) => {
        if(error){
            throw error
        }

        client.db("trips").collection("tripInfo").find().toArray((error, result) => {
            if (error){
                return res.status(500).send(error)
            }

            result.forEach((trip) => {
                const tripImages = trip.images
                if (tripImages && tripImages.length > 0) {
                    tripImages.forEach((imgInfo) => {
                        if (!imgInfo.S3Url){
                            imgInfo.S3Url = getImageS3URL(imgInfo.fileUrlName)
                        }
                    })
                }
            })

            res.send(result)
        })
    })
})

// Create a trip (POST)
app.post('/trips', (req, res) => {
    const mgClient = new MongoClient(uri, { useUnifiedTopology: true })
    const tripLocations = req.body.locations
    processTripLocData(tripLocations)
    
    /**
     * TODO:
     * Add processing on received images information to determine which images on S3
     * storage to move to permanent bucket vs keep in the temp bucket once that's setup
     */
    
    const newTrip = {
        title: req.body.title,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        details: req.body.details,
        locations: tripLocations,
        images: req.body.images,
    }

    mgClient.connect((error, client) => {
        if(error){
            throw error
        }

        client.db("trips").collection("tripInfo").insertOne(newTrip, (error, result) => {
            if (error){
                return res.status(500).send(error)
            }
            res.send(result)
        })
    })
})

// Update existing trip (PUT)
app.put('/trips/:tripId', (req, res) => {
    const mgClient = new MongoClient(uri, { useUnifiedTopology: true })
    const tripId = req.params.tripId
    const tripLocations = req.body.locations
    const tripImages = req.body.images
    processTripLocData(tripLocations)

    /**
     * TODO:
     * Just like create request, figure out which ones to move to permanent bucket.
     */
    /**
     * TODO:
     * Figure out which images are no longer referenced, and delete from S3.
     * (This is when user deletes the previously already uploaded image)
     */
    
    const updatedTrip = {
        title: req.body.title,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        details:req.body.details,
        locations: tripLocations,
        images: tripImages,
    }

    let existingImages = null
    mgClient.connect((error, client) => {
        if(error){
            throw error
        }
        client.db("trips").collection("tripInfo").findOne({"_id": ObjectId(tripId)}, {projection: {_id:0 , images:1}}, (error, result) => {
            if (error){
                return res.status(500).send(error)
            }
            console.log(result)
            if (result){
                existingImages = result.images
                let imagesToRemove = getImagesToRemove(existingImages,  tripImages)
                console.log(imagesToRemove)
            } else {
                // didn't find the trip
            }
        })

        //NOTE: putting result here doesn't work b/c making call to DB is asynchronous,
        // and needs to be inside that bracket

        client.db("trips").collection("tripInfo").updateOne({"_id": ObjectId(tripId)}, { $set: updatedTrip }, (error, result) => {
            if (error) {
                throw error
            }
            res.send(result)
        })
    })
})

const getImagesToRemove = (existingImages, updatedImages) => {
    let remove = []
    let updatedImagesUrlNames = updatedImages.map((img) => {
        return img.fileUrlName
    })
    existingImages.forEach((img) => {
        if (!updatedImagesUrlNames.includes(img.fileUrlName)){
            remove.push(img.fileUrlName)
        }
    })

    return remove
}

// Delete existing trip (DEL)
app.delete('/trips/:tripId', (req, res) => {
    const mgClient = new MongoClient(uri, { useUnifiedTopology: true })
    const tripId = req.params.tripId

    mgClient.connect((error, client) => {
        if(error){
            throw error
        }

        client.db("trips").collection("tripInfo").deleteOne({"_id": ObjectId(tripId)}, (error, result) => {
            if (error) {
                throw error
            }
            
            res.send(result)
        })
    })
})

// Generate S3 signed URL for photo upload
app.get('/get-signed-url', (req, res) => {
    //TODO: Can add some validation for allowed file type check here
    const fileType = req.query.type
    const urlFileName = new ObjectId().toString()

    genSignedUrlPut(urlFileName, fileType)
        .then(urlInfo => {
            res.send(urlInfo)
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
})

const processTripLocData = (tripLocations) => {
    tripLocations.forEach((loc) => {
        loc.latLng[0] = parseFloat(loc.latLng[0])
        loc.latLng[1] = parseFloat(loc.latLng[1])
    })
}