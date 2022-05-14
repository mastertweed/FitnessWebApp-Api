const { request, response } = require('express')
const db = require('../db/postgres')

// USERS Functions
//
const getHeartrateAll = (request, response) => {
    db.query('SELECT * FROM heartrate', (err, results) => {
        if (err) {
            return response.status(404).send(err)
        }
        response.status(200).json(results.rows)
    })
}

const getHeartrateBySession = (request, response) => {
    const session = request.params.session

    db.query('SELECT * FROM heartrate WHERE session = $1', [session], (err, results) => {
        if (err) {
            return response.status(404).send(err)
        }
        response.status(200).json(results.rows)
    })
}

// Create user, userinfo and preference all at once (maybe stored procedure)
const createHeartrate = (request, response) => {
    const { session, timecreated, heartrate } = request.body

    db.query('INSERT INTO heartrate(session, timecreated, heartrate) VALUES ($1, timecreated, $3)', 
        [session, timecreated, heartrate], 
        (err, results) => {
            if (err) {
                return response.status(404).send(err)
            }
            response.status(201).send('Heartrate added!')
        }
    )
}



module.exports = {
    getHeartrateAll,
    getHeartrateBySession,
    createHeartrate
}