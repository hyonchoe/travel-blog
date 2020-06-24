const express = require('express')
const moment = require('moment')

const app = express()
const port = process.env.PORT || 5000

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`))

const now = moment()
const past = moment().subtract(10, 'days')
const existingTrips = [
    {
        title: 'Barcelona',
        startDate: past,
        endDate: now,
        details: 'IT WAS REALLY FUNNNN',
    },
    {
        title: 'New York City',
        startDate: past,
        endDate: now,
        details: 'IT WAS REALLY EXICITINGGGG',
    },
    {
        title: 'Miami',
        startDate: past,
        endDate: now,
        details: 'IT WAS REALLY COOLLLLLL',
    },
]
app.get('/trips', (req, res) => {
    res.send({ trips: existingTrips })
})

