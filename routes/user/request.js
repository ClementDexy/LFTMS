
const express = require('express');
const router = express.Router();
const { pool } = require('../../config/dbConnection');
const authUser = require('../../middlewares/userAuth');

router.post('/:id',authUser, async (req, res) => {   
    const user_id = req.params.id;
    try {
        const { clientAddress,companyName,companyAddress,companyTel,projectName,projectLocation,testType,
            paramsType,customerCategory } = req.body;

    const dataFromRegUsers = await pool.query(`SELECT user_id,firstName,lastName,telephone FROM reg_users WHERE user_id = $1`, 
    [user_id]);

    const userId =  dataFromRegUsers.rows[0].user_id;
    const clientName =  dataFromRegUsers.rows[0].firstname + ' ' + dataFromRegUsers.rows[0].lastname;
    const clientTel = dataFromRegUsers.rows[0].telephone;

    console.log(userId);
            
            await pool.query(
        `INSERT INTO requests (user_id,clientName,clientAddress,clientTel,companyName,companyAddress,companyTel,
            projectName,projectLocation,testType,paramsType,customerCategory) 
        VALUES($1, $2, $3,$4, $5, $6,$7, $8, $9,$10, $11, $12) RETURNING * `, 
        [userId,clientName,clientAddress,clientTel,companyName,companyAddress,companyTel,projectName,projectLocation,testType,paramsType,
            customerCategory] 
            );

        res.status(200).send({ message: ` request of ${ clientName } was successfully submitted` });
        // req.flash("success_msg", "Sample submitted successfully");
    } catch (e) {
        console.log('Failed to submit your request');
        res.status(400).json('Failed to submit your request');
        console.log('Error: ' + e.message);
    }
}); 

router.get('/:id',authUser, async (req, res) => {   
    try {
        const idToReturn = parseInt(req.params.id)
        const requestToReturn  =  await pool.query(`SELECT * FROM requests WHERE user_id = $1
        ORDER BY submittedDate`, [idToReturn]);
        if(requestToReturn.rows != 0 ) {
            res.status(200).send(requestToReturn.rows);
            // console.log(requestToReturn.rows);
        }
        else {
            res.status(404).send('The request submission was not found.');
            // console.log(sampleToReturn.rows);
            // console.log(idToReturn);
        }
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});

router.put('/:id',authUser, async (req,res) =>{
    try {
        const {clientAddress,companyName,companyAddress,companyTel,projectName,projectLocation,testType,
            paramsType,customerCategory } = req.body;

        const idToUpdate = parseInt(req.params.id)
        const requestToUpdate  =  await pool.query(`SELECT * FROM requests WHERE request_id = $1`, [idToUpdate]);
        if(requestToUpdate.rows != 0 ) {
            
            await pool.query(`UPDATE requests SET 
            clientAddress = $1, companyName = $2, companyAddress = $3, companyTel = $4, projectName = $5,projectLocation = $6, testType = $7,
            paramsType = $8, customerCategory = $9 WHERE request_id = $10`, 
            [clientAddress,companyName,companyAddress,companyTel,projectName,projectLocation,testType,
                paramsType,customerCategory,idToUpdate] 
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

router.delete('/:id',authUser, async (req, res) => {   
    try {
        const idToDelete = parseInt(req.params.id)
        const requestToDelete  =  await pool.query(`SELECT * FROM requests WHERE request_id = $1`, [idToDelete]);
        if(requestToDelete.rows !== 0 ) {
            const deletedRequest = await pool.query(`DELETE FROM requests WHERE request_id = $1 RETURNING *`, 
            [idToDelete]);
            res.status(200).send(deletedRequest.rows);
            console.log(deletedRequest.rows);
        }
        else {
            res.status(404).send('The request was not found.');
            console.log('The request was not found.');
        }
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});

module.exports = router;