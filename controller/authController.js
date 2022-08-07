const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const User = require('../model/userModel');


router.use(bodyParser.urlencoded({extended:true}))
router.use(bodyParser.json());

// use postman for api testing / making calls
///get all users
// http://localhost:5000/api/auth/users (because the route defined is /api/auth in app.js)
// https://loginappfkart.herokuapp.com/api/auth/users
router.get('/users',(req,res) => {
    User.find({},(err,data) => {
        if(err) throw err;
        res.send(data)
    })
})

//register User 
// use the format given in ../model/userModel to insert data 
// {
//      name:String,
//      email:String,
//      password:String,
//      phone:Number,
//      address:String,
//      role:String
// }
// Example :
// {
//     "name":"alpha1",
//     "email":"alpha@alpha.com",
//     "password":"passWORD",
//     "phone":51513513513,
//     "address":"xyz location",
//     "role":"user"
// }
// http://localhost:5000/api/auth/register
// https://loginappfkart.herokuapp.com/api/auth/register
router.post('/register',(req,res) => {
    User.findOne({email:req.body.email}, (err,user) => {
        if(!user)  {        // if user does not exists, only then register
            //encrypt Password
            let hashPassword = bcrypt.hashSync(req.body.password,8)
            User.create({
                name:req.body.name,
                email:req.body.email,
                password:hashPassword,
                phone:req.body.phone,
                address:req.body.address?req.body.address:'NA',
                role:req.body.role?req.body.role:'User'
            },(err,data) => {
                if(err) return res.status(500).send('Error While Register');
                res.status(200).send('Registration Successful')
            })
        } else {
            res.status(500).send('Error, User Already Exists!');
        }
    });
})

///login Users
/**
 * provide : 
 * {"email": "user@example.com", "password":"userPassword"}
 * in body, then you will get a token in response,
 * use it by providing that as a header with key x-acess-token and value as the given token
 * to get user info using the api/auth/userInfo route
 */
// http://localhost:5000/api/auth/login
// https://loginappfkart.herokuapp.com/api/auth/login
router.post('/login',(req,res) => {
    User.findOne({email:req.body.email},(err,user) => {
        if(err) return res.send({auth:false,token:'Error While Login'})
        if(!user) return res.send({auth:false,token:'No User Found Register First'})
        else{
            const passIsValid = bcrypt.compareSync(req.body.password,user.password)
            if(!passIsValid) return res.send({auth:false,token:'Invalid Password'})
            // in case email and password both good than generate token
            let token = jwt.sign({id:user._id},config.secret,{expiresIn:86400}) // 24 hours
            return res.send({auth:true,token:token})
        }
    })
})
// provide here the token that you get from login api to read user info.
// token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOWNiZDFhMDE5MjhhYjA1ZjE2MTIzYiIsImlhdCI6MTY1NDQzOTI1NiwiZXhwIjoxNjU0NTI1NjU2fQ.QfDRGoR8iuluFBvMutoR2KeZcPGKcBYs-gl61_x6s50
// token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOWNiYWFjNGY5ZWZiMDk2MWVjMDdhNiIsImlhdCI6MTY1NDQzODc0OSwiZXhwIjoxNjU0NTI1MTQ5fQ.3Wc1FgfUTToV1GdWSLzUNYr75Ut6S4Cka7BDbtYrLnk
// set x-access-token and give the token returned by api/auth/login route and then get api/auth/userInfo
//userinfo
// http://localhost:5000/api/auth/userInfo
// https://loginappfkart.herokuapp.com/api/auth/userInfo (use postman to pass x-access-token as browser cannot pass it)
router.get('/userInfo',(req,res) => {
    let token = req.headers['x-access-token'];
    if(!token) res.send({auth:false,token:'No Token Provided'})
    // jwt verify token
    jwt.verify(token,config.secret,(err,user) => {
        if(err) return res.send({auth:false,token:'Invalid Token'})
        User.findById(user.id,(err,result) => {
            res.send(result)
        })
    })
})

// delete all registered users (only for Developer)
router.delete('/deleteAll', (req, res) => {
    User.deleteMany({}, (err, res) => {
        if(err) throw err;
        if(Number(result.deletedCount) === 0) {
            res.status(500).send('No records exist!')
        } else {
            res.status(200).send(`Erased all ${result.deletedCount} records`)
        }
    })
})

module.exports = router

