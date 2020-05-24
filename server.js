const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const server = express();

const PORT = process.env.PORT


server.use(bodyParser.urlencoded({extended:true}));
server.use(bodyParser.json());
server.use(cookieParser());
server.use(cors({
	exposedHeaders: ['x-auth'],
	credentials: true
}))

const homeController = require('./controllers/home');
const loginController = require('./controllers/login');
const storeController = require('./controllers/stores');
const bookingController = require('./controllers/booking');

const {authenticate} = require('./middlewares/authenticate');


server.post('/signup', loginController.signup);
server.post('/login', loginController.login);
server.post('/login/verify-otp', loginController.verifyOTP);

server.get('/', authenticate(['0','1','2']), homeController.getHome);

server.post('/addStore', authenticate(['0','1']), storeController.addStore);
server.get('/getStores', authenticate(['0','2']), storeController.getStores);

server.post('/createBooking', authenticate(['0','2']), bookingController.createBooking);
server.get('/getBooking', authenticate(['0','1','2']), bookingController.getBooking);


server.listen(PORT,()=>{
	console.log(`Server started at ${PORT}`)
})



