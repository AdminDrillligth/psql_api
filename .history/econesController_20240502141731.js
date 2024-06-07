var express = require('express');
var router = express.Router();
const { pool } = require("./db");
var jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
var DateString = new Date().toLocaleDateString('en-GB');
var isoDateString = new Date().toISOString();

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();

});

router.get('/', function(req, res) {
	console.log('econes')
  res.status(200).json({
       response: {
          result: 'econes',
          message: 'aucun utilisateur'
       },
  });
});


router.post('/createEcone', function(req, res) {
        let newUuid = uuidv4();
        let reqs = req;
        let headers = reqs.headers;
        let token = headers.token;

        let bodyOfRequest = req.body;
        let data = bodyOfRequest.data;
        let EconeObject = {
    	id:data.serial, // STATIC 
    	uniqueId:newUuid, // STATIC
    	qr:newUuid, // STATIC 
    	qrUrl:'', // STATIC
    	creationDate: DateString, // STATIC
    	creationDateIso: isoDateString, // STATIC
    	account : data.selectedAccount,
    	// customerId:data.idOfCustomer, // ADMIN
    	name: '', // SYNC
    	avatarImages:'', // SYNC
    	asMaster:data.asMaster, // SYNC
    	// SSID:data.SSID, // SYNC
    	// passwordSSID: data.passwordSSID, // SYNC
    	firmware:data.firmware, // SYNC
    	lastFirmwareUpdate:'', // SYNC
    	lastUseDate:'', // SYNC
    	lastUseDateIso:'', // SYNC
        };
            return res.status(200).json({
      	response: {
        	result:'success',
        	message:''
      	},
      	//ListEcones: AllEcones
            });

});


router.get('/getEconeDetails', function(req, res) {
    return res.status(200).json({
      	response: {
        	result:'success',
        	message:''
      	},
      	//ListEcones: AllEcones
    });
});


module.exports = router;
