var express = require('express');
var router = express.Router();
const { pool } = require("./db");
var jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
var _ = require('lodash');

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
		var DateString = new Date().toLocaleDateString('en-GB');
		var isoDateString = new Date().toISOString();
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
		try{
			// sign token
			jwt.verify(token, 'secret', { expiresIn: '30d' }, async function(err, decoded) {
			  if(err) {
				return res.status(200).json({
				  response: {
					result:'expiredTokenError',
					message:'Votre token a expiré'
				  },
				});
			  }else {
				return res.status(200).json({
					response: {
					  result:'success',
					  message:''
					},
						//ListEcones: AllEcones
			  	});
			  }
			})
		}catch(error){ return res.status(500).json(error.message) }
});


router.get('/getEconeDetails', function(req, res) {
	try{
		// sign token
		jwt.verify(token, 'secret', { expiresIn: '30d' }, async function(err, decoded) {
		  if(err) {
			return res.status(200).json({
			  response: {
				result:'expiredTokenError',
				message:'Votre token a expiré'
			  },
			});
		  }else {
			return res.status(200).json({
				response: {
				  result:'success',
				  message:''
				},
				//ListEcones: AllEcones
		  	});
		  }
		})
	}catch(error){ return res.status(500).json(error.message) }
});


module.exports = router;
