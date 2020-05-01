const express = require('express');
const bodyParser = require('body-parser');

const server = express();

const PORT = process.env.PORT


server.use(bodyParser.urlencoded({extended:true}));
server.use(bodyParser.json());

const homeController = require('./controllers/homeController');

server.get('/', homeController.getHome);










server.listen(PORT,()=>{
	console.log(`Server started at ${PORT}`)
})



