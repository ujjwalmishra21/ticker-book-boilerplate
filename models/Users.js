const {mongoose} = require('../db/mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcryptjs = require('bcryptjs');


var UserSchema = new mongoose.Schema({

})





var User = mongoose.model('User', UserSchema);


module.export = {
	User
}




