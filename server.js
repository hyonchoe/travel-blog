const express = require('express')
const cors = require('cors')
const moment = require('moment')
const { MongoClient } = require('mongodb')
const { response } = require('express')
const ObjectId = require("mongodb").ObjectID
const { genSignedUrlPut } = require('./S3SignedURLs')
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

// console.log that your server is up and running
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
            const pic1 = "https://travelblog-media.s3.us-east-2.amazonaws.com/upload_test2.jpg"
            const pic2 = "https://travelblog-media.s3.us-east-2.amazonaws.com/upload_test.jpg"
            const pictures = [pic1, pic2]
            result.forEach((trip) => {
                trip.pictures = pictures
            })
            console.log(result)
            /*
            array of objects
                [
                    {
                        _id, title, startDate, endDate, dtails, locations, PICTURES
                    }
                ]
            */

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
    const fileName = req.query.name
    const fileType = req.query.type
    
    console.log(fileName)
    console.log(fileType)

    genSignedUrlPut(fileName, fileType)
        .then(signedUrl => {
            res.send({signedUrl})
            console.log(signedUrl)
        })
        .catch(err => {
            res.send(err)
            console.log(err)
        })
})