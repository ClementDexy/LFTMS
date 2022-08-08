
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const { pool } = require('./config/dbConnection');
const registerUser = require('./routes/registration');
const loginUser = require('./routes/login');
const flash = require('express-flash');
const session = require('express-session');
const helmet = require("helmet");
const jwt = require('jsonwebtoken');
const cors = require('cors');

const sampleSubmission = require('./routes/staffDashboard/sampleSubmission');
const testReport = require('./routes/testReport');
const staff = require('./routes/admin');
const staffLogin = require('./routes/staff');
const { authUser,authRole,authStaff } = require('./middlewares/auth');
const requests = require('./routes/request');
const forgotPassword = require('./routes/passwordReset/users/forgotPassword');
const resetPassword = require('./routes/passwordReset/users/resetPassword');
const uploadProfilePic = require('./routes/profilePic');

app.use((req,res,next)=>{ 
res.setHeader('Access-Control-Allow-Origin','*'); 
res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE'); 
res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization','json'); 
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
app.use('/testresults',testReport);
app.use('/staff/register',staff);
app.use('/staff/login',staffLogin);
app.use('/forgot-password',forgotPassword);
app.use('/reset-password',resetPassword);
app.use('/profile/upload',uploadProfilePic);

// Pages

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
