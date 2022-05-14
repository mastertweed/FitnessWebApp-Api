const db = require('../db/postgres')
const config = require('../config.json')
const jwt = require('jsonwebtoken');

// Move to Config File
const accessTokenSecret = 'youraccesstokensecret';
const refreshTokenSecret = 'SomethingSecretHere';
const refreshTokenLife = 'AnotherSecretHere';
const secret = 'SecretTextHere';

const tokenList = {}

// USERS Functions
//

// When user attempts to login
const loginAuth = (request, response) => {
    const postData = request.body

    const username = postData.username
    const password = postData.password

    db.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password], (err, results) => { // Query database for user that matches username and password
        if (err) {
            response.send('Username or password incorrect')
        } 

        if (results.rowCount == 0) {
            response.status(401).send('Username or password incorrect')
            
        } else {

            const accessToken = jwt.sign({ username: username }, config.accessTokenSecret, { expiresIn: '30m' }) // Create jwt token that expires in 30 mins
            const refreshToken = jwt.sign({ username: username }, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife})
    
            const res = {
                "accessToken": accessToken,
                "refreshToken": refreshToken
            }
    
            tokenList[refreshToken] = res
    
            response.status(200).json(res); // Send the token back to the user
        }
    })
}

const tokenRefresh = (request, response) => {
    const postData = request.body

    const username = postData.username
    const refreshToken = postData.refreshToken

    // if refresh token exists
    if((refreshToken) && (refreshToken in tokenList)) {

        const token = jwt.sign({username: username}, config.secret, { expiresIn: tokenLife})

        const res = {
            "accessToken": token,
        }

        // update the token in the list
        tokenList[postData.refreshToken].token = token

        response.status(200).json(res);        
    } else {
        res.status(404).send('Invalid request')
    }
}


// Authenticate user credentials
const authenticateUser = (request, response, next) => {
    const authHeader = request.headers.authorization;

    if (authHeader) { // If authorization header exists
        const token = authHeader.split(' ')[1];

        jwt.verify(token, config.accessTokenSecret, (err, username) => { // Verify token is correct
            if (err) {
                return response.status(403).send("User Authentication Failed"); // If token is not verified then return and send err message
            }

            request.username = username
            next() // Token verified, continue to next middleware
        })
    } else {
        response.status(401); // Authorization header does not exist
    }
};



module.exports = {
    loginAuth,
    tokenRefresh,
    authenticateUser
}