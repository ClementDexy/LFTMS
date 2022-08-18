const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;

const authUser = async (req, res, next) => {
    
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

module.exports = authUser;