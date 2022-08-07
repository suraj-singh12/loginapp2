let mongoose = require('mongoose')
let dotenv = require('dotenv');
dotenv.config();

const localUrl = process.env.localUrl;
const liveUrl = process.env.liveUrl;
mongoose.connect(liveUrl)