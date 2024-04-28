const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
require('dotenv').config();

const JWT_REFRESH_SECRET = process.env.JWTRefreshToken;
const JWT_ACCESS_TOKEN_SECRET = process.env.JWTAcessToken;
const ACESS_TOKEN_EXPIRY_TIME = process.env.ExpiryTimeAccessToken;
const REFRESH_TOKEN_EXPIRY_TIME = process.env.ExpiryTimeRefreshToken;

const refreshTokens = [];

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if user exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create new user
        const newUser = new User({
            name,
            email,
            password,
        });
        // Hash password
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        // Save user
        await newUser.save();
        // Create token
        const _user = {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        }
        const token = generateAccessToken(_user);
        const refreshToken = generateRefreshToken(_user);
        // Send token
        res.status(200).json({
            token,
            refreshToken,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }
        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const _user = {
            id: user._id,
            name: user.name,
            email: user.email,
        }
        // Create access and refresh token and push refresh token to array
        const token = generateAccessToken(_user);
        const refreshToken = generateRefreshToken(_user);
        refreshTokens.push(refreshToken);

        // Send token
        res.status(200).json({
            refreshToken,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// Get new access token
router.post('/getAccessToken', Authenticate, (req, res) => {
    try {
        const userData = req.user;
        const JWT_TOKEN = generateAccessToken({
            id: userData.id,
            name: userData.name,
            email: userData.email,
        });
        res.status(200).json({ token: JWT_TOKEN });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// verify jwt signature
function Authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // check if token is null
    if (token == null) return res.sendStatus(401).json({ message: 'Unauthorized! No Token Found' });

    // verify token 
    try {
        const user = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ message: err.message });
    }
}

// Generate jwt token
function generateAccessToken(user) {
    return jwt.sign(
        user,
        JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: ACESS_TOKEN_EXPIRY_TIME }
    );
}

// generate refresh token
function generateRefreshToken(user) {
    return jwt.sign(
        user,
        JWT_REFRESH_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY_TIME }
    );
}

module.exports = {router,Authenticate:Authenticate};
