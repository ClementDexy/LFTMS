
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { pool } = require('../../../config/dbConnection');
const { resetPasswordSchema } = require('../../../middlewares/authSchema')

const resetSecret = process.env.RESET_SECRET;

router.patch('/:token', async (req, res) => {
    // Get the token from params
    const resetToken = req.params.token;
    const {newPassword,confPassword} = req.body
    try {  
    if(resetToken !== undefined) {
        jwt.verify(resetToken, resetSecret, (error, decodedToken) => {
             if(error) {
               return res.status(400).json({ message: 'Incorrect token or expired' })
             }
             console.log(decodedToken.email);
        })
        
      } else {
          return res.status(400).json({ message: 'No token found' })
      }
      const  user  =  await pool.query(`SELECT * FROM staff WHERE resetPassword= $1;`, [resetToken]);

      if(user.rows.length  ===  0) {
        return res.status(400).json({ message: 'We could not find a match for this link' });
      } else if(newPassword !== confPassword) {
        return res.status(400).json({ message: 'The Entered passwords do not match' });
      }

      await resetPasswordSchema.validateAsync(req.body,(err, result) => {
        if (err) {
          // return res.status(400).json({ error: err.message, });
          console.error(err);
        }
    }); 
        const salt = await bcrypt.genSalt();
        const hashedPswd = await bcrypt.hash(newPassword,salt);
      await pool.query(`UPDATE staff SET password = $1, resetPassword = NULL WHERE resetPassword = $2`, [hashedPswd,resetToken] );
      res.status(200).json({ message: 'Password updated' });
    } catch (error) {
      res.status(500).json({ 
        error: error.message,
    });
    console.log(error);
    };
  });

  module.exports = router;