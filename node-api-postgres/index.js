const express = require('express')
const app = express()

const authenticationRoute = require('./routes/authentication')
const heartrateRoute = require('./routes/heartrate')
const sessionsRoute = require('./routes/sessions')

// Set correct port based on enviorment
const normalizePort = val => {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// Add headers for access
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Request-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

// Parsing middleware
app.use(express.json())
app.use(express.urlencoded());

// Checking nodejs server 
app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

// Attempt to refresh auth tokens
app.post('/token', authenticationRoute.tokenRefresh)

// Postgres
//
// Restricted (Authenticate user before allowing access)
app.post('/login', authenticationRoute.loginAuth)

// 
// Heartrate Table
//
app.get('/heartrate', heartrateRoute.getHeartrateAll)
app.get('/heartrate/:session', heartrateRoute.getHeartrateBySession)
app.get('/heartrate/:session/:heartrate', heartrateRoute.createHeartrate)

// 
// Sessions Table
//
app.get('/sessions', sessionsRoute.getSessionsAll)
app.get('/sessions/count', sessionsRoute.getSessionsCount)
app.get('/sessions/:sessionid', sessionsRoute.createSession)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
