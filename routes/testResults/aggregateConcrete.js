
const express = require('express');
const router = express.Router();
const { authUser, authRole, authStaff } = require('../middlewares/auth');
const { pool } = require('../config/dbConnection');


router.post('/:id',authUser, async (req, res) => { 
    const sampleId = parseInt(req.params.id);  
    try {
        const { 
            equipmentID,	
            testStartedOn,
            testCompletedOn,
            testCategory,
            testName,
            massBefore,
            massAfter,
            sieveOpeningSize,
            retainedOnEachSieve,
            cumulativeMaterialMassRetained,
            cumulativePercentRetained,
            totalPassingSieve,
            sample,
            initial_dry_mass_aggregates,
            mass_aggregates_retained_2_36mm_sieve,
            mass_aggregates_passing_2_36mm_sieve,
            mass_abrasive_charges,
            aggregate_crushing_value,
            mass_aggregates_retained_1_7mm_sieve,
            mass_aggregates_passing_1_7mm_sieve,
            steel_spheres_number,
            los_angeles_value,
            initial_mass,
            flocculat_height_h1,
            sediment_height_h2,
            sand_equivalent_100xh2_h1,
            average,
            age,	
            weight,	
            load_kn,	
            section,
            strength
             } = req.body;

            const sampleData = await pool.query(`SELECT * FROM sampleSubmission WHERE sample_id = $1`, [sampleId]);

            const client_id = sampleData.rows[0].user_id;
            const sample_id = sampleData.rows[0].sample_id;
            const sampleName = sampleData.rows[0].samplename;
            const labRefNo = sampleData.rows[0].lablabelno
            const stdMethod = sampleData.rows[0].stdmethods
            const labTechnician = sampleData.rows[0].labtechnician
        
            const clientName = sampleData.rows[0].customername;
            const clientAddress = sampleData.rows[0].senderaddress;
            const clientTel = sampleData.rows[0].sendertel;
            const projectName = sampleData.rows[0].projectname;
            const siteRefNo = sampleData.rows[0].sitelabelno
            const sampleSize = sampleData.rows[0].samplesize;
            const sampleSource = sampleData.rows[0].samplesource
            const samplingDate = sampleData.rows[0].samplingdate
            const receivedDate = sampleData.rows[0].receiveddate
            const samplingPerson = sampleData.rows[0].receivername

    console.log(samplingPerson);
            await pool.query(
        `INSERT INTO aggregateTestResults (client_id,sample_id,sampleName,labRefNo,stdMethod,equipmentID,	
            testStartedOn,
            testCompletedOn,
            testCategory,
            testName,
            labTechnician,
            massBefore,
            massAfter,
            sieveOpeningSize,
            retainedOnEachSieve,
            cumulativeMaterialMassRetained,
            cumulativePercentRetained,
            totalPassingSieve,
            sample,
            initial_dry_mass_aggregates,
            mass_aggregates_retained_2_36mm_sieve,
            mass_aggregates_passing_2_36mm_sieve,
            mass_abrasive_charges,
            aggregate_crushing_value,
            mass_aggregates_retained_1_7mm_sieve,
            mass_aggregates_passing_1_7mm_sieve,
            steel_spheres_number,
            los_angeles_value,
            initial_mass,
            flocculat_height_h1,
            sediment_height_h2,
            sand_equivalent_100xh2_h1,
            average,
            age,	
            weight,	
            load_kn,	
            section,
            strength
            ) 
        VALUES($1, $2, $3,$4, $5, $6,$7, $8, $9,$10, $11, $12,$13, $14, $15,$16, $17, $18, $19, $20,$21, $22, $23,$24, $25,
            $26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38) RETURNING * `,
        [client_id,sample_id,sampleName,labRefNo,stdMethod,equipmentID,testStartedOn,testCompletedOn,testCategory,
        testName,labTechnician,massBefore,massAfter,sieveOpeningSize,retainedOnEachSieve,cumulativeMaterialMassRetained,
        cumulativePercentRetained,totalPassingSieve,sample,initial_dry_mass_aggregates,mass_aggregates_retained_2_36mm_sieve,
        mass_aggregates_passing_2_36mm_sieve,mass_abrasive_charges,aggregate_crushing_value,mass_aggregates_retained_1_7mm_sieve,
        mass_aggregates_passing_1_7mm_sieve,steel_spheres_number,los_angeles_value,initial_mass,flocculat_height_h1,
        sediment_height_h2,sand_equivalent_100xh2_h1,average,age,weight,load_kn,section,strength] 
            );

        req.flash("success_msg", "Test results saved successfully");
        res.redirect('/users/dashboardPage');
        // res.status(200).send({ message: `${user.firstName} ${user.lastName} added to database` });
        // console.log('Registered successfully');
        // console.log(result);

    } catch (e) {
        console.log('Failed to save the test results');
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
}); 

router.get('/',authStaff,authRole('seniorEngineer'), async (req, res) => {   
    try {
        const testResults  =  await pool.query(`SELECT * FROM aggregateTestResults`);
        if (testResults.rows != 0){
            res.status(200).send(testResults.rows);
        } else {
            res.status(404).send('No test results were found');
        }
        
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});

router.get('/:id',authUser, async (req, res) => {   
    try {
        const idToReturn = parseInt(req.params.id)
        const testResultsToReturn  =  await pool.query(`SELECT * FROM aggregateTestResults WHERE sample_id = $1
        AND labTechnician = $2`, [idToReturn]);
        if(testResultsToReturn.rows != 0 ) {
            res.status(200).send(testResultsToReturn.rows);
            console.log(testResultsToReturn.rows);
        }
        else {
            res.status(404).send('The sample submission was not found.');
            console.log(testResultsToReturn.rows);
            console.log(idToReturn);
        }
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});

router.put('/:id',authUser, async (req,res) =>{
    try {
        const { projectLocation,testDescription,testName,testNumber,equipmentID,stdMethod,
            testStartedOn,testCompletedOn,testResults,preparedBy,authorizedBy } = req.body;

        const idToUpdate = parseInt(req.params.id)
        const testResultsToUpdate  =  await pool.query(`SELECT * FROM testReport WHERE test_id = $1`, [idToUpdate]);
        if(testResultsToUpdate.rows != 0 ) {
            
            await pool.query(`UPDATE testReport SET 
            projectLocation = $1, testDescription = $2, testName = $3, testNumber = $4, equipmentID = $5, stdMethod = $6,
            testStartedOn = $7, testCompletedOn = $8, testResults = $9, preparedBy = $10,authorizedBy = $11 WHERE test_id = $10`, 
            [projectLocation,testDescription,testName,testNumber,equipmentID,stdMethod,testStartedOn,testCompletedOn,testResults,preparedBy,authorizedBy,idToUpdate] 
                ); 
            
            const updatedTestResults  =  await pool.query(`SELECT * FROM testReport WHERE test_id = $1`, [idToUpdate]);
            res.status(200).send(updatedTestResults.rows);
        }
        else {
            res.status(404).send('The test results were not found.');
        }
    } catch (error) {
        res.status(400).send('Error: ' + error.message);
        console.log('Error: ' + error.message);
    }
    
});

router.delete('/:id',authUser, async (req, res) => {   
    try {
        const idToDelete = parseInt(req.params.id)
        const testResultsToDelete  =  await pool.query(`SELECT * FROM testReport WHERE test_id = $1`, [idToDelete]);
        if(sampleToDelete.rows != 0 ) {

            const deletedTestResult = await pool.query(`DELETE FROM testReport WHERE test_id = $1 RETURNING *`, 
            [idToDelete]);
            res.status(200).send(deletedTestResult.rows);
            console.log(deletedTestResult.rows);
        }
        else {
            res.status(404).send('The test result was not found.');
            console.log('The test result was not found.');
        }
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});

router.delete('/',authUser, async (req, res) => {   
    try {
        const idToDelete = parseInt(req.params.id)
        const testResultsToDelete  =  await pool.query(`SELECT * FROM testReport`);
        if(testResultsToDelete.rows != 0 ) {
            const deletedtestResults = await pool.query(`DELETE FROM testReport RETURNING *`);
            res.status(200).send(deletedtestResults.rows);
            console.log(deletedtestResults.rows);
        }
        else {
            res.status(404).send('No test results were found to delete.');
            console.log('No test results were found to delete.');
        }
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});

module.exports = router;