
async function authUser(req, res, next) {
    try {
    if (! (req.session && req.session.userId)){
      return res.redirect('/users/login');
  }
  else{
    next();
  }
        
    } catch (error) {
        res.status(401).send('You need to login first')
        // res.status(400).send('Error: ' + error.message);
    }
  }

  async function authStaff(req, res, next) {
    try {
    if (!(req.session.staffId && req.session.staffRole)){
      return res.redirect('/staff/login');
  }
  else{
    next();
  }
        
    } catch (error) {
        res.status(401).send('You need to login first')
        // res.status(400).send('Error: ' + error.message);
    }
  }
  
   function authRole(role) {
    try {
        return async (req, res, next) => {
            if (req.session.staffRole !== role) {
              res.status(401)
              return res.send('Not allowed')
            }
            next()
          }
        
    } catch (error) {
        res.status(401).send('You are not allowed to access this')
        // res.status(400).send('Error: ' + error.message);
    }
  }
  
  module.exports = {
    authUser,
    authRole,
    authStaff
  }