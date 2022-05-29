require('dotenv').config();
const express = require('express');
const app = express();
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const User = require('./models/user');
const {verify, sign} = require('jsonwebtoken');
const bycrypt = require('bcryptjs');
const checkAuth = require('./middlewares/checkAuth');
let {PythonShell} = require('python-shell')
const bcrypt = require('bcryptjs');

// // Spawning Python server (at port 6000) to get face_encogings from images
// let options = {
//     pythonPath: './python_server/env/bin/python3',
//     scriptPath: './python_server/'
// }
// PythonShell.run('main.py', options, function (err) {
//     if (err) throw err;
//     console.log('Running Python server');
// })


const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/graphql-demo';
mongoose.connect(dbUrl);
mongoose.connection.once('open', () => {
    console.log('Connected to database');
});

app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: "http://localhost:3001",
    // allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    // methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
}));

// Needed to be able to read body data
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

app.get('/', (req, res) => {
    res.send('Hello GQL!');
})

// User Login Route
app.post('/login', async (req, res) => {
    if(!req?.body?.username || !req?.body?.password) {
        return res.status(400).send('Email or password missing');
    }
    const {username, password} = req.body;
    User.findOne({username}, async (err, user) => {
        if(err) {
            return res.status(500).json({message: 'Server error'});
        }
        if(!user) {
            return res.status(400).json({message: 'User not found'});
        }
        const isValid = await bycrypt.compare(password, user.password);
        if(!isValid) {
            return res.status(401).json({message: 'Invalid password'});
        }
        console.log(user)
        const token = sign({id: user._id, username: user.username}, process.env.JWT_SECRET);
        res.cookie('jwt', token, {httpOnly: true});
        res.cookie('userId', user._id);
        console.log(req.cookies);
        return res.status(200).json({message: 'Logged in successfully', jwt: token});
    })
})

// User Register Route
app.post('/register', async(req, res)=>{
    if(!req?.body?.username || !req?.body?.password) {
        return res.status(400).json({message: 'Please provide username and password'});
    }
    const {username, password} = req.body;
    User.findOne({username}, async(err, user) => {
        if(err) {
            return res.status(500).json({message: 'Server error'});
        }
        if(user) {
            return res.status(400).json({message: 'Username already exists'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword
        });
        await newUser.save();
        return res.status(200).json({message: 'User created successfully! You can now log in.'});
    })
})

app.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.clearCookie('userId');
    return res.json({message: 'Logged out'});
})

// app.use('/graphql', checkAuth, graphqlHTTP(async (req, res, graphQLParams)=>({
app.use('/graphql', graphqlHTTP(async (req, res, context)=>({
    schema,
    graphiql: true,
    context: {
        req,
        res,
        context: context
    }
})));

app.listen(4000, () => {
    console.log('listening on port 4000');
})