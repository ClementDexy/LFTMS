
const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const { pool } = require('../config/dbConnection');
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

async function authToken() {
    try {
        return async (req, res, next) => {
            const token = req.headers.Authorization.split(' ')[1]; 
    //Authorization: 'Bearer TOKEN'
        if(!token)
        {
            res.status(200).json(
                {
                    success: false, 
                    message: "Error!Token was not provided."});
        }
        else{
            //Decoding the token
                jwt.verify(token, secretKey, (error, decodedToken) => {
                    if(error) {
                      return res.status(400).json({ message: 'Incorrect token or expired' })
                    }
                    next();
                    console.log(decodedToken.email);
                    return res.status(200).send(decodedToken);
                    
               })
        }
          }
    
    } catch (error) {
        res.status(401).send('Invalid session token: ' + error.message)
    }
   

}
    module.exports = {authToken}
    
    
