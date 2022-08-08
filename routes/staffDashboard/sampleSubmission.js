
const { authStaff,authRole } = require('../../middlewares/auth');
const express = require('express');
const router = express.Router();
const { pool } = require('../../config/dbConnection');

router.post('/:id',authStaff,authRole('seniorEngineer'), async (req, res) => { 
    const loggedUserId = parseInt(req.params.id);  
    try {
        const { sampleName,sampleSize,sampleSource,samplingDate,labLabelNo,siteLabelNo,
            sampleCondition,stdMethods,submitterName,submitterSignature,submittedDate,labTechnician,
            receiverName,receiverSignature,receivedDate } = req.body;

    const dataFromRegUsers = await pool.query(`SELECT user_id,firstName,lastName,telephone FROM reg_users WHERE user_id = $1`, 
    [loggedUserId]);

    const userId =  dataFromRegUsers.rows[0].user_id;
    const clientName =  dataFromRegUsers.rows[0].firstname + ' ' + dataFromRegUsers.rows[0].lastname;
    const clientTel = dataFromRegUsers.rows[0].telephone;
    
    const dataFromRequests = await pool.query(`SELECT * FROM requests WHERE user_id = $1`, [userId]);
    const user_id = dataFromRequests.rows[0].user_id;
    const projectName = dataFromRequests.rows[0].projectname;
    const paramsType = dataFromRequests.rows[0].paramstype;
    const clientAddress = dataFromRequests.rows[0].clientaddress;

    const staff = await pool.query(`SELECT staff_id FROM staff WHERE labTechnician = $1`, [labTechnician]);
    const staff_id = staff.rows[0].staff_id;

    if(userId || user_id != null) {

            console.log(userId);
                    
            await pool.query(
        `INSERT INTO sampleSubmission (user_id,sampleName,sampleSize,sampleSource,samplingDate,labLabelNo,siteLabelNo,
            sampleCondition,stdMethods,paramsTobeTested,labTechnician,submitterName,submitterSignature,submittedDate,projectName,customerName,
            senderAddress,senderTel,labTechnician,receiverName,receiverSignature,receivedDate,staff_id) 
        VALUES($1, $2, $3,$4, $5, $6,$7, $8, $9,$10, $11, $12,$13, $14, $15,$16, $17, $18, $19, $20, $21, $22) RETURNING * `, 
        [userId,sampleName,sampleSize,sampleSource,samplingDate,labLabelNo,siteLabelNo,
            sampleCondition,stdMethods,paramsType,labTechnician,submitterName,submitterSignature,submittedDate,projectName,clientName,
            clientAddress,clientTel,receiverName,receiverSignature,receivedDate,staff_id] 
            );

        res.status(200).send({ message: `The sample of ${ clientName } was successfully submitted` });
        // req.flash("success_msg", "Sample submitted successfully");
        // res.redirect('/users/dashboardPage');
        // res.status(200).send({ message: `${user.firstName} ${user.lastName} added to database` });
        // console.log('Registered successfully');
        // console.log(result);
    }
    else{
        res.status(200).send({ message: `No request was made` });
    }


    } catch (e) {
        console.log('Failed to submit sample');
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
}); 

router.get('/',authStaff,authRole('labTechnician'), async (req, res) => {   
    try {
        const submittedSamples  =  await pool.query(`SELECT * FROM sampleSubmission WHERE labTechnician = $1`,[req.session.technician]);
        if (submittedSamples.rows != 0){
            res.status(200).send(submittedSamples.rows);
        } else {
            res.status(404).send('No samples were submitted');
        }
        
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});

router.get('/:id',authStaff,authRole('seniorEngineer'), async (req, res) => {   
    try {
        const idToReturn = parseInt(req.params.id)
        const sampleToReturn  =  await pool.query(`SELECT * FROM sampleSubmission WHERE sample_id = $1`, [idToReturn]);
        if(sampleToReturn.rows != 0 ) {
            res.status(200).send(sampleToReturn.rows);
            console.log(sampleToReturn.rows);
        }
        else {
            res.status(404).send('The sample submission was not found.');
            console.log(sampleToReturn.rows);
            console.log(idToReturn);
        }
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});

router.put('/:id',authStaff,authRole('seniorEngineer'), async (req,res) =>{
    try {
        const {sampleName,sampleSize,sampleSource,samplingDate,labLabelNo,siteLabelNo,
            sampleCondition,stdMethods,submitterName,submitterSignature,submittedDate,labTechnician,
            receiverName,receiverSignature,receivedDate } = req.body;

        const idToUpdate = parseInt(req.params.id)
        const sampleToUpdate  =  await pool.query(`SELECT * FROM sampleSubmission WHERE sample_id = $1`, [idToUpdate]);
        if(sampleToUpdate.rows != 0 ) {
            
            await pool.query(`UPDATE sampleSubmission SET 
            sampleName = $1, sampleSize = $2, sampleSource = $3, samplingDate = $4, labLabelNo = $5, siteLabelNo = $6,
            sampleCondition = $7, stdMethods = $8, submitterName = $9, submitterSignature = $10,
            submittedDate = $11, receiverName = $12, receiverSignature = $13, receivedDate = $14,labTechnician = $15
            WHERE sample_id = $16`, [sampleName,sampleSize,sampleSource,samplingDate,labLabelNo,siteLabelNo,
                sampleCondition,stdMethods,submitterName,submitterSignature,submittedDate,
                receiverName,receiverSignature,receivedDate,labTechnician,idToUpdate] 
                ); 
            
            const updatedSample  =  await pool.query(`SELECT * FROM sampleSubmission WHERE sample_id = $1`, [idToUpdate]);
            res.status(200).send(updatedSample.rows);
        }
        else {
            res.status(404).send('The sample was not found.');
        }
    } catch (error) {
        res.status(400).send('Error: ' + error.message);
        console.log('Error: ' + error.message);
    }
    
});

router.delete('/:id',authStaff,authRole('seniorEngineer'), async (req, res) => {   
    try {
        const idToDelete = parseInt(req.params.id)
        const sampleToDelete  =  await pool.query(`SELECT * FROM sampleSubmission WHERE sample_id = $1`, [idToDelete]);
        if(sampleToDelete.rows != 0 ) {

            const deletedSample = await pool.query(`DELETE FROM sampleSubmission WHERE sample_id = $1 RETURNING *`, 
            [idToDelete]);
            res.status(200).send(deletedSample.rows);
            console.log(deletedSample.rows);
        }
        else {
            res.status(404).send('The sample was not found.');
            console.log('The sample was not found.');
        }
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});

router.delete('/',authStaff,authRole('seniorEngineer'), async (req, res) => {   
    try {
        const sampleToDelete  =  await pool.query(`SELECT * FROM sampleSubmission`);
        if(sampleToDelete.rows != 0 ) {
            const deletedSample = await pool.query(`DELETE FROM sampleSubmission RETURNING *`);
            res.status(200).send(deletedSample.rows);
            console.log(deletedSample.rows);
        }
        else {
            res.status(404).send('No samples were found to delete.');
            console.log('No samples were found to delete.');
        }
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});



module.exports = router;