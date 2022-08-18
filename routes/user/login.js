
const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const { pool } = require('../../config/dbConnection');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {

    const { email, password } = req.body;
    const secretKey = process.env.JWT_SECRET;
    try {
        const emailRow = await pool.query(`SELECT * FROM reg_users WHERE email= $1;`, [email])
        const user = emailRow.rows;
        if (user.length === 0) {
            return res.status(400).json({
            error: "User is not registered, Sign Up first",
            });
            // console.log("User is not registered, Sign Up first");
        }
        else {
        bcrypt.compare(password, user[0].password, (err, result) => { 
            if (err) {
            return res.status(500).json({
            error: "Server error",
            });
        } 
        else if (result === true) { 
            // req.session.userId = user[0].user_id;
            // req.session.firstName = user[0].firstname;

            const userToken = jwt.sign({ id: user[0].user_id, email: user[0].email }, secretKey, { expiresIn: '60m' });
            res.status(200).send({
            message: "Signed in successfully",
            token: userToken
            });

            // pool.query(`UPDATE reg_users SET userToken = $1 WHERE email = $2`, [userToken,email] );
        }
        else {
        
        if (result !== true)
        res.status(400).json({
        error: "Enter the correct password!",
        });
        console.log("Enter the correct password!");
        }
        })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
        error: "Database error occurred while signing in!",
        });
        };
    });

    module.exports = router;
