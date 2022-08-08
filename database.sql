CREATE TABLE reg_users (
	user_id serial PRIMARY KEY,
	username VARCHAR ( 50 ) UNIQUE NOT NULL,
	password VARCHAR ( 50 ) NOT NULL,
	email VARCHAR ( 255 ) UNIQUE NOT NULL,
    telephone INTEGER UNIQUE NOT NULL,
	created_on TIMESTAMP NOT NULL,
    last_login TIMESTAMP 
);

CREATE TABLE reg_users (
	user_id serial PRIMARY KEY,
	firstName VARCHAR ( 100 ) NOT NULL,
	lastName VARCHAR ( 100 ) NOT NULL,
	email VARCHAR ( 100 ) UNIQUE NOT NULL,
    telephone INTEGER UNIQUE NOT NULL,
	password VARCHAR ( 255 ) NOT NULL,
	resetLink VARCHAR	
);

ALTER TABLE reg_users
ADD COLUMN resetLink VARCHAR;

-- Here needs some modifications
CREATE TABLE sampleSubmission (
	sample_id serial PRIMARY KEY,
	user_id INT NOT NULL REFERENCES reg_users ON DELETE RESTRICT,
	staff_id INT NOT NULL REFERENCES staff ON DELETE RESTRICT,
	sampleName VARCHAR ( 255 ) NOT NULL,
	sampleSize VARCHAR ( 50 ) NOT NULL,
	sampleSource VARCHAR ( 255 ) NOT NULL,
	samplingDate DATE NOT NULL,
	labLabelNo VARCHAR ( 50 ) UNIQUE NOT NULL,
	siteLabelNo VARCHAR ( 50 ) UNIQUE NOT NULL,
	sampleCondition VARCHAR ( 255)  NOT NULL,
	stdMethods VARCHAR ( 255 ) NOT NULL,
	paramsTobeTested VARCHAR ( 255 ) NOT NULL,
	submitterName VARCHAR ( 255 ) NOT NULL,
	submitterSignature VARCHAR ( 50 ) NOT NULL,
	submittedDate DATE NOT NULL,
	projectName VARCHAR ( 255 ) NOT NULL,
	customerName VARCHAR ( 255 ) NOT NULL,
	senderAddress VARCHAR ( 255 ) NOT NULL,
	senderTel VARCHAR ( 50 ) NOT NULL,
	labTechnician VARCHAR ( 255 ) NOT NULL,
	receiverName VARCHAR ( 255 ) NOT NULL,
	receiverSignature VARCHAR ( 50 ) UNIQUE NOT NULL,
	receivedDate DATE NOT NULL
);

FOREIGN KEY(user_id) REFERENCES reg_users(user_id)
	ON DELETE CASCADE
sample_id,user_id,sampleName,sampleSize,sampleSource,samplingDate,labLabelNo,siteLabelNo,
sampleCondition,stdMethods,paramsTobeTested,submitterName,submitterSignature,submittedDate,projectName,customerName,
senderAddress,senderTel,receiverName,receiverSignature,receivedDate

CREATE TABLE aggregateTestResults (
	test_id serial PRIMARY KEY,
	client_id INT NOT NULL REFERENCES reg_users ON DELETE RESTRICT,
	sample_id INT NOT NULL REFERENCES sampleSubmission ON DELETE RESTRICT,
	sampleName VARCHAR ( 255 ) NOT NULL,
	labRefNo VARCHAR ( 50 ) UNIQUE NOT NULL,
	equipmentID VARCHAR ( 255 ) NOT NULL,
	stdMethod VARCHAR ( 255 ) NOT NULL,	
	testStartedOn DATE NOT NULL,
	testCompletedOn DATE NOT NULL,
	testCategory VARCHAR ( 255 ) NOT NULL,
	testName VARCHAR ( 255 ) NOT NULL,
	labTechnician VARCHAR ( 255 ) NOT NULL,
	massBefore INTEGER,
	massAfter INTEGER,
	sieveOpeningSize INTEGER,
	retainedOnEachSieve INTEGER,
	cumulativeMaterialMassRetained INTEGER,
	cumulativePercentRetained INTEGER,
	totalPassingSieve INTEGER,
	sample VARCHAR,
	initial_dry_mass_aggregates INTEGER,
	mass_aggregates_retained_2_36mm_sieve INTEGER,
	mass_aggregates_passing_2_36mm_sieve INTEGER,
	mass_abrasive_charges INTEGER,
	aggregate_crushing_value INTEGER,
	mass_aggregates_retained_1_7mm_sieve INTEGER,
	mass_aggregates_passing_1_7mm_sieve INTEGER,
	steel_spheres_number INTEGER,
	los_angeles_value INTEGER,
	initial_mass INTEGER,
	flocculat_height_h1 INTEGER,
	sediment_height_h2 INTEGER,
	sand_equivalent_100xh2_h1 INTEGER,
	average INTEGER,
	age INTEGER,	
	weight INTEGER,	
	load_kn INTEGER,	
	section INTEGER,
	strength INTEGER	
);


CREATE TABLE asphaltBitumenTestResults (
	test_id serial PRIMARY KEY,
	client_id INT NOT NULL REFERENCES reg_users ON DELETE RESTRICT,
	sample_id INT NOT NULL REFERENCES sampleSubmission ON DELETE RESTRICT,
	sampleName VARCHAR ( 255 ) NOT NULL,
	labRefNo VARCHAR ( 50 ) UNIQUE NOT NULL,
	equipmentID VARCHAR ( 255 ) NOT NULL,
	stdMethod VARCHAR ( 255 ) NOT NULL,	
	testStartedOn DATE NOT NULL,
	testCompletedOn DATE NOT NULL,
	testCategory VARCHAR ( 255 ) NOT NULL,
	testName VARCHAR ( 255 ) NOT NULL,
	tin1_measurementNo VARCHAR,
	tin1_penetration VARCHAR,
	tin1_average  VARCHAR,
	tin2_measurementNo VARCHAR,
	tin2_penetration VARCHAR,
	tin2_average VARCHAR,
	time  VARCHAR,,
	temp VARCHAR,
	ring1 VARCHAR,
	ring2 VARCHAR,
	average VARCHAR,
	water VARCHAR,
	glycerin VARCHAR,
	date DATE
	specimenNo VARCHAR,
	blowsNo VARCHAR,
	height VARCHAR,
	av_height VARCHAR,
	wt_air_dry VARCHAR,
	wt_in_air_sat VARCHAR,
	wt_in_water VARCHAR,
	specimen_volume VARCHAR,
	density VARCHAR,
	av_density VARCHAR,
	gsb VARCHAR,
	actual_binder_cont VARCHAR,
	max_sp_gr_mix VARCHAR,
	vma VARCHAR,
	vim VARCHAR,
	vfb VARCHAR,
	flow_initial VARCHAR,
	flow_final VARCHAR,
	flow VARCHAR,
	av_flow VARCHAR,
	max_load VARCHAR,
	stability VARCHAR,
	correction_factor VARCHAR,
	actual_stability VARCHAR,
	av_stability VARCHAR
);

CREATE TABLE soilTestResults (
	test_id serial PRIMARY KEY,
	client_id INT NOT NULL REFERENCES reg_users ON DELETE RESTRICT,
	sample_id INT NOT NULL REFERENCES sampleSubmission ON DELETE RESTRICT,
	sampleName VARCHAR ( 255 ) NOT NULL,
	labRefNo VARCHAR ( 50 ) UNIQUE NOT NULL,
	equipmentID VARCHAR ( 255 ) NOT NULL,
	stdMethod VARCHAR ( 255 ) NOT NULL,	
	testStartedOn DATE NOT NULL,
	testCompletedOn DATE NOT NULL,
	testCategory VARCHAR ( 255 ) NOT NULL,
	testName VARCHAR ( 255 ) NOT NULL,	
	panNo INTEGER,
	wet_weight_pan VARCHAR,
	dry_weight_pan VARCHAR,
	pan_weight VARCHAR, 
	water_weight VARCHAR, 
	solids_dry_weight VARCHAR, 
	moisture_content VARCHAR,
	massBefore VARCHAR,
	massAfter VARCHAR, 
	sieveOpeningSize VARCHAR,
	retainedOnEachSieve VARCHAR,
	cumulativeMaterialMassRetained VARCHAR,
	cumulative_percent_retained VARCHAR,
	totalPassingSieve VARCHAR,
	blowsNo INTEGER,
	average VARCHAR,
	plastic_index VARCHAR,
	added_water VARCHAR,
	weight_mould_wet_mat VARCHAR,
	weight_mould VARCHAR,
	weight_wet_material VARCHAR,
	wet_density VARCHAR,
	volume_mould VARCHAR,
	dry_density VARCHAR,
	weight_pan_wet_mat VARCHAR,
	weight_pan_dry_mat VARCHAR,
	weight_dry_material VARCHAR,
	penetration VARCHAR,
	blows_56_reading VARCHAR,
	blows_56_load VARCHAR,
	blows_25_reading VARCHAR,
	blows_25_load VARCHAR,
	blows_10_reading VARCHAR,
	blows_10_load VARCHAR,
	swell VARCHAR,
	blows_56_swell VARCHAR,
	blows_25_swell VARCHAR,
	blows_10_swell VARCHAR,
	mouldNo VARCHAR,
	mass_mould_wet_mat VARCHAR,
	mass_mould VARCHAR,
	mass_wet_material VARCHAR,
	mould_volume VARCHAR,
	ref_proctor VARCHAR,
	percent_compaction VARCHAR,
	cbr_indice VARCHAR,
	mass_pan_wet_mat VARCHAR,
	mass_pan_dry_mat VARCHAR,
	mass_pan VARCHAR,
	mass_water VARCHAR,
	mass_dry_material VARCHAR
);

CREATE TABLE testReport (
	report_id serial PRIMARY KEY,
	test_id INT NOT NULL REFERENCES testResults ON DELETE RESTRICT,
	client_id INT NOT NULL REFERENCES reg_users ON DELETE RESTRICT,
	sample_id INT NOT NULL REFERENCES sampleSubmission ON DELETE RESTRICT,
	clientName VARCHAR ( 255 ) NOT NULL,
	clientAddress VARCHAR ( 255 ) NOT NULL,
	clientTel VARCHAR ( 255 ) NOT NULL,
	projectName VARCHAR ( 255 ) NOT NULL,
	projectLocation VARCHAR ( 255 ) NOT NULL,
	sampleName VARCHAR ( 255 ) NOT NULL,
	sampleSize VARCHAR ( 50 ) NOT NULL,
	labRefNo VARCHAR ( 50 ) UNIQUE NOT NULL,
	siteRefNo VARCHAR ( 50 ) UNIQUE NOT NULL,
	sampleSource VARCHAR ( 255 ) NOT NULL,
	samplingDate DATE NOT NULL,
	receivedDate DATE NOT NULL,
	samplingPerson VARCHAR ( 255 ) NOT NULL,
	testDescription VARCHAR ( 255 ) NOT NULL,
	testName VARCHAR ( 255 ) NOT NULL,
  	testNumber VARCHAR ( 255 ) NOT NULL,
	equipmentID VARCHAR ( 255 ) NOT NULL,
	stdMethod VARCHAR ( 255 ) NOT NULL,	
	testStartedOn DATE NOT NULL,
	testCompletedOn DATE NOT NULL,
	testResults VARCHAR ( 255 ) NOT NULL
);

test_id,client_id,sample_id,clientName,clientAddress,clientTel,projectName,projectLocation,sampleName,
            sampleSize,labRefNo,siteRefNo,sampleSource,samplingDate,receivedDate,samplingPerson,testDescription,testName,
            testNumber,equipmentID,stdMethod,	testStartedOn,testCompletedOn,testResults

ALTER TABLE testReport 
ADD COLUMN preparedBy VARCHAR, authorizedBy VARCHAR;

CREATE TABLE staff (
	staff_id serial PRIMARY KEY,
	name VARCHAR ( 255 ) NOT NULL,
	email VARCHAR ( 100 ) UNIQUE NOT NULL,
    phone INTEGER UNIQUE NOT NULL,
	password VARCHAR ( 255 ) NOT NULL,
	role VARCHAR ( 255 ) NOT NULL,
	resetPassword VARCHAR
);

ALTER TABLE userRoles
ADD COLUMN resetToken VARCHAR;

name,email,phone,password,role

	Super Admin
    Lab technician
    Senior Engineer
    RTDA Manager
    Local user
    Lab Director

CREATE TABLE requests (
	request_id serial PRIMARY KEY,
	user_id INT NOT NULL REFERENCES reg_users ON DELETE RESTRICT,
	clientName VARCHAR ( 255 ) NOT NULL,
	clientAddress VARCHAR ( 255 ) NOT NULL,
	clientTel INTEGER NOT NULL,
	companyName VARCHAR ( 255 ) NOT NULL,
	companyAddress VARCHAR ( 255 ) NOT NULL,
	companyTel INTEGER NOT NULL,
	projectName VARCHAR ( 255 ) NOT NULL,
	testType VARCHAR ( 255 ) NOT NULL,
	paramsType VARCHAR ( 255 ) NOT NULL,
	customerCategory VARCHAR ( 255)  NOT NULL,
	approved VARCHAR DEFAULT 'No',
	submittedDate DATE NOT NULL DEFAULT CURRENT_DATE
);

clientName,clientAddress,clientTel,companyName,companyAddress,companyTel,projectName,testType,paramsType,customerCategory









