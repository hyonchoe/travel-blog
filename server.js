const express = require('express')
const moment = require('moment')
const { MongoClient } = require('mongodb')
const { response } = require('express')
const ObjectId = require("mongodb").ObjectID
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
            res.send(result)
        })
    })
})

// Create a trip (POST)
app.post('/trips', (req, res) => {
    const mgClient = new MongoClient(uri, { useUnifiedTopology: true })
    const newTrip = {
        title: req.body.title,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        details:req.body.details,
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
/*
// Delete existing trip (DEL)
app.delete('/trips/:tripId', (req, res) => {
    //req.params.userId
    res.send()
})
*/