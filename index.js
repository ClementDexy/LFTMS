
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const { pool } = require('./config/dbConnection');
const registerUser = require('./routes/user/registration');
const loginUser = require('./routes/user/login');
const flash = require('express-flash');
const session = require('express-session');
const helmet = require("helmet");
const jwt = require('jsonwebtoken');
const cors = require('cors');

const sampleSubmission = require('./routes/staffDashboard/sampleSubmission');
// const testReport = require('./routes/testReport');
const authUser = require('./middlewares/userAuth');
const {authStaff, authRole} = require('./middlewares/adminAuth');
const staff = require('./routes/staff/admin');
const staffLogin = require('./routes/staff/staff');
const requests = require('./routes/user/request');
const userRequests = require('./routes/staffDashboard/userRequests');
const userForgotPassword = require('./routes/passwordReset/users/forgotPassword');
const userResetPassword = require('./routes/passwordReset/users/resetPassword');
const staffForgotPassword = require('./routes/passwordReset/admin/forgotPassword');
const staffResetPassword = require('./routes/passwordReset/admin/resetPassword');
const uploadProfilePic = require('./routes/profilePic');
const testResultsAC = require('./routes/testResults/aggregateConcrete');
const testResultsAB = require('./routes/testResults/asphaltBitumen');
const testResultsSoil = require('./routes/testResults/soil');
const logout = require('./routes/logout');

app.use((req,res,next)=>{ 
res.setHeader('Access-Control-Allow-Origin','*'); 
res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE'); 
res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization','json'); 
res.header("Access-Control-Allow-Credentials", true);
next(); 
})
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000}, //, secure: true 
    rolling: false
}))

// Middlewares 
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.set('view engine', 'ejs');

app.use('/users/register', registerUser);
app.use('/users/login', loginUser);
app.use('/users/requests',requests);
app.use('/samples',sampleSubmission);
app.use('/staff/userRequests',userRequests);
// app.use('/testresults',testReport);
app.use('/staff/register',staff);
app.use('/staff/login',staffLogin);
app.use('/users/forgot-password',userForgotPassword);
app.use('/users/reset-password',userResetPassword);
app.use('/staff/forgot-password',staffForgotPassword);
app.use('/staff/reset-password',staffResetPassword);
app.use('/profile/upload',uploadProfilePic);
app.use('/testResults/aggregateConcrete',testResultsAC);
app.use('/testResults/asphaltBitumen',testResultsAB);
app.use('/testResults/soil',testResultsSoil);
app.use('/logout',logout);

// Pages for Test purposes

app.get('/', async (req, res) => {   
    try {
        res.render('index');
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
}); 

app.get('/profile/upload', async (req, res) => {   
    try {
        res.render('profilePic');
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});  

app.get('/test', async (req, res) => {   
  try {
      res.render('test');
  } catch (e) {
      res.status(400).send('Error: ' + e.message);
      console.log('Error: ' + e.message);
  }
});     

app.get('/users/register', async (req, res) => {   
    try {
        res.render('registerPage');
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});

app.get('/users/login', async (req, res) => {   
    try {
        res.render('loginPage');
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});

app.get('/requests', async (req, res) => {   
    try {
        res.render('request');
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
}); 

app.get('/users/dashboard', authUser, async (req, res) => {   
    try {
        res.render('dashboardPage',{ user: req.session.firstName });
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});

  app.get('/users/logout', (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.flash('success_msg', 'session terminated, Login again');
      res.redirect('/users/login');
      session.destroy();
    });
  });

  app.get('/staff/registration',authStaff,authRole('admin'), async (req, res) => {   
    try {
        res.render('staffReg');
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});

app.get('/staff/login', async (req, res) => {   
    try {
        res.render('staffLogin');
    } catch (e) {
        res.status(400).send('Error: ' + e.message);
        console.log('Error: ' + e.message);
    }
});



const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
pool.connect();
