
const express = require('express');
const router = express.Router();
const { authStaff,authRole } = require('../../middlewares/adminAuth');
const { pool } = require('../../config/dbConnection');


router.post('/:id',authStaff,authRole('labTechnician'), async (req, res) => { 
    const sampleId = parseInt(req.params.id);  
    try {
        const { 
            equipmentID,testStartedOn,testCompletedOn,testCategory,testName,tin1_measurementNo,tin1_penetration,
            tin1_average,tin2_measurementNo,tin2_penetration,tin2_average,time,temp,ring1,ring2,average,water,glycerin,
            date,specimenNo,blowsNo,height,av_height,wt_air_dry,wt_in_air_sat,wt_in_water,specimen_volume,density,
            av_density,gsb,actual_binder_cont,max_sp_gr_mix,vma,vim,vfb,flow_initial,flow_final,flow,av_flow,
            max_load,stability,correction_factor,actual_stability,av_stability
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
        `INSERT INTO asphaltBitumenTestResults (client_id,sample_id,sampleName,labRefNo,stdMethod,equipmentID,	
            testStartedOn,testCompletedOn,testCategory,testName,labTechnician,tin1_measurementNo,tin1_penetration,
            tin1_average,tin2_measurementNo,tin2_penetration,tin2_average,time,temp,ring1,ring2,average,water,glycerin,
            date,specimenNo,blowsNo,height,av_height,wt_air_dry,wt_in_air_sat,wt_in_water,specimen_volume,density,
            av_density,gsb,actual_binder_cont,max_sp_gr_mix,vma,vim,vfb,flow_initial,flow_final,flow,av_flow,
            max_load,stability,correction_factor,actual_stability,av_stability
            ) 
        VALUES($1, $2, $3,$4, $5, $6,$7, $8, $9,$10, $11, $12,$13, $14, $15,$16, $17, $18, $19, $20,$21, $22, $23,$24, $25,
            $26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39,$40,$41,$42,$43,$44,$45,$46,$47,$48,$49,$50) RETURNING * `,
        [client_id,sample_id,sampleName,labRefNo,stdMethod,equipmentID,testStartedOn,testCompletedOn,testCategory,
        testName,labTechnician,tin1_measurementNo,tin1_penetration,tin1_average,tin2_measurementNo,
        tin2_penetration,tin2_average,time,temp,ring1,ring2,average,water,glycerin,date,specimenNo,blowsNo,height,
        av_height,wt_air_dry,wt_in_air_sat,wt_in_water,specimen_volume,density,av_density,gsb,actual_binder_cont,
        max_sp_gr_mix,vma,vim,vfb,flow_initial,flow_final,flow,av_flow,max_load,stability,correction_factor,
        actual_stability,av_stability] 
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
        const testResults  =  await pool.query(`SELECT * FROM asphaltBitumenTestResults`);
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

router.get('/',authStaff,authRole('seniorEngineer'), async (req, res) => {   
    try {
        // const testResultsToReturn1  =  await pool.query(`SELECT jsonb_strip_nulls(to_jsonb(aggregateConcreteTestResults) - 'idToReturn') FROM aggregateConcreteTestResults  WHERE sample_id = $1`, [idToReturn]);
        const allTestResultsToReturn  =  await pool.query(`SELECT * FROM asphaltBitumenTestResults`);
        
        if (allTestResultsToReturn.rows[0].testname === 'PENETRATION TEST')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,
            equipmentID,stdMethod,testStartedOn,testCompletedOn,testCategory,testName,labTechnician,
            tin1_measurementNo,tin1_penetration,tin1_average,tin2_measurementNo,tin2_penetration,tin2_average, 
            FROM asphaltBitumenTestResults`);
            if(testResultsToReturn.rows !== 0 ) {
                return res.status(200).send(testResultsToReturn.rows);
                console.log(testResultsToReturn.rows);
            }
            else {
                return res.status(404).send('The Test results were not found.');
                console.log(testResultsToReturn.rows);
            }
        }

        else if (allTestResultsToReturn.rows[0].testname === 'SOFTENING POINT')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,
            equipmentID,stdMethod,testStartedOn,testCompletedOn,testCategory,testName,labTechnician,
            time,temp,ring1,ring2,average,water,glycerin FROM asphaltBitumenTestResults`);
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

        else (allTestResultsToReturn.rows[0].testname === 'MARSHALL TEST')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,
            equipmentID,stdMethod,testStartedOn,testCompletedOn,testCategory,testName,labTechnician,
            date,specimenNo,blowsNo,height,av_height,wt_air_dry,wt_in_air_sat,wt_in_water,specimen_volume,density,
            av_density,gsb,actual_binder_cont,max_sp_gr_mix,vma,vim,vfb,flow_initial,flow_final,flow,av_flow,max_load,stability,correction_factor,
            actual_stability,av_stability FROM asphaltBitumenTestResults`);
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

router.get('/:id', async (req, res) => {   
    try {
        const idToReturn = parseInt(req.params.id)
        // const testResultsToReturn1  =  await pool.query(`SELECT jsonb_strip_nulls(to_jsonb(aggregateConcreteTestResults) - 'idToReturn') FROM aggregateConcreteTestResults  WHERE sample_id = $1`, [idToReturn]);
        const allTestResultsToReturn  =  await pool.query(`SELECT * FROM asphaltBitumenTestResults`);
        
        if (allTestResultsToReturn.rows[0].testname === 'PENETRATION TEST')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,
            equipmentID,stdMethod,testStartedOn,testCompletedOn,testCategory,testName,labTechnician,
            tin1_measurementNo,tin1_penetration,tin1_average,tin2_measurementNo,tin2_penetration,tin2_average, 
            FROM asphaltBitumenTestResults WHERE sample_id = $1`, [idToReturn]);
            if(testResultsToReturn.rows !== 0 ) {
                return res.status(200).send(testResultsToReturn.rows);
                console.log(testResultsToReturn.rows);
            }
            else {
                return res.status(404).send('The Test results were not found.');
                console.log(testResultsToReturn.rows);
            }
        }

        else if (allTestResultsToReturn.rows[0].testname === 'SOFTENING POINT')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,
            equipmentID,stdMethod,testStartedOn,testCompletedOn,testCategory,testName,labTechnician,
            time,temp,ring1,ring2,average,water,glycerin FROM asphaltBitumenTestResults WHERE sample_id = $1`, [idToReturn]);
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

        else (allTestResultsToReturn.rows[0].testname === 'MARSHALL TEST')
        {
            const testResultsToReturn  =  await pool.query(`SELECT test_id,client_id,sample_id,sampleName,labRefNo,
            equipmentID,stdMethod,testStartedOn,testCompletedOn,testCategory,testName,labTechnician,
            date,specimenNo,blowsNo,height,av_height,wt_air_dry,wt_in_air_sat,wt_in_water,specimen_volume,density,
            av_density,gsb,actual_binder_cont,max_sp_gr_mix,vma,vim,vfb,flow_initial,flow_final,flow,av_flow,max_load,stability,correction_factor,
            actual_stability,av_stability FROM asphaltBitumenTestResults WHERE sample_id = $1`, [idToReturn]);
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

router.put('/:id', async (req,res) =>{
    try {
        const { equipmentID,testStartedOn,testCompletedOn,testCategory,testName,tin1_measurementNo,tin1_penetration,
            tin1_average,tin2_measurementNo,tin2_penetration,tin2_average,time,temp,ring1,ring2,average,water,glycerin,
            date,specimenNo,blowsNo,height,av_height,wt_air_dry,wt_in_air_sat,wt_in_water,specimen_volume,density,
            av_density,gsb,actual_binder_cont,max_sp_gr_mix,vma,vim,vfb,flow_initial,flow_final,flow,av_flow,
            max_load,stability,correction_factor,actual_stability,av_stability } = req.body;

        const idToUpdate = parseInt(req.params.id)
        const testResultsToUpdate  =  await pool.query(`SELECT * FROM aggregateConcreteTestResults WHERE test_id = $1`, [idToUpdate]);
        if(testResultsToUpdate.rows !== 0 ) {
            
            await pool.query (`UPDATE asphaltBitumenTestResults SET 
            equipmentID = $1,testStartedOn=$2,testCompletedOn= $3,testCategory= $4,testName= $5,tin1_measurementNo= $6,
            tin1_penetration=$7, tin1_average=$8,tin2_measurementNo=$9,tin2_penetration=$10,tin2_average=$11,time=$12,temp=$13,
            ring1=$14, ring2=$15,average=$16,water=$17, glycerin=$18,date=$19,specimenNo=$20,blowsNo=$21,height=$22,
            av_height=$23,wt_air_dry=$24,wt_in_air_sat=$25,wt_in_water=$26,specimen_volume=$27,density=$28,av_density=$29,
            gsb=$30,actual_binder_cont=$31,max_sp_gr_mix=$32,vma= $33,vim=$34,vfb=$35,flow_initial=$36,
            flow_final=$37,flow=$38,av_flow=$39,max_load=$40,stability=$41,correction_factor=$42,actual_stability=$43,
            av_stability=$44 WHERE test_id = $45`, 
            [equipmentID,testStartedOn,testCompletedOn,testCategory,testName,tin1_measurementNo,tin1_penetration,
                tin1_average,tin2_measurementNo,tin2_penetration,tin2_average,time,temp,ring1,ring2,average,water,glycerin,
                date,specimenNo,blowsNo,height,av_height,wt_air_dry,wt_in_air_sat,wt_in_water,specimen_volume,density,
                av_density,gsb,actual_binder_cont,max_sp_gr_mix,vma,vim,vfb,flow_initial,flow_final,flow,av_flow,
                max_load,stability,correction_factor,actual_stability,av_stability,idToUpdate] 
            ); 
            
            const updatedTestResults  =  await pool.query(`SELECT * FROM asphaltBitumenTestResults WHERE test_id = $1`, [idToUpdate]);
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

router.delete('/:id', async (req, res) => {   
    try {
        const idToDelete = parseInt(req.params.id)
        const testResultsToDelete  =  await pool.query(`SELECT * FROM asphaltBitumenTestResults WHERE test_id = $1`, [idToDelete]);
        if(testResultsToDelete.rows !== 0 ) {

            const deletedTestResult = await pool.query(`DELETE FROM asphaltBitumenTestResults WHERE test_id = $1 RETURNING *`, 
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

router.delete('/', async (req, res) => {   
    try {
        const testResultsToDelete  =  await pool.query(`SELECT * FROM asphaltBitumenTestResults`);
        if(testResultsToDelete.rows != 0 ) {
            const deletedtestResults = await pool.query(`DELETE FROM asphaltBitumenTestResults RETURNING *`);
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