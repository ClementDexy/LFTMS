
const express = require('express');
const router = express.Router();
const { authStaff,authRole } = require('../../middlewares/adminAuth');
const { pool } = require('../../config/dbConnection');


router.post('/:id',authStaff,authRole('labTechnician'), async (req, res) => { 
    const sampleId = parseInt(req.params.id);  
    try {
        const { 
            equipmentID,testStartedOn,testCompletedOn,testCategory,testName,panNo,wet_weight_pan,dry_weight_pan,
            pan_weight, water_weight, dry_weight, moisture_content,massBefore,massAfter, sieveOpeningSize,
            retainedOnEachSieve,cumulativeMaterialMassRetained,cumulative_percent_retained,totalPassingSieve,
            blowsNo,average,plastic_index,added_water,weight_mould_wet_mat,weight_mould,weight_wet_material,
            wet_density,volume_mould,dry_density,weight_pan_wet_mat,weight_pan_dry_mat,weight_dry_material,
            penetration,blows_56_reading,blows_56_load,blows_25_reading,blows_25_load,blows_10_reading,blows_10_load,
            swell,blows_56_swell,blows_25_swell,blows_10_swell,mouldNo,mass_mould_wet_mat,mass_mould,mass_wet_material,
            mould_volume,ref_proctor,percent_compaction,cbr_indice,mass_pan_wet_mat,mass_pan_dry_mat,
            mass_pan,mass_water,mass_dry_material
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
        `INSERT INTO soilTestResults (client_id,sample_id,sampleName,labRefNo,stdMethod,equipmentID,	
            testStartedOn,testCompletedOn,testCategory,testName,labTechnician,panNo,wet_weight_pan,dry_weight_pan,
            pan_weight, water_weight, dry_weight, moisture_content,massBefore,massAfter, sieveOpeningSize,
            retainedOnEachSieve,cumulativeMaterialMassRetained,cumulative_percent_retained,totalPassingSieve,
            blowsNo,average,plastic_index,added_water,weight_mould_wet_mat,weight_mould,weight_wet_material,
            wet_density,volume_mould,dry_density,weight_pan_wet_mat,weight_pan_dry_mat,weight_dry_material,
            penetration,blows_56_reading,blows_56_load,blows_25_reading,blows_25_load,blows_10_reading,blows_10_load,
            swell,blows_56_swell,blows_25_swell,blows_10_swell,mouldNo,mass_mould_wet_mat,mass_mould,mass_wet_material,
            mould_volume,ref_proctor,percent_compaction,cbr_indice,mass_pan_wet_mat,mass_pan_dry_mat,
            mass_pan,mass_water,mass_dry_material
            ) 
        VALUES($1, $2, $3,$4, $5, $6,$7, $8, $9,$10, $11, $12,$13, $14, $15,$16, $17, $18, $19, $20,$21, $22, $23,$24, $25,
            $26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39,$40,$41,$42,$43,$44,$45,$46,$47,$48,$49,$50
            ,$51,$52,$53,$54,$55,$56,$57,$58,$59,$60,$61,$62) RETURNING * `,
        [client_id,sample_id,sampleName,labRefNo,stdMethod,equipmentID,testStartedOn,testCompletedOn,testCategory,
        testName,labTechnician,panNo,wet_weight_pan,dry_weight_pan,pan_weight, water_weight, dry_weight, 
        moisture_content,massBefore,massAfter, sieveOpeningSize,retainedOnEachSieve,cumulativeMaterialMassRetained,
        cumulative_percent_retained,totalPassingSieve,blowsNo,average,plastic_index,added_water,weight_mould_wet_mat,
        weight_mould,weight_wet_material,wet_density,volume_mould,dry_density,weight_pan_wet_mat,weight_pan_dry_mat,
        weight_dry_material,penetration,blows_56_reading,blows_56_load,blows_25_reading,blows_25_load,blows_10_reading,
        blows_10_load,swell,blows_56_swell,blows_25_swell,blows_10_swell,mouldNo,mass_mould_wet_mat,mass_mould,
        mass_wet_material,mould_volume,ref_proctor,percent_compaction,cbr_indice,mass_pan_wet_mat,mass_pan_dry_mat,
        mass_pan,mass_water,mass_dry_material] 
            );

        res.status(200).send({ message: `Test results saved successfully` });
        // req.flash("success_msg", "Test results saved successfully");
        // res.redirect('/users/dashboardPage');
    } catch (e) {
        console.log('Failed to save the test results');
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
}); 

router.get('/',authStaff,authRole('labDirector'), async (req, res) => {   
    try {
        const allTestResultsToReturn  =  await pool.query(`SELECT * FROM aggregateConcreteTestResults`);
        
        if (allTestResultsToReturn.rows[0].testname === 'SIEVE ANALYSIS')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,equipmentID,stdMethod,testStartedOn,testCompletedOn,
            testCategory,testName,labTechnician,massBefore,massAfter,sieveOpeningSize,retainedOnEachSieve,
            cumulativeMaterialMassRetained,cumulativePercentRetained,totalPassingSieve 
            FROM aggregateConcreteTestResults WHERE testName = 'SIEVE ANALYSIS`);
            if(testResultsToReturn.rows !== 0 ) {
                return res.status(200).send(testResultsToReturn.rows);
                console.log(testResultsToReturn.rows);
            }
            else {
                return res.status(404).send('The Test results were not found.');
                console.log(testResultsToReturn.rows);
            }
        }

        else if (allTestResultsToReturn.rows[0].testname === 'MOISTURE CONTENT')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,
            equipmentID,stdMethod,testStartedOn,testCompletedOn,testCategory,testName,labTechnician,panNo,
            wet_weight_pan,dry_weight_pan,pan_weight, water_weight, dry_weight, moisture_content, 
            FROM soilTestResults WHERE testName = 'MOISTURE CONTENT'`);
            if(testResultsToReturn.rows !== 0 ) {
                return res.status(200).send(testResultsToReturn.rows);
                console.log(testResultsToReturn.rows);
            }
            else {
                return res.status(404).send('The Test results were not found.');
                console.log(testResultsToReturn.rows);
            }
        }

        else if (allTestResultsToReturn.rows[0].testname === 'LIQUID LIMITS')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,
            equipmentID,stdMethod,testStartedOn,testCompletedOn,testCategory,testName,labTechnician,
            blowsNo,panNo,wet_weight_pan,dry_weight_pan,pan_weight, water_weight, dry_weight, moisture_content
            FROM soilTestResults WHERE testName = 'LIQUID LIMITS'`);
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


        else if (allTestResultsToReturn.rows[0].testname === 'PLASTIC LIMIT TEST')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,
            equipmentID,stdMethod,testStartedOn,testCompletedOn,testCategory,testName,labTechnician,
            panNo,wet_weight_pan,dry_weight_pan,pan_weight, water_weight, dry_weight, moisture_content,average,
            plastic_index FROM soilTestResults WHERE testName = 'PLASTIC LIMIT TEST'`);
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


        else if (allTestResultsToReturn.rows[0].testname === 'COMPACTION TEST-MODIFIED')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,
            equipmentID,stdMethod,testStartedOn,testCompletedOn,testCategory,testName,labTechnician,
            added_water,weight_mould_wet_mat,weight_mould,weight_wet_material,wet_density,volume_mould,
            dry_density,weight_pan_wet_mat,weight_pan_dry_mat,weight_dry_material,panNo,pan_weight, water_weight, 
            moisture_content FROM soilTestResults WHERE testName = 'COMPACTION TEST-MODIFIED'`);
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

        else (allTestResultsToReturn.rows[0].testname === 'CBR TEST')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,
            equipmentID,stdMethod,testStartedOn,testCompletedOn,testCategory,testName,labTechnician,
            penetration,blowsNo,wet_density,moisture_content,dry_density,panNo,blows_56_reading,blows_56_load,
            blows_25_reading,blows_25_load,blows_10_reading,blows_10_load,swell,blows_56_swell,blows_25_swell,
            blows_10_swell,mouldNo,mass_mould_wet_mat,mass_mould,mass_wet_material,mould_volume,ref_proctor,
            percent_compaction,cbr_indice,mass_pan_wet_mat,mass_pan_dry_mat,mass_pan,mass_water,mass_dry_material 
            FROM soilTestResults WHERE testName = 'CBR TEST'`);
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

        
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});

router.get('/:id',authStaff,authRole('labTechnician'), async (req, res) => {   
    try {
        const idToReturn = parseInt(req.params.id)
        const allTestResultsToReturn  =  await pool.query(`SELECT * FROM aggregateConcreteTestResults`);
        
        if (allTestResultsToReturn.rows[0].testname === 'SIEVE ANALYSIS')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,equipmentID,stdMethod,testStartedOn,testCompletedOn,
            testCategory,testName,labTechnician,massBefore,massAfter,sieveOpeningSize,retainedOnEachSieve,
            cumulativeMaterialMassRetained,cumulativePercentRetained,totalPassingSieve 
            FROM aggregateConcreteTestResults WHERE sample_id = $1`, [idToReturn]);
            if(testResultsToReturn.rows !== 0 ) {
                return res.status(200).send(testResultsToReturn.rows);
                console.log(testResultsToReturn.rows);
            }
            else {
                return res.status(404).send('The Test results were not found.');
                console.log(testResultsToReturn.rows);
            }
        }

        else if (allTestResultsToReturn.rows[0].testname === 'MOISTURE CONTENT')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,
            equipmentID,stdMethod,testStartedOn,testCompletedOn,testCategory,testName,labTechnician,panNo,
            wet_weight_pan,dry_weight_pan,pan_weight, water_weight, dry_weight, moisture_content, 
            FROM soilTestResults WHERE sample_id = $1`, [idToReturn]);
            if(testResultsToReturn.rows !== 0 ) {
                return res.status(200).send(testResultsToReturn.rows);
                console.log(testResultsToReturn.rows);
            }
            else {
                return res.status(404).send('The Test results were not found.');
                console.log(testResultsToReturn.rows);
            }
        }

        else if (allTestResultsToReturn.rows[0].testname === 'LIQUID LIMITS')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,
            equipmentID,stdMethod,testStartedOn,testCompletedOn,testCategory,testName,labTechnician,
            blowsNo,panNo,wet_weight_pan,dry_weight_pan,pan_weight, water_weight, dry_weight, moisture_content
            FROM soilTestResults WHERE sample_id = $1`, [idToReturn]);
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


        else if (allTestResultsToReturn.rows[0].testname === 'PLASTIC LIMIT TEST')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,
            equipmentID,stdMethod,testStartedOn,testCompletedOn,testCategory,testName,labTechnician,
            panNo,wet_weight_pan,dry_weight_pan,pan_weight, water_weight, dry_weight, moisture_content,average,
            plastic_index FROM soilTestResults WHERE sample_id = $1`, [idToReturn]);
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


        else if (allTestResultsToReturn.rows[0].testname === 'COMPACTION TEST-MODIFIED')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,
            equipmentID,stdMethod,testStartedOn,testCompletedOn,testCategory,testName,labTechnician,
            added_water,weight_mould_wet_mat,weight_mould,weight_wet_material,wet_density,volume_mould,
            dry_density,weight_pan_wet_mat,weight_pan_dry_mat,weight_dry_material,panNo,pan_weight, water_weight, 
            moisture_content FROM soilTestResults WHERE sample_id = $1`, [idToReturn]);
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

        else (allTestResultsToReturn.rows[0].testname === 'CBR TEST')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,
            equipmentID,stdMethod,testStartedOn,testCompletedOn,testCategory,testName,labTechnician,
            penetration,blowsNo,wet_density,moisture_content,dry_density,panNo,blows_56_reading,blows_56_load,
            blows_25_reading,blows_25_load,blows_10_reading,blows_10_load,swell,blows_56_swell,blows_25_swell,
            blows_10_swell,mouldNo,mass_mould_wet_mat,mass_mould,mass_wet_material,mould_volume,ref_proctor,
            percent_compaction,cbr_indice,mass_pan_wet_mat,mass_pan_dry_mat,mass_pan,mass_water,mass_dry_material 
            FROM soilTestResults WHERE sample_id = $1`, [idToReturn]);
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

        
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});

router.put('/:id',authStaff,authRole('labTechnician'), async (req,res) =>{
    try {
        const { equipmentID,testStartedOn,testCompletedOn,testCategory,testName,panNo,wet_weight_pan,dry_weight_pan,
            pan_weight, water_weight, dry_weight, moisture_content,massBefore,massAfter, sieveOpeningSize,
            retainedOnEachSieve,cumulativeMaterialMassRetained,cumulative_percent_retained,totalPassingSieve,
            blowsNo,average,plastic_index,added_water,weight_mould_wet_mat,weight_mould,weight_wet_material,
            wet_density,volume_mould,dry_density,weight_pan_wet_mat,weight_pan_dry_mat,weight_dry_material,
            penetration,blows_56_reading,blows_56_load,blows_25_reading,blows_25_load,blows_10_reading,blows_10_load,
            swell,blows_56_swell,blows_25_swell,blows_10_swell,mouldNo,mass_mould_wet_mat,mass_mould,mass_wet_material,
            mould_volume,ref_proctor,percent_compaction,cbr_indice,mass_pan_wet_mat,mass_pan_dry_mat,
            mass_pan,mass_water,mass_dry_material } = req.body;

        const idToUpdate = parseInt(req.params.id)
        const testResultsToUpdate  =  await pool.query(`SELECT * FROM soilTestResults WHERE test_id = $1`, [idToUpdate]);
        if(testResultsToUpdate.rows !== 0 ) {
            
            await pool.query (`UPDATE aggregateConcreteTestResults SET 
            equipmentID = $1,testStartedOn=$2,testCompletedOn= $3,testCategory= $4,testName= $5,panNo= $6,wet_weight_pan=$7,dry_weight_pan=$8,
            pan_weight= $9, water_weight= $10, dry_weight= $11, moisture_content= $12,massBefore= $13,massAfter= $14, sieveOpeningSize= $15,
            retainedOnEachSieve= $16,cumulativeMaterialMassRetained= $17,cumulative_percent_retained= $18,totalPassingSieve= $19,
            blowsNo= $20,average= $21,plastic_index= $22,added_water= $23,weight_mould_wet_mat= $24,weight_mould= $25,weight_wet_material= $26,
            wet_density= $27,volume_mould,dry_density= $28,weight_pan_wet_mat= $29,weight_pan_dry_mat= $30,weight_dry_material= $31,
            penetration= $32,blows_56_reading= $33,blows_56_load= $34,blows_25_reading= $35,blows_25_load= $36,blows_10_reading= $37,blows_10_load= $38,
            swell= $39,blows_56_swell= $40,blows_25_swell= $41,blows_10_swell= $42,mouldNo= $43,mass_mould_wet_mat= $44,mass_mould= $45,mass_wet_material= $46,
            mould_volume= $47,ref_proctor= $48,percent_compaction= $49,cbr_indice= $50,mass_pan_wet_mat= $51,mass_pan_dry_mat= $52,
            mass_pan= $53,mass_water= $54,mass_dry_material= $55 WHERE test_id = $56`, 
            [ equipmentID,testStartedOn,testCompletedOn,testCategory,testName,panNo,wet_weight_pan,dry_weight_pan,
            pan_weight, water_weight, dry_weight, moisture_content,massBefore,massAfter, sieveOpeningSize,
            retainedOnEachSieve,cumulativeMaterialMassRetained,cumulative_percent_retained,totalPassingSieve,
            blowsNo,average,plastic_index,added_water,weight_mould_wet_mat,weight_mould,weight_wet_material,
            wet_density,volume_mould,dry_density,weight_pan_wet_mat,weight_pan_dry_mat,weight_dry_material,
            penetration,blows_56_reading,blows_56_load,blows_25_reading,blows_25_load,blows_10_reading,blows_10_load,
            swell,blows_56_swell,blows_25_swell,blows_10_swell,mouldNo,mass_mould_wet_mat,mass_mould,mass_wet_material,
            mould_volume,ref_proctor,percent_compaction,cbr_indice,mass_pan_wet_mat,mass_pan_dry_mat,
            mass_pan,mass_water,mass_dry_material,idToUpdate ] 
            ); 
            
            const updatedTestResults  =  await pool.query(`SELECT * FROM soilTestResults WHERE test_id = $1`, [idToUpdate]);
            return res.status(200).send(updatedTestResults.rows);
        }
        else {
            res.status(404).send('The test results were not found.');
        }
    } catch (error) {
        return res.status(400).send('Error: ' + error.message);
        console.log('Error: ' + error.message);
    }
    
});

router.delete('/:id',authStaff,authRole('labTechnician'), async (req, res) => {   
    try {
        const idToDelete = parseInt(req.params.id)
        const testResultsToDelete  =  await pool.query(`SELECT * FROM soilTestResults WHERE test_id = $1`, [idToDelete]);
        if(testResultsToDelete.rows !== 0 ) {

            const deletedTestResult = await pool.query(`DELETE FROM soilTestResults WHERE test_id = $1 RETURNING *`, 
            [idToDelete]);
            return res.status(200).send(deletedTestResult.rows);
            console.log(deletedTestResult.rows);
        }
        else {
            return res.status(404).send('The test result was not found.');
            console.log('The test result was not found.');
        }
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});

router.delete('/',authStaff,authRole('labDirector'), async (req, res) => {   
    try {
        const testResultsToDelete  =  await pool.query(`SELECT * FROM soilTestResults`);
        if(testResultsToDelete.rows != 0 ) {
            const deletedtestResults = await pool.query(`DELETE FROM soilTestResults RETURNING *`);
            return res.status(200).send(deletedtestResults.rows);
            console.log(deletedtestResults.rows);
        }
        else {
            return res.status(404).send('No test results were found to delete.');
            console.log('No test results were found to delete.');
        }
    } catch (e) {
        return res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});

module.exports = router;