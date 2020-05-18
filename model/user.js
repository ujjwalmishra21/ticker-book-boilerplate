const { Sequelize, sequelize } = require('../db/sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Store } = require('./store');

const Model = Sequelize.Model;

/*
    User Types::
    admin - 0 
    store - 1
    customer - 2
*/

class User extends Model {}
User.init({
    user_id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        required: true,
        allowNull: false
    },
    mobile_number:{
        field:'mobile_number',
        required: true,
        type: Sequelize.BIGINT(10),
        unique:true,
        allowNull: false,
        is:/^[1-9]\d{9}$/g,
    },
    type:{
        type: Sequelize.ENUM('0','1','2'),
        required: true,
        allowNull: false,
        defaultValue: '1'
    },
    otp:{
        type: Sequelize.STRING,
    }
},{ 
    sequelize,
    modelName:'user',
    underscored: true,
    timestamps: true
});

User.findByToken = function(token){
    var user = this;
    var decoded;
    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    }catch(err){
        return Promise.reject(new Error(err.message));
    }
    return user.findOne({
        where: {'user_id': decoded.user_id}
    });
};

User.findByMobile = function(data){
    var User = this;

    return User.findOne({
            where:{'mobile_number':data['mobile_number']}
        }).then(user => {

            return new Promise((resolve,reject)=>{
                if(user)
                    resolve(user);
                else
                    reject(new Error('No user found'));
            });
            
        }).catch(err=>{
            return Promise.reject(new Error('Database error:' + err.message));
    });
};

User.updateOTPOnDatabase = async function(mobile, otp){
    var user = this;
    var updated_at = new Date();

    otp = otp.toString();
    var salt = await bcrypt.genSalt(10);
    var otp_hash = await bcrypt.hash(otp, salt);
        
    return user.findOne({
            where:{'mobile_number': mobile}
        }).then(async (user) => {
            user.otp = otp_hash;
            user.updated_at = updated_at;
            await user.save();

            return new Promise((resolve, reject) => {
                    
                if(user)
                    resolve(user);
                else
                    reject(new Error(err.message));
                            
            }).catch(err => {
            return Promise.reject(new Error('Database error:' + err.message));
        })
    });
};

User.verifyOTP = async function(data){
    var User = this;
    
    var user = await User.findOne({
        where: { 'mobile_number': data['mobile_number']}
    });
  
    if(!user){
        var err = new Error('User not found');
        return Promise.reject(err);
    }
  
    var time_difference = (new Date() - user.updated_at)/(60*1000);
    var result = false;
    
    if(time_difference <= 10){
        result = await bcrypt.compare(data['otp'], user.otp);	
    }else{
        var err = new Error('OTP expired');
        return Promise.reject(err);
    }

    var token = await user.generateAuthToken();
    
    return new Promise((resolve, reject) => {
        
        if(result){
            var resp_data = {
                token,
                user
            }
            resolve(resp_data);
        }else {
            var err = new Error('Incorrect OTP');
            reject(err);
        }
    });
};

User.prototype.generateAuthToken = function(){
    var user = this;
    var timestamp = Date.now();
    var token = jwt.sign({'user_id': user.user_id.toString(), timestamp}, process.env.JWT_SECRET).toString();

    return token;	
};


module.exports = {
    User
}
