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
                        imgInfo.S3Url = getImageS3URL(imgInfo.fileUrlName)
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
    tripLocations.forEach((loc) => {
        loc.latLng[0] = parseFloat(loc.latLng[0])
        loc.latLng[1] = parseFloat(loc.latLng[1])
    })
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
    const updatedTrip = {
        title: req.body.title,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        details:req.body.details,
    }

    mgClient.connect((error, client) => {
        if(error){
            throw error
        }

        client.db("trips").collection("tripInfo").updateOne({"_id": ObjectId(tripId)}, { $set: updatedTrip }, (error, result) => {
            if (error) {
                throw error
            }
            res.send(result)
        })
    })
})

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