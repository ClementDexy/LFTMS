
const { authRole, authStaff } = require('../../middlewares/auth');
const express = require('express');
const router = express.Router();
const { pool } = require('../../config/dbConnection');

router.get('/userRequests', authStaff, authRole('seniorEngineer'), async (req, res) => {   
    try {
        const submittedRequests  =  await pool.query(`SELECT * FROM requests`);
        if (submittedRequests.rows != 0){
            res.status(200).send(submittedRequests.rows);
            console.log(req.session.userId);
        } else {
            res.status(404).send('No requests were submitted');
        }
        
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});

router.patch('/userRequests/approve/:id', authStaff, authRole('seniorEngineer'), async (req, res) => {
    try {
        const { approved } = req.body;

        const idToUpdate = parseInt(req.params.id)
        const requestToUpdate  =  await pool.query(`SELECT * FROM requests WHERE request_id = $1`, [idToUpdate]);
        if(requestToUpdate.rows != 0 ) {
            
            await pool.query(`UPDATE requests SET approved = $1 WHERE request_id = $2`, 
            [approved,idToUpdate] 
                ); 
            
            const updatedRequest  =  await pool.query(`SELECT * FROM requests WHERE request_id = $1`, [idToUpdate]);
            res.status(200).send(updatedRequest.rows);
        }
        else {
            res.status(404).send('The request was not found.');
        }
    } catch (error) {
        res.status(400).send('Error: ' + error.message);
        console.log('Error: ' + error.message);
    }
 
});
