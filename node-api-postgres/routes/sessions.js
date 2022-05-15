const { request, response } = require('express')
const db = require('../db/postgres')

// USERS Functions
//
const getSessionsAll = (request, response) => {
    db.query('SELECT * FROM sessions', (err, results) => {
        if (err) {
            return response.status(404).send(err)
        }
        response.status(200).json(results.rows)
    })
}

const getSessionsCount = (request, response) => {
    db.query('SELECT COUNT(*) FROM sessions', (err, results) => {
        if (err) {
            return response.status(404).send(err)
        }
        response.status(200).json(results.rows)
    })
}

// Create user, userinfo and preference all at once (maybe stored procedure)
const createSession = (request, response) => {
    const session = request.params.sessionid

    db.query('INSERT INTO sessions(session, timecreated) VALUES ($1, CURRENT_TIMESTAMP)', 
        [session], 
        (err, results) => {
            if (err) {
                return response.status(404).send(err)
            }
            response.status(201).send('Session added!')
        }
    )
}



module.exports = {
    getSessionsAll,
    getSessionsCount,
    createSession
}