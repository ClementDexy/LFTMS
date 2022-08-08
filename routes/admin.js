
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { pool } = require('../config/dbConnection');
const { adminSchema } = require('../middlewares/authSchema')
const bcrypt = require('bcrypt');
const { authStaff, authRole } = require('../middlewares/auth');
const { authToken } = require('../middlewares/adminAuth');

// routing using post to create a new staff
router.post('/',authStaff, authRole('admin'), async (req, res) => {     //authStaff, authRole('admin')
    try {
        const { name,email,phone,password,confPassword,role } = req.body;
        await adminSchema.validateAsync(req.body,(err, result) => {
            if (err) {
                res.status(400).send(err.message);
                // errors.push({ message: result.err });
            }
        }); 
        
        const  emailRow  =  await pool.query(`SELECT * FROM staff WHERE email= $1;`, [email]);
        if (emailRow.rows.length  !==  0) {
            // errors.push({ message: "Staff already registered." });
        return  res.status(400).json({
        Error: "Staff already registered.",
        });
        }
        const  phoneRow  =  await pool.query(`SELECT * FROM staff WHERE phone= $1;`, [phone]);
        if (phoneRow.rows.length  !==  0) {
            // errors.push({ message: "Phone number already registered." });
        return  res.status(400).json({
        Error: "Phone number already registered.",
        });
        }
      
        const salt = await bcrypt.genSalt();
        const hashedPswd = await bcrypt.hash(password,salt);
        const insertQuery = await pool.query(
        `INSERT INTO staff (name,email,phone,role,password) 
        VALUES('${name}','${email}','${phone}', '${role}','${hashedPswd}') RETURNING * `)

        res.status(200).send({ message: ` staff ${name}  added to database` });
        // res.redirect('/staff/signin');
        // res.status(200).send({ message: `${user.firstName} ${user.lastName} added to database` });
        // console.log('Registered successfully');
        // console.log(result); 

    } catch (e) {
        console.log('Failed to add staff');
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
}); 

router.get('/',authStaff, authRole('admin'), async (req, res) => {   
    try {
        const staff  =  await pool.query(`SELECT * FROM staff`);
        if (staff.rows != 0){
            res.status(200).send(staff.rows);
        } else {
            res.status(404).send('No staff found');
        }
        
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});

router.get('/:id',authStaff,authRole('admin'), async (req, res) => {   
    try {
        const idToReturn = parseInt(req.params.id)
        const staffToReturn  =  await pool.query(`SELECT * FROM staff WHERE staff_id = $1`, [idToReturn]);
        if(staffToReturn.rows != 0 ) {
            res.status(200).send(staffToReturn.rows);
            console.log(staffToReturn.rows);
        }
        else {
            res.status(404).send('The staff was not found.');
            console.log(staffToReturn.rows);
            console.log(idToReturn);
        }
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});

router.put('/:id',authStaff,authRole('admin'), async (req,res) =>{
    try {
        const { name,email,phone,password,role } = req.body;
        await adminSchema.validateAsync(req.body,(err, result) => {
            if (err) {
                res.status(400).send(err.message);
                // errors.push({ message: result.err });
            }
        }); 

        const salt = await bcrypt.genSalt();
        const hashedPswd = await bcrypt.hash(password,salt);

        const idToUpdate = parseInt(req.params.id)
        const staffToUpdate  =  await pool.query(`SELECT * FROM staff WHERE staff_id = $1`, [idToUpdate]);
        if(staffToUpdate.rows != 0 ) {
            
            await pool.query(`UPDATE staff SET 
            name = $1, email = $2, phone = $3, password = $4, role = $5 WHERE staff_id = $6`, 
            [ name,email,phone,hashedPswd,role, idToUpdate ] 
                ); 
            
            const updatedStaff  =  await pool.query(`SELECT * FROM staff WHERE staff_id = $1`, [idToUpdate]);
            res.status(200).send(updatedStaff.rows);
        }
        else {
            res.status(404).send('The staff was not found.');
        }
    } catch (error) {
        res.status(400).send('Error: ' + error.message);
        console.log('Error: ' + error.message);
    }
    
});

router.delete('/:id',authStaff,authRole('admin'), async (req, res) => {   
    try {
        const idToDelete = parseInt(req.params.id)
        const staffToDelete  =  await pool.query(`SELECT * FROM staff WHERE staff_id = $1`, [idToDelete]);
        if(staffToDelete.rows != 0 ) {

            const deletedStaff = await pool.query(`DELETE FROM staff WHERE staff_id = $1 RETURNING *`, 
            [idToDelete]);
            res.status(200).send(deletedStaff.rows);
            console.log(deletedStaff.rows);
        }
        else {
            res.status(404).send('The staff was not found.');
            console.log('The staff was not found.');
        }
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});

router.delete('/',authStaff,authRole('admin'), async (req, res) => {   
    try {
        const staffToDelete  =  await pool.query(`SELECT * FROM staff`);
        if(staffToDelete.rows != 0 ) {
            const deletedStaff = await pool.query(`DELETE FROM staff RETURNING *`);
            res.status(200).send(deletedStaff.rows);
            console.log(deletedStaff.rows);
        }
        else {
            res.status(404).send('No staffs were found to delete.');
            console.log('No staffs were found to delete.');
        }
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});

module.exports = router;