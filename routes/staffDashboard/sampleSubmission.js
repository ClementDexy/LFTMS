
const { authStaff,authRole } = require('../../middlewares/adminAuth');
const express = require('express');
const router = express.Router();
const { pool } = require('../../config/dbConnection');
const jwt = require('jsonwebtoken');

router.post('/:id',authStaff,authRole('seniorEngineer'), async (req, res) => { 
    const requestId = parseInt(req.params.id);  
    try {
        const { sampleName,sampleSize,sampleSource,samplingDate,labLabelNo,siteLabelNo,
            sampleCondition,stdMethods,submitterName,submitterSignature,submittedDate,labTechnician,
            receiverName,receiverSignature,receivedDate } = req.body;

    const dataFromRequests = await pool.query(`SELECT * FROM requests WHERE request_id = $1`, [requestId]);

    const userId =  dataFromRequests.rows[0].user_id;
    const clientName =  dataFromRequests.rows[0].clientname;
    const clientTel = dataFromRequests.rows[0].clienttel;
    const projectName = dataFromRequests.rows[0].projectname;
    const paramsType = dataFromRequests.rows[0].paramstype;
    const clientAddress = dataFromRequests.rows[0].clientaddress;

    const dataFromStaff = await pool.query(`SELECT staff_id FROM staff WHERE role = 'labTechnician' AND name = $1`,[labTechnician]);
    const staff_id = dataFromStaff.rows[0].staff_id;
              
    await pool.query( `INSERT INTO sampleSubmission (user_id,sampleName,sampleSize,sampleSource,samplingDate,labLabelNo,
        siteLabelNo,sampleCondition,stdMethods,paramsTobeTested,labTechnician,staff_id,submitterName,submitterSignature,
        submittedDate,projectName,customerName,senderAddress,senderTel,receiverName,receiverSignature,
        receivedDate) VALUES($1, $2, $3,$4, $5, $6,$7, $8, $9,$10, $11, $12,$13, $14, $15,$16, $17, $18, $19, 
        $20, $21, $22) RETURNING * `, 

        [ userId,sampleName,sampleSize,sampleSource,samplingDate,labLabelNo,siteLabelNo,
        sampleCondition,stdMethods,paramsType,labTechnician,staff_id,submitterName,submitterSignature,submittedDate,projectName,clientName,
        clientAddress,clientTel,receiverName,receiverSignature,receivedDate ] 
        );

        res.status(200).send({ message: `The sample of ${ clientName } was successfully submitted` });
        // req.flash("success_msg", "Sample submitted successfully");
        // res.redirect('/users/dashboardPage');
        // res.status(200).send({ message: `${user.firstName} ${user.lastName} added to database` });
        // console.log('Registered successfully');
        // console.log(result);

    } catch (e) {
        console.log('Failed to submit sample');
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
}); 

router.get('/',authStaff,authRole('labTechnician'), async (req, res) => {   
    try {
        const secretKey = process.env.JWT_ADMIN_SECRET;
        const loggedTechnician = req.headers["authorization"];
    if (typeof loggedTechnician !== "undefined") {
        const bearerToken = loggedTechnician.split(" ")[1];
        req.token = bearerToken;
        jwt.verify(req.token, secretKey, async (err, decoded) => {
            if (err) {
                res.sendStatus(403);
            } else {
                const staff_id = decoded.id;
                const submittedSamples  =  await pool.query(`SELECT * FROM sampleSubmission WHERE staff_id = $1`,[staff_id]);
                if (submittedSamples.rows != 0){
                    res.status(200).send(submittedSamples.rows);
                } else {
                    res.status(404).send('No samples were submitted');
                    console.log(staff_id);
                }   
            }
        });
    }
    else {
        res.sendStatus(403);
    }
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});

router.get('/seniorEngineer',authStaff,authRole('seniorEngineer'), async (req, res) => {   
    try {
        const sampleToReturn  =  await pool.query(`SELECT * FROM sampleSubmission`);
        if(sampleToReturn.rows !== 0 ) {
            res.status(200).send(sampleToReturn.rows);
            console.log(sampleToReturn.rows);
        }
        else {
            res.status(404).send('No samples were submitted.');
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
        const dataFromStaff = await pool.query(`SELECT staff_id FROM staff WHERE role = 'labTechnician' AND name = $1`,[labTechnician]);
        const staff_id = dataFromStaff.rows[0].staff_id;
        if(sampleToUpdate.rows !== 0 ) {
            
            await pool.query(`UPDATE sampleSubmission SET 
            sampleName = $1, sampleSize = $2, sampleSource = $3, samplingDate = $4, labLabelNo = $5, siteLabelNo = $6,
            sampleCondition = $7, stdMethods = $8, submitterName = $9, submitterSignature = $10,
            submittedDate = $11, receiverName = $12, receiverSignature = $13, receivedDate = $14,labTechnician = $15,
            staff_id = $16 WHERE sample_id = $17`, [sampleName,sampleSize,sampleSource,samplingDate,labLabelNo,siteLabelNo,
                sampleCondition,stdMethods,submitterName,submitterSignature,submittedDate,
                receiverName,receiverSignature,receivedDate,labTechnician,staff_id,idToUpdate] 
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