const {mongoose} = require('../db/mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


var UserSchema = new mongoose.Schema({
	mobile_number: {
		type: Number,
		// match: /^[1-9]\d{9}/,
		required:true,
		min:1000000000,
		max:9999999999
	},
	name: {
		type: String,
		required: true
	},
	otp:[{
		value:{
			type: String,
	
		},
		createdAt:{
			type: Date,
	
		} 
	}]
})


UserSchema.methods.generateAuthToken = function() {
	var user = this;
	
	var timestamp = Date.now();
	var token = jwt.sign({'_id': user._id.toHexString(), timestamp}, process.env.JWT_SECRET).toString();

	return token;	
};

UserSchema.statics.findByToken = function(token) {

	var user = this;
	try{
		var decoded = jwt.verify(token, process.env.JWT_SECRET);
	}catch(err){
		return Promise.reject();
	}

	return user.findOne({'_id': decoded._id});
};

UserSchema.statics.findByMobile = function(data) {
	var User = this;

	return User.findOne({'mobile_number':data['mobile_number']}).then(user => {

		return new Promise((resolve,reject)=>{
			if(user)
				resolve(user);
			else
				reject(new Error('No user found'));
		});
			
	}).catch(err=>{
		return Promise.reject(new Error('Database error'));
	});
};

UserSchema.statics.updateOTPOnDatabase = async function(mobile, otp){
	var user = this;
	var createdAt = new Date();

	otp = otp.toString();
	
	var salt = await bcrypt.genSalt(10);
			
	var value = await bcrypt.hash(otp, salt);
		
	return user.findOneAndUpdate({'mobile_number': mobile}, {'otp':[{ value, createdAt}]}, (err,res) => {
			console.log("OTP:" + res);
			return new Promise((resolve, reject) => {
				if(res)
					resolve(res);
				else
					reject(new Error(err.message));
						
		})
	})		
}	


UserSchema.statics.verifyOTP = async function(data){
	var User = this;
	
	var user = await User.findOne({'mobile_number': data['mobile_number']});
		
	if(!user){
		var err = new Error('User not found');
		return Promise.reject(err);
	}
	var time_difference = (new Date() - user.otp[0].createdAt)/(60*1000);
	var result = false;

	if(time_difference <= 10){
		result = await bcrypt.compare(data['otp'], user.otp[0].value);	
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
	})
	
}

var User = mongoose.model('User', UserSchema);

module.exports = {
	User
}




