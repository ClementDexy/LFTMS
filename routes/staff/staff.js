
const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const { pool } = require('../../config/dbConnection');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {

    const { email, password } = req.body;
    const secretKey = process.env.JWT_ADMIN_SECRET;
    try {
        const staff = await pool.query(`SELECT * FROM staff WHERE email= $1;`, [email])
        const role = staff.rows[0].role;

        if (staff.rows.length === 0) {
            res.status(401).json({
            error: "Access denied.",
            });
            console.log("Access denied.");
        }
        else {
        bcrypt.compare(password, staff.rows[0].password, (err, result) => { 
            if (err) {
            res.status(401).json({
            error: "Access denied.",
            });
        } 
        else if (result === true) { 
            const staffToken = jwt.sign({ id: staff.rows[0].staff_id, role: staff.rows[0].role }, secretKey, { expiresIn: '60m' });
           
            if(role === 'labTechnician'){
            res.status(200).json({
                message: `Welcome labTechnician, ${staff.rows[0].name}`,
                token: staffToken
                });
                console.log("Signed in successfully");
            }
            else if (role === 'seniorEngineer'){
                    
            // res.redirect('dashboardPage.ejs')
            res.status(200).json({
                message: `Welcome seniorEngineer, ${staff.rows[0].name}`,
                token: staffToken
                });
                console.log("Signed in successfully");
            }
            else if(role === 'RTDAManager'){
                        
            // res.redirect('dashboardPage.ejs')
            res.status(200).json({
                message: `Welcome RTDAManager, ${staff.rows[0].name}`,
                token: token
                });
                console.log("Signed in successfully");
            }

            else if (role === 'labDirector'){
                    
                // res.redirect('dashboardPage.ejs')
                res.status(200).json({
                    message: `Welcome labDirector, ${staff.rows[0].name}`,
                    token: staffToken
                    });
                    console.log("Signed in successfully");
                }

            else if(role === 'admin'){
                res.status(200).json({
                    message: `Welcome Admin, ${staff.rows[0].name}`,
                    token: staffToken
                    });
                    console.log("Signed in successfully");
                    // console.log(req.session);
                }
            else{
                res.status(401).json({
                    message: "You are not authorized",
                    // token: token
                    });
                    console.log("You are not authorized");
            }

        }
        else {

            if (result !== true)
            res.status(400).json({
            error: "Sorry, you are not allowed",
            });
            console.log("Sorry, you are not allowed");
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
