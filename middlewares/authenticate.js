const { User } = require('../model/user');

const authenticate = (req, res, next)  => {
    
    var token = req.cookies['x-auth'];
        
    User.findByToken(token).then(user => {
        if(!user){
            return Promise.reject();
        }
        req.user = user;
        next();
            
    }).catch(err => {
        console.log(err);
        var response = {
            status:'failure',
            message: err.message
        };
        res.status(401).send(response);
    })
};

module.exports = {
    authenticate
}