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
    const session = request.params.session
    const heartrate = request.params.heartrate

    db.query('INSERT INTO heartrate(session, timecreated, heartrate) VALUES ($1, CURRENT_TIMESTAMP, $2)', 
        [session, heartrate], 
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