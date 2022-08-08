const express = require('express');
const jwt = require('jsonwebtoken');
const { pool } = require('../../../config/dbConnection');
const mailgun = require("mailgun-js");
const DOMAIN = 'sandboxd425f760b6c148ecb51f59cd6103454b.mailgun.org';
const mg = mailgun({apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN});

const router = express.Router();
const resetSecret = process.env.RESET_SECRET;
const clientURL = process.env.CLIENT_URL;

router.patch('/', async (req, res) => {
    const { email } = req.body;
  
    try {
      const  user  =  await pool.query(`SELECT * FROM staff WHERE email= $1;`, [email]);
      if(user.rows.length  ===  0) {
        return res.status(404).json({ error: "Invalid email" });
      } else {
        const resetToken = jwt.sign({ id: user.rows[0].user_id, email: user.rows[0].email }, resetSecret, { expiresIn: '60m' });
        await pool.query(`UPDATE staff SET resetPassword = $1 WHERE email = $2`, [ resetToken,email] );
        await sendEmail(email, resetToken);
        res.status(200).json({ message: "Email sent, Check your email"} );
      }
    } catch(error) {
      res.status(500).json({ message: error.message });
    }
  })

  function sendEmail(user, token) {
    const msg = {
      from: "noreply@rtda.com",
      to: user,
      subject: "Reset password requested",
      html: `
      <h3>Reset your Password with the link below</h3></br>
       <a href="${clientURL}/reset-password/${token}">${clientURL}/reset-password/${token}</a>
     `
    };
    return mg.messages().send(msg, function (error, body) {
      if(error) {
        console.error(error);
      } else {
        console.log("Email sent");
        console.log(body);
      }
    });
  }

  module.exports = router;

  