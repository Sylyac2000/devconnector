const jwt = require('jsonwebtoken');
const config = require('config');

/*a middleware function is a function that
//have access to the request / response objects
//move to next callback after */
module.exports = function (req, res, next) {
    //get token from header
    const token = req.header('x-auth-token');

    //check if no token
    if(!token) {
        //not authorize
        return res.status(401).json({msg:'no token, autorisation réfusée'});
    }
    //verify token
    try{
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    } catch (e) {
        res.status(401).json({msg: 'token invalide'})
    }
};
