const { User } = require('../models/user');
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);
const _ = require('lodash');

exports.signup = (req, res) => {
    const user_data = _.pick(req.body, ['name', 'mobile_number']);
    
    var user = new User(user_data);

    user.save().then(() => {
        var response = {
            status: 'success',
            message: 'User successfully created'
        };
        res.send(response);
    }).catch(err => {
        var response = {
            status: 'failure',
            message: 'Failed to signup user :' + err.message
        };
        res.send(response);
    });
};

exports.login = (req, res) => {
    const mobile = _.pick(req.body, ['mobile_number']);
    
    User.findByMobile(mobile).then((user) => {
        const otp = Math.round(Math.random()*9000 + 1000);
        User.updateOTPOnDatabase(user.mobile_number, otp).then(res => {
            client.messages.create({
                body:'Your OTP for login on SPOTBook is ' + otp,
                from: '+13343423590',
                to:'+91' + user.mobile
            }).then(message => {
                    var response = {
                        status: 'success',
                        message: 'OTP sent'
                    };
                    console.log(message.sid);
                    res.send(response);
                })
                .catch(err => {
                    console.log("Error sending otp " + err);
                    var response = {
                        status: 'failure',
                        message: 'Error sending OTP : ' + err.message
                    };
                    res.send(response);
                });
        }).catch(err => {
            var response = {
                status: 'failure',
                message: err.message
            };
            res.send(response);
        });
   
    }).catch(err => {
        var response = {
            status: 'failure',
            message: err.message
        }
        res.send(response);
    });
    
};

exports.verifyOTP = (req, res) => {
    const body = _.pick(req.body,['otp', 'mobile_number']);

    User.verifyOTP(body.otp, body.mobile_number).then(user => {
        return user.generateAuthToken().then(token => {
            var response = {
                status: 'success',
                message: 'authentication successful',
                data: user
            };
            res.cookie('x-auth',token).send(response);
        });
        
    }).catch(err => {
        var response = {
            status: 'failure',
            message: err.message
        }
    })

};

