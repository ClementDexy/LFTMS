
const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    res.clearCookie('remember_me');
    req.logout();
    req.session = null;
    req.session.destroy();
    res.redirect('/');
   })

   module.exports = router;