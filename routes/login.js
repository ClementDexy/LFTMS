
const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const { pool } = require('../config/dbConnection');

router.post('/', async (req, res) => {

    const { email, password } = req.body;
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
            
            // res.redirect('dashboardPage.ejs')
            res.status(200).send({
            message: "Signed in successfully",
            // token: token
            });
            req.session.userId = user[0].user_id;
            req.session.firstName = user[0].firstname;
            // res.redirect('/users/dashboard');
            // console.log(req.session.userId);
            // console.log("Signed in successfully");
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
