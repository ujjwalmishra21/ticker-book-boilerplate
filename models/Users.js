const {mongoose} = require('../db/mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


var UserSchema = new mongoose.Schema({
	mobile_number: {
		type: Number,
		required:true,
		min: 10,
		max: 10
	},
	name: {
		type: String,
		required: true
	},
	otp:[{
		value:{
			type: String,
			required: true
		},
		createdAt:{
			type: Date,
			required: true
		} 
	}]
})

UserSchema.methods.generateAuthToken = function() {
	var user = this;
	var access = 'auth';
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

UserSchema.statics.findByOTP = function(mobile_number_entered) {
	var user = this;
	user.findOne({'mobile_number':mobile_number_entered}).then(user => {
		if(!user){
			Promise.reject();
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(otp_entered, user.otp[0].value, (err, res) => {
				if(res)
					resolve(user);
				else 
					reject();
			});
		});
		
	});
};

UserSchema.pre('save', function(next){
	var user = this;
	bcrypt.genSalt(10, function(err, salt){
		bcrypt.hash(user.otp[0].value, 10, function(err, hash){
			user.otp[0].value = value;
		});
	});
	
	next();
})

var User = mongoose.model('User', UserSchema);


module.export = {
	User
}




