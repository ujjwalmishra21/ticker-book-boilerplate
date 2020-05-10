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
	var value = 0;
	bcrypt.genSalt(10, function(err, salt){
		bcrypt.hash(otp, salt, function(err, hash){
			value = hash;			
		});
	})

	console.log(value);
	user.findOneAndUpdate({'mobile_number': mobile}, {'otp':[{ value, createdAt}]}, (err,res) => {
		
		return new Promise((resolve, reject) => {
			if(res)
				resolve(res);
			else{
				reject(new Error("ERROR::" + err.message));
			}
		})
	})

}

UserSchema.statics.verifyOTP = function(mobile, otp){
	var User = this;
	
	User.findOne({'mobile_number': mobile}).then(user => {

		return new Promise((resolve, reject) => {
			if(!user){
				var err = new Error('User not found');
				reject(err);
			}
			var time_difference = (new Date - user.otp[0].createdAt)/(60*1000);
			if(time_difference < 10){
				bcrypt.compare(otp, user.otp[0].value, (err, res) => {
					if(res)
						resolve(user);
					else {
						var err = new Error('Incorrect OTP');
						reject(err);
					}
				});

			}else{
				var err = new Error('OTP expired');
				reject(err);
			}

		})
	})
}

// UserSchema.pre('save', function(next){
// 	var user = this;
// 	bcrypt.genSalt(10, function(err, salt){
// 		bcrypt.hash(user.otp[0].value, salt, function(err, hash){
// 			user.otp[0].value = hash;
// 		});
// 	});
	
// 	next();
// })

var User = mongoose.model('User', UserSchema);


module.exports = {
	User
}




