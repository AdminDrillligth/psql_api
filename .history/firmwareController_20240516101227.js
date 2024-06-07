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
	console.log('firmware')
  res.status(200).json({
       response: {
          result: 'firmware',
          message: 'aucun utilisateur'
       },
  });
});

router.post('/createFirmware', function(req, res) {
  let newUuid = uuidv4();
  let reqs = req;
  let headers = reqs.headers;
  let token = headers.token;
  let body = req.body;
  // console.log('test Body',body)
  console.log('log token',token)
  // const json = JSON.parse(body);
  let idUser = body.id;
  // // let userDetail :any = '';
  let firmwareData = body.firmwareData;
  let privated = body.privated;
  // // let BuildNumber = 1;
  // let globalHandler  = [];
  // console.log('JSON ', json);
  console.log('idUser ', idUser);
  console.log('firmwareData ', firmwareData);
  console.log('private', privated);
  //  if(privated == false){
  
    // const querySnapshotGlobalHandler = await db.collection('global_handler').get();
    // querySnapshotGlobalHandler.forEach((doc: any) => {
    //   globalHandler.push(doc.data());
    // });

    // BuildNumber = globalHandler[0].lastFirmwareBuildNumber +1;
    // globalHandler[0].publicFirmwareId = newUuid;
    // globalHandler[0].publicFirmwareBuildNumber = globalHandler[0].lastFirmwareBuildNumber +1;
    // globalHandler[0].lastFirmwareBuildNumber = globalHandler[0].lastFirmwareBuildNumber +1;
      // const entry = db.collection('firmware-handler')
      // await entry.doc(newUuid).set(firmwareObject).then( async (ref:any) => {
        // const global_handler = db.collection('global_handler');
        // global_handler.doc("9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d").set(globalHandler[0]);
        
      // });

    try {
      jwt.verify(token, 'secret', { expiresIn: '30d' }, async function(err, decoded) {
        if(err) {
          return res.status(200).json({
            response: {
              result:'expiredTokenError',
              message:'Votre token a expiré'
            },
          });
         }else {
          // no error token
          firmwareObject = {
            id:newUuid,
            version:firmwareData.version,
            description:firmwareData.comment,
            creationDate:isoDateString,
            firmwareData:firmwareData.base64,
          };

          const res = await pool.query( "INSERT INTO firmware_handler ( id, creationdate, description, firmwaredata, version ) VALUES ($1, $2,$3, $4,$5) RETURNING *",
            [firmwareObject.id,  firmwareObject.creationdate, firmwareObject.description, firmwareObject.firmwaredata, firmwareObject.version ]
          , (error, results) => {
            if (error) {console.log(error) }
    	      console.log(`User added with ID: ${results.rows}`);
            return res.status(200).json({
              response: {
                result:'success',
                message:''
              },        
              // id:body.id,
              // private:privated,
              // newUuid:newUuid,
              firmwareObject:firmwareObject,
            });
	        });
         }
      })    
    } catch (error) {
      console.log(error) 
    }
});


router.post('/updateGlobalFirmware', function(req, res) {
	console.log('firmware')
  let reqs = req;
  let bodys = reqs.body;
  let globalHandler = [];
  // let headers = reqs.headers;
  // let token = headers.token;
  // let idFirmware = headers.idfirmware;

  // const querySnapshotGlobalHandler = await db.collection('global_handler').get();
  // querySnapshotGlobalHandler.forEach((doc: any) => {
  //   globalHandler.push(doc.data());
  // });
  // // BuildNumber = globalHandler[0].lastFirmwareBuildNumber +1;
  // globalHandler[0].publicFirmwareId = newUuid;
  try {
    // sign token
    jwt.verify(token, 'secret', { expiresIn: '24h' }, async function(err, decoded) {
      if(err) {
        return res.status(200).json({
          response: {
            result:'expiredTokenError',
            message:'Votre token a expiré'
          },
        });
       }else {
        // no error token
        return res.status(200).json({
          response: {
            result:'success',
            message:'Mise à jour du firmware global effectuée'
          },        
          // newfirmwareid:bodys.headers.firmwareid

        });
       }
    
    })
        // const querySnapshotGlobalHandler = await db.collection('global_handler').get();
        // querySnapshotGlobalHandler.forEach((doc: any) => {
        //   globalHandler.push(doc.data());
        // });
        // globalHandler[0].publicFirmwareId = bodys.headers.firmwareid;
        // const global_handlerData = db.collection('global_handler');
        // global_handlerData.doc("9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d").set(globalHandler[0]);

  //   }
  // })
  }
  catch(error) { return res.status(500).json(error.message) }
});


router.get('/getFirmware', function(req, res) {
	console.log('firmware')
  let reqs = req;
  let headers = reqs.headers;
  let token = headers.token;
  let idUser = headers.id;
  // let globalFirmwareChangeCount =  headers.globalfirmwarechangecount;
  // globalFirmwareChangeCount = Number(globalFirmwareChangeCount);
  let firmwareId = headers.firmwareid;
  let globalHandler = [];
  let lastPublicFirmwareId = "";
  let userDetail  = '';
  let firmwareDetail = [];
  try {
    jwt.verify(token, 'secret', { expiresIn: '30d' }, async function(err, decoded) {
      if(err) {
        return res.status(200).json({
          response: {
            result:'expiredTokenError',
            message:'Votre token a expiré'
          },
          token:token,
        });
       }else {
        // no error token

       }
    })
  }catch(error){
    console.log(error)
  }
});


router.get('/getFirmwaresList', function(req, res) {
	console.log('firmware List')
  let token = headers.token;
  let firmwareList = [];
  try{

    jwt.verify(token, 'secret', { expiresIn: '30d' }, async function(err, decoded) {
      if(err) {
        return res.status(200).json({
          response: {
            result:'expiredTokenError',
            message:'Votre token a expiré'
          }
        });
       }else {
        // no error token
        // let firmwareHandler = await db.collection('firmware-handler').get();
        // firmwareHandler.forEach((firmware)=>{
        //   firmwareList.push(firmware.data());
        // })
        return res.status(200).json({
          response: {
            result:'success',
            message:''
          },
          // firmwareList:firmwareList
          // idUser:idUser,
          // lastPublicFirmwareChangeCount:lastPublicFirmwareChangeCount,
          // firmwareDetail:firmwareDetail
        });
    }
  });
  }
  catch(error) { return res.status(500).json(error.message) }
});


router.get('/getFirmwareDetails', function(req, res) {
	console.log('firmware Details');
  let reqs = req;
  let headers = reqs.headers;
  let firmwareDetail= "";
  let token = headers.token;
  let firmwareId = headers.firmwareid;

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
        // no error
        // let firmwareHandler = await db.collection('firmware-handler').where('id', '==', firmwareId).get();
        // firmwareHandler.forEach(async (doc:any) =>{
        //   firmwareDetail = doc.data()
        // });
        return res.status(200).json({
          response: {
            result:'success',
            message:''
          },
          // firmwareDetail:firmwareDetail
        });
    }
  })
  }
  catch(error) { return res.status(500).json(error.message) }
 
 
});


router.get('/getGlobalFirmware', function(req, res) {
	console.log('firmware GLOBAL')
  let globalHandler = [];
  let firmwareDetail= "";
  let reqs = req;
  let headers = reqs.headers;
  let token = headers.token;
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
        // no error
        // if(idUser !== undefined){
        // const querySnapshotGlobalHandler = await db.collection('global_handler').get();
        // querySnapshotGlobalHandler.forEach((doc: any) => {
        //   globalHandler.push(doc.data());
        // });
        // let firmwareHandler = await db.collection('firmware-handler').where('id', '==', globalHandler[0].publicFirmwareId).get();
        // firmwareHandler.forEach(async (doc:any) =>{
        //   firmwareDetail = doc.data()
        // });
        // 
      // }
      return res.status(200).json({
        response: {
          result:'success',
          message:''
        },
        // globalFirmware:firmwareDetail
      });
    }
  })
  }
  catch(error) { return res.status(500).json(error.message) } 
});



module.exports = router;
