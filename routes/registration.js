
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { pool } = require('../config/dbConnection');
const { regSchema } = require('../middlewares/authSchema')
const bcrypt = require('bcrypt');
const flash = require('express-flash');

// routing using post to create a new user
router.post('/', async (req, res) => { 
    const errors = [];  
    try {
        const user = req.body;
        const confPassword = req.body;
        await regSchema.validateAsync(user,(err, result) => {
            if (err) {
                errors.push({ message: result.err });
            }
        }); 
        
        const  emailRow  =  await pool.query(`SELECT * FROM reg_users WHERE email= $1;`, [user.email]);
        if (emailRow.rows.length  !==  0) {
            errors.push({ message: "Email already registered." });
        // return  res.status(400).json({
        // Error: "Email already registered.",
        // });
        }
        const  phoneRow  =  await pool.query(`SELECT * FROM reg_users WHERE telephone= $1;`, [user.telephone]);
        if (phoneRow.rows.length  !==  0) {
            errors.push({ message: "Phone number already registered." });
        // return  res.status(400).json({
        // Error: "Phone number already registered.",
        // });
        }
        if (errors.length > 0) {
            res.render("registerPage", { errors});
          } else {

          const salt = await bcrypt.genSalt();
          const hashedPswd = await bcrypt.hash(user.password,salt);
        const insertQuery = await pool.query(
        `INSERT INTO reg_users (firstName,lastName,email,telephone,password) 
        VALUES('${user.firstName}','${user.lastName}','${user.email}', '${user.telephone}','${hashedPswd}') RETURNING * `)

        res.status(200).send({ message: `${user.firstName} ${user.lastName} added to database` });
        // req.flash("success_msg", "You are now registered. Please log in");
        // res.redirect('/users/loginPage');
        // res.status(200).send({ message: `${user.firstName} ${user.lastName} added to database` });
        // console.log('Registered successfully');
        // console.log(result); 
    }

    } catch (e) {
        console.log('Failed to register');
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});    
module.exports = router;