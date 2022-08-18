
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_ADMIN_SECRET;


async function authStaff(req, res, next) {
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined") {

        const bearerToken = bearerHeader.split(" ")[1];

        req.token = bearerToken;
        jwt.verify(req.token, secretKey, async (err, decoded) => {
            if (err) {
                res.sendStatus(403);
            } else {
                next();
                return decoded    
            }
        });
    }
    else {
        res.sendStatus(403);
    }
  }


function authRole(role) {
    return async (req, res, next) => {
        const bearerHeader = req.headers["authorization"];

        if (typeof bearerHeader !== "undefined") {

            const bearerToken = bearerHeader.split(" ")[1];

            req.token = bearerToken;
            jwt.verify(req.token, secretKey, async (err, decoded) => {
                if (err) {
                    res.sendStatus(403);
                } else {
                    if(role === decoded.role){
                        next();
                        return decoded  
                    }
                    else{
                        // res.status(403).send('No no no');
                        res.sendStatus(403);
                    }
                        
                }
            });

            // next();
        }
            else {
                res.sendStatus(403);
            }
        }
  }

    module.exports = { authStaff,authRole }
    
    
