const express = require('express');
const app = express(); 
const db = require('./db');
const port = process.env.PORT || 5940;
const cors = require('cors');
app.use(cors());    // enables you to use this api outside this file

app.get('/', (req,res) => {
    res.send('--> default route! not usable! go to /api/auth')
});

const AuthController = require('./controller/authController');
app.use('/api/auth',AuthController);    // all the path inside auth controller will look like /api/auth/myRoute1

// http:localhost:5000/api/auth
app.listen(port,() => {
    console.log(`listening on port ${port}`)
})
