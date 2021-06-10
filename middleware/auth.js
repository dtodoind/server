const jwt = require('jsonwebtoken');
require('dotenv').config()

function auth(req, res, next) {
    const token = req.header('x-auth-token')

    // Check for token
    if(!token) {
        console.log('No Token, Authorization denied')
    }

    try {
        // Verify Token
        const decoded = jwt.verify(token, process.env.SECRET_JWT)
        // Add user form payload
        req.result = decoded
        next()
    } catch (error) {
        res.send(false)
    }

}

module.exports = auth;