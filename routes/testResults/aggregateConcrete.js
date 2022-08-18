
const express = require('express');
const router = express.Router();
const { authStaff,authRole } = require('../../middlewares/adminAuth');
const { pool } = require('../../config/dbConnection');


router.post('/:id',authStaff,authRole('labTechnician'), async (req, res) => {   
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
            const samplingPerson = sampleData.rows[0].receivername
        
            const clientName = sampleData.rows[0].customername;
            const clientAddress = sampleData.rows[0].senderaddress;
            const clientTel = sampleData.rows[0].sendertel;
            const projectName = sampleData.rows[0].projectname;
            const siteRefNo = sampleData.rows[0].sitelabelno
            const sampleSize = sampleData.rows[0].samplesize;
            const sampleSource = sampleData.rows[0].samplesource
            const samplingDate = sampleData.rows[0].samplingdate
            const receivedDate = sampleData.rows[0].receiveddate

    console.log(samplingPerson);
            await pool.query(
        `INSERT INTO aggregateConcreteTestResults (client_id,sample_id,sampleName,labRefNo,stdMethod,equipmentID,	
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

        res.status(200).send({ message: `Test results saved successfully` });
        // res.redirect('/users/dashboardPage');

    } catch (e) {
        console.log('Failed to save the test results');
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
}); 

router.get('/',authStaff,authRole('labDirector'), async (req, res) => {   
    try {
        // const testResultsToReturn1  =  await pool.query(`SELECT jsonb_strip_nulls(to_jsonb(aggregateConcreteTestResults) - 'idToReturn') FROM aggregateConcreteTestResults  WHERE sample_id = $1`, [idToReturn]);
        const allTestResultsToReturn  =  await pool.query(`SELECT * FROM aggregateConcreteTestResults`);
        
        if (allTestResultsToReturn.rows[0].testname === 'SIEVE ANALYSIS')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,equipmentID,stdMethod,testStartedOn,testCompletedOn,
            testCategory,testName,labTechnician,massBefore,massAfter,sieveOpeningSize,retainedOnEachSieve,
            cumulativeMaterialMassRetained,cumulativePercentRetained,totalPassingSieve FROM aggregateConcreteTestResults`);
            if(testResultsToReturn.rows !== 0 ) {
                return res.status(200).send(testResultsToReturn.rows);
                console.log(testResultsToReturn.rows);
            }
            else {
                return res.status(404).send('The Test results were not found.');
                console.log(testResultsToReturn.rows);
            }
        }

        else if (allTestResultsToReturn.rows[0].testname === 'AGGREGATE CRUSHING VALUE')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,
            equipmentID,stdMethod,testStartedOn,testCompletedOn,testCategory,testName,labTechnician,
            sample,initial_dry_mass_aggregates,mass_aggregates_retained_2_36mm_sieve,mass_aggregates_passing_2_36mm_sieve,
            mass_abrasive_charges,aggregate_crushing_value FROM aggregateConcreteTestResults`);
            if(testResultsToReturn.rows !== 0 ) {
                res.status(200).send(testResultsToReturn.rows);
                console.log(testResultsToReturn.rows);
            }
            else {
                res.status(404).send('The Test results were not found.');
                console.log(testResultsToReturn.rows);
                console.log(idToReturn);
            }
        }


        else if (allTestResultsToReturn.rows[0].testname === 'LOS ANGELES VALUE')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,
            equipmentID,stdMethod,testStartedOn,testCompletedOn,testCategory,testName,labTechnician,
            sample,initial_dry_mass_aggregates,mass_aggregates_retained_1_7mm_sieve,mass_aggregates_passing_1_7mm_sieve,
            steel_spheres_number,los_angeles_value FROM aggregateConcreteTestResults`);
            if(testResultsToReturn.rows !== 0 ) {
                res.status(200).send(testResultsToReturn.rows);
                console.log(testResultsToReturn.rows);
            }
            else {
                res.status(404).send('The Test results were not found.');
                console.log(testResultsToReturn.rows);
                console.log(idToReturn);
            }
        }


        else if (allTestResultsToReturn.rows[0].testname === 'SAND EQUIVALENT')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,
            equipmentID,stdMethod,testStartedOn,testCompletedOn,testCategory,testName,labTechnician,
            initial_mass,flocculat_height_h1,sediment_height_h2,sand_equivalent_100xh2_h1,average 
            FROM aggregateConcreteTestResults`);
            if(testResultsToReturn.rows !== 0 ) {
                res.status(200).send(testResultsToReturn.rows);
                console.log(testResultsToReturn.rows);
            }
            else {
                res.status(404).send('The Test results were not found.');
                console.log(testResultsToReturn.rows);
                console.log(idToReturn);
            }
        }

        else (allTestResultsToReturn.rows[0].testname === 'COMPRESSIVE STRENGTH')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,
            equipmentID,stdMethod,testStartedOn,testCompletedOn,testCategory,testName,labTechnician,
            age,weight,load_kn,section,strength,average FROM aggregateConcreteTestResults`);
            if(testResultsToReturn.rows !== 0 ) {
                res.status(200).send(testResultsToReturn.rows);
                console.log(testResultsToReturn.rows);
            }
            else {
                res.status(404).send('The Test results were not found.');
                console.log(testResultsToReturn.rows);
                console.log(idToReturn);
            }
        }

        
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});

router.get('/:id',authStaff,authRole('labTechnician'), async (req, res) => {   
    try {
        const idToReturn = parseInt(req.params.id)

        // const testResultsToReturn1  =  await pool.query(`SELECT jsonb_strip_nulls(to_jsonb(aggregateConcreteTestResults) - 'idToReturn') FROM aggregateConcreteTestResults  WHERE sample_id = $1`, [idToReturn]);
        const allTestResultsToReturn  =  await pool.query(`SELECT * FROM aggregateConcreteTestResults WHERE sample_id = $1`, [idToReturn]);
        
        if (allTestResultsToReturn.rows[0].testname === 'SIEVE ANALYSIS')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,equipmentID,stdMethod,testStartedOn,testCompletedOn,
            testCategory,testName,labTechnician,massBefore,massAfter,sieveOpeningSize,retainedOnEachSieve,
            cumulativeMaterialMassRetained,cumulativePercentRetained,totalPassingSieve FROM aggregateConcreteTestResults WHERE sample_id = $1`, [idToReturn]);
            if(testResultsToReturn.rows !== 0 ) {
                return res.status(200).send(testResultsToReturn.rows);
                console.log(testResultsToReturn.rows);
            }
            else {
                return res.status(404).send('The Test results were not found.');
                console.log(testResultsToReturn.rows);
                console.log(idToReturn);
            }
        }

        else if (allTestResultsToReturn.rows[0].testname === 'AGGREGATE CRUSHING VALUE')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,
            equipmentID,stdMethod,testStartedOn,testCompletedOn,testCategory,testName,labTechnician,
            sample,initial_dry_mass_aggregates,mass_aggregates_retained_2_36mm_sieve,mass_aggregates_passing_2_36mm_sieve,
            mass_abrasive_charges,aggregate_crushing_value FROM aggregateConcreteTestResults WHERE sample_id = $1`, [idToReturn]);
            if(testResultsToReturn.rows !== 0 ) {
                res.status(200).send(testResultsToReturn.rows);
                console.log(testResultsToReturn.rows);
            }
            else {
                res.status(404).send('The Test results were not found.');
                console.log(testResultsToReturn.rows);
                console.log(idToReturn);
            }
        }


        else if (allTestResultsToReturn.rows[0].testname === 'LOS ANGELES VALUE')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,
            equipmentID,stdMethod,testStartedOn,testCompletedOn,testCategory,testName,labTechnician,
            sample,initial_dry_mass_aggregates,mass_aggregates_retained_1_7mm_sieve,mass_aggregates_passing_1_7mm_sieve,
            steel_spheres_number,los_angeles_value FROM aggregateConcreteTestResults WHERE sample_id = $1`, [idToReturn]);
            if(testResultsToReturn.rows !== 0 ) {
                res.status(200).send(testResultsToReturn.rows);
                console.log(testResultsToReturn.rows);
            }
            else {
                res.status(404).send('The Test results were not found.');
                console.log(testResultsToReturn.rows);
                console.log(idToReturn);
            }
        }


        else if (allTestResultsToReturn.rows[0].testname === 'SAND EQUIVALENT')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,
            equipmentID,stdMethod,testStartedOn,testCompletedOn,testCategory,testName,labTechnician,
            initial_mass,flocculat_height_h1,sediment_height_h2,sand_equivalent_100xh2_h1,average 
            FROM aggregateConcreteTestResults WHERE sample_id = $1`, [idToReturn]);
            if(testResultsToReturn.rows !== 0 ) {
                res.status(200).send(testResultsToReturn.rows);
                console.log(testResultsToReturn.rows);
            }
            else {
                res.status(404).send('The Test results were not found.');
                console.log(testResultsToReturn.rows);
                console.log(idToReturn);
            }
        }

        else (allTestResultsToReturn.rows[0].testname === 'COMPRESSIVE STRENGTH')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,
            equipmentID,stdMethod,testStartedOn,testCompletedOn,testCategory,testName,labTechnician,
            age,weight,load_kn,section,strength,average FROM aggregateConcreteTestResults WHERE sample_id = $1`, [idToReturn]);
            if(testResultsToReturn.rows !== 0 ) {
                res.status(200).send(testResultsToReturn.rows);
                console.log(testResultsToReturn.rows);
            }
            else {
                res.status(404).send('The Test results were not found.');
                console.log(testResultsToReturn.rows);
                console.log(idToReturn);
            }
        }

        
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});

router.put('/:id',authStaff,authRole('labTechnician'), async (req,res) =>{
    try {
        const { equipmentID,testStartedOn,testCompletedOn,testCategory,testName,massBefore,massAfter,sieveOpeningSize,
            retainedOnEachSieve,cumulativeMaterialMassRetained,cumulativePercentRetained,totalPassingSieve,sample,
            initial_dry_mass_aggregates,mass_aggregates_retained_2_36mm_sieve,mass_aggregates_passing_2_36mm_sieve,
            mass_abrasive_charges,aggregate_crushing_value,mass_aggregates_retained_1_7mm_sieve,mass_aggregates_passing_1_7mm_sieve,
            steel_spheres_number,los_angeles_value,initial_mass,flocculat_height_h1,sediment_height_h2,sand_equivalent_100xh2_h1,
            average,age,weight,	load_kn,section,strength } = req.body;

        const idToUpdate = parseInt(req.params.id)
        const testResultsToUpdate  =  await pool.query(`SELECT * FROM aggregateConcreteTestResults WHERE test_id = $1`, [idToUpdate]);
        if(testResultsToUpdate.rows !== 0 ) {
            
            await pool.query (`UPDATE aggregateConcreteTestResults SET 
            equipmentID = $1,testStartedOn=$2,testCompletedOn= $3,testCategory= $4,testName= $5,massBefore= $6,massAfter=$7,sieveOpeningSize=$8,
            retainedOnEachSieve=$9,cumulativeMaterialMassRetained=$10,cumulativePercentRetained=$11,totalPassingSieve=$12,sample=$13,
            initial_dry_mass_aggregates=$14, mass_aggregates_retained_2_36mm_sieve=$15,mass_aggregates_passing_2_36mm_sieve=$16,
            mass_abrasive_charges=$17, aggregate_crushing_value=$18,mass_aggregates_retained_1_7mm_sieve=$19,mass_aggregates_passing_1_7mm_sieve=$20,
            steel_spheres_number=$21,los_angeles_value=$22,initial_mass=$23,flocculat_height_h1=$24,sediment_height_h2=$25,sand_equivalent_100xh2_h1=$26,
            average=$27,age=$28,weight=$29,	load_kn=$30,section=$31,strength=$32 WHERE test_id = $33`, 
            [equipmentID,testStartedOn,testCompletedOn,testCategory,testName,massBefore,massAfter,sieveOpeningSize,
            retainedOnEachSieve,cumulativeMaterialMassRetained,cumulativePercentRetained,totalPassingSieve,sample,
            initial_dry_mass_aggregates,mass_aggregates_retained_2_36mm_sieve,mass_aggregates_passing_2_36mm_sieve,
            mass_abrasive_charges,aggregate_crushing_value,mass_aggregates_retained_1_7mm_sieve,mass_aggregates_passing_1_7mm_sieve,
            steel_spheres_number,los_angeles_value,initial_mass,flocculat_height_h1,sediment_height_h2,sand_equivalent_100xh2_h1,
            average,age,weight,	load_kn,section,strength,idToUpdate] 
            ); 
            
            const updatedTestResults  =  await pool.query(`SELECT * FROM aggregateConcreteTestResults WHERE test_id = $1`, [idToUpdate]);
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

router.delete('/:id',authStaff,authRole('labTechnician'), async (req, res) => {   
    try {
        const idToDelete = parseInt(req.params.id)
        const testResultsToDelete  =  await pool.query(`SELECT * FROM aggregateConcreteTestResults WHERE test_id = $1`, [idToDelete]);
        if(testResultsToDelete.rows !== 0 ) {

            const deletedTestResult = await pool.query(`DELETE FROM aggregateConcreteTestResults WHERE test_id = $1 RETURNING *`, 
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

router.delete('/',authStaff,authRole('labDirector'), async (req, res) => {   
    try {
        const testResultsToDelete  =  await pool.query(`SELECT * FROM aggregateConcreteTestResults`);
        if(testResultsToDelete.rows != 0 ) {
            const deletedtestResults = await pool.query(`DELETE FROM aggregateConcreteTestResults RETURNING *`);
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