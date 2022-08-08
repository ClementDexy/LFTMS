
const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const { pool } = require('../config/dbConnection');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {

    const { email, password } = req.body;
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
            res.status(500).json({
            error: "Server error",
            });
        } 
        else if (result === true) { 
            req.session.staffRole = role;
            req.session.staffId = staff.rows[0].staff_id;
            
            // const staffToken = jwt.sign({ id: staff.rows[0].staff_id, email: staff.rows[0].email, 
            // role: staff.rows[0].role }, process.env.JWT_SECRET, { expiresIn: '60m' });
            // console.log(staffToken);

            if(role === 'labTechnician'){
            // res.redirect('dashboardPage.ejs')
            const assignedTechnician = pool.query(`SELECT * FROM sampleSubmission WHERE staff_id = $1`,[staff.rows[0].staff_id]);
            req.session.technician = assignedTechnician.rows[0].labTechnician;
            res.status(200).json({
                message: `Welcome ${staff.rows[0].name}`,
                // token: token
                });
                console.log("Signed in successfully");
            }
            else if (role === 'seniorEngineer'){
                    
            // res.redirect('dashboardPage.ejs')
            res.status(200).json({
                message: `Welcome ${staff.rows[0].name}`,
                // token: token
                });
                console.log("Signed in successfully");
            }
            else if(role === 'RTDAManager'){
                        
            // res.redirect('dashboardPage.ejs')
            res.status(200).json({
                message: `Welcome ${staff.rows[0].name}`,
                // token: token
                });
                console.log("Signed in successfully");
                console.log(req.session);
            }

            else if (role === 'labDirector'){
                    
                // res.redirect('dashboardPage.ejs')
                res.status(200).json({
                    message: `Welcome ${staff.rows[0].name}`,
                    // token: token
                    });
                    console.log("Signed in successfully");
                }

            else if(role === 'admin'){
                        
                // res.redirect('/staff/registration')
            //     jwt.verify(staffToken, process.env.JWT_SECRET, (error, decodedToken) => {
            //         if(error) {
            //           return res.status(400).json({ message: 'Incorrect token or expired' })
            //         }
            //         console.log(decodedToken.role);
            //    })
                res.status(200).json({
                    message: `Welcome ${staff.rows[0].name}`,
                    // token: token
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
