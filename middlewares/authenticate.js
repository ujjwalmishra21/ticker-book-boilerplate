const { User } = require('../model/user');

const authenticate = (roles) => {
  
    return (req, res, next)  => {
        
        var token = req.cookies['x-auth'];
            
        User.findByToken(token).then(user => {
            
            if(!user){
                return Promise.reject();
            }
            
            if(roles.includes(user.type)){
                req.user = user;
                next();
            }else{
                var response = {
                    status:'failure',
                    message: 'Access denied'
                }
                res.status(403).send(response);
            }
                
        }).catch(err => {
            console.log(err);
            var response = {
                status:'failure',
                message: err.message
            };
            res.status(401).send(response);
        })
    }
}

module.exports = {
    authenticate
}