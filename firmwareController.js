var express = require('express');
var router = express.Router();
const { pool } = require("./db");
var jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');


router.use(function timeLog(req, res, next) {
  console.log('Time Firmware Function : ', new Date().toLocaleDateString('en-GB'));
  
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
  var DateString = new Date().toLocaleDateString('en-GB');
  var isoDateString = new Date().toISOString();
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
  // console.log('idUser ', idUser);
  console.log('firmwareData ', firmwareData);
  console.log('firmwareData BASE 64', firmwareData.base64);
  // console.log('private', privated);
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
            creationdate:isoDateString,
            firmwaredata:firmwareData.base64,
          };

          const res = await pool.query( "INSERT INTO firmware_handler ( id, creationdate, description, firmwaredata, version ) VALUES ($1, $2,$3, $4, $5) RETURNING *",
            [firmwareObject.id,  firmwareObject.creationdate, firmwareObject.description, firmwareObject.firmwaredata, firmwareObject.version ], (error, resultsFirm) => {
            if (error) {console.log(error) }

    	      console.log(`resultsFirm added Object details: ${resultsFirm}`);
            console.log(`resultsFirm added with ID: ${resultsFirm}`,'color: #bada55');
	        });
         }
      })    
    } catch (error) {
      console.log(error) 
    }
});


router.post('/updateGlobalFirmware', function(req, res) {
	console.log('firmware update global')
  let reqs = req;
  let bodys = reqs.body;
  let globalHandler = [];
  let token = bodys.token;
  let firmwareid = bodys.firmwareid
  console.log('token global : ',token )
  console.log('firmwareid global : ',firmwareid )
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
        const lastpublicchangecount = await pool.query('SELECT publicfirmwareid FROM global_handler', async (error, globalpublicFirmwareId) => {
          if (error) {
            console.log(error)
          }
          console.log('globalpublicFirmwareId',globalpublicFirmwareId.rows[0].publicfirmwareid)

          const responseOfUpdate = pool.query('UPDATE global_handler SET publicfirmwareid = $1 WHERE id = $2',
            [firmwareid, "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"],
            (error, resultsOfUpdateGlobal) => {
              if (error) {
                throw error
              }
              console.log('firmwareid modified with ID:',resultsOfUpdateGlobal.rowCount)
              return res.status(200).json({
                response: {
                  result:'success',
                  message:'Mise à jour du firmware global effectuée'
                },        
                globalfirmwareid:firmwareid
      
              });
            })
          
        })
        // no error token
        
       }
    
    })
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
        console.log('LE ID DU USER POUR LE FIRMWARE: ! ',idUser)
        const resSelect = await pool.query('SELECT * FROM account_handler WHERE id = $1',[idUser], async (error, results) => {
          if (error) {
            console.log(error)
          }

          if(results.rowCount === 0){
            res.status(200).json({
              response: {
                result: 'noAccountError',
                message: 'aucun utilisateur'
              },
            });
          }
          if(results.rowCount === 1){
            if(results.rows[0].privatefirmwareid !== ""){
              // Le private Firmware Id ! 
              firmwareId = results.rows[0].privatefirmwareid;
              console.log('RESULTS :we get resp GET FIRMWARE OF : !', results.rows[0].privatefirmwareid)
              return res.status(200).json({
                response: {
                  result:'success',
                  message:''
                },
                // firmwareList:firmwareList
                idUser:idUser,
                // lastPublicFirmwareChangeCount:lastPublicFirmwareChangeCount,
                firmwareDetail:results.rows[0].privatefirmwareid
              });
            }else{
              // on get le global firmware ! 
              const lastpublicchangecount = await pool.query('SELECT publicfirmwareid FROM global_handler', async (error, publicFirmwareId) => {
                if (error) {
                  console.log(error)
                }
                console.log('ID DU FIRMWARE GLOBAL: ',publicFirmwareId.rows[0])
                
                const resSelectGlobal = await pool.query('SELECT * FROM firmware_handler WHERE id = $1',[publicFirmwareId.rows[0].publicfirmwareid], (error, selectFirmware) => {
                  console.log(selectFirmware.rows[0].firmwaredata.firmwareObject)
                  let firmware = {creationDate :selectFirmware.rows[0].firmwaredata.firmwareObject.creationdate, description:selectFirmware.rows[0].firmwaredata.firmwareObject.description,firmwareData:selectFirmware.rows[0].firmwaredata.firmwareObject.firmwaredata, version:selectFirmware.rows[0].firmwaredata.firmwareObject.version, id:selectFirmware.rows[0].firmwaredata.firmwareObject.id}
                  if (error) {
                    console.log(error)
                  }
                  if(results.rowCount === 1){
                    console.log(selectFirmware.rows[0]);
                    return res.status(200).json({
                      response: {
                        result:'success',
                        message:''
                      },
                      // firmwareList:firmwareList
                      idUser:idUser,
                      // lastPublicFirmwareChangeCount:lastPublicFirmwareChangeCount,
                      firmwareDetail:firmware
                    });
                  }
                  
                })
                
                
              })
            }
            
          }
        })

       }
    })
  }catch(error){
    console.log(error)
  }
});


router.get('/getFirmwaresList', function(req, res) {
	console.log('firmware List')
  let reqs = req;
  let headers = reqs.headers;
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
        const resSelect = await pool.query('SELECT * FROM firmware_handler', async (error, resultsFirmwareList) => {
          if (error) {
            console.log('error no account: ! ', error)
          }
          if(resultsFirmwareList.rowCount > 0 ){
            // console.log('nous avons des firmwares ! ', resultsFirmwareList.rows[0])
            let rowsOfFirmware  = resultsFirmwareList.rows;
          rowsOfFirmware.forEach((firm)=>{
            firmwareList.push({creationDate: firm.creationdate, firmwareData:firm.firmwaredata, description: firm.description,id:firm.id, version: firm.version});
          })
          // firmwareList
          }

          // firmwareList
          // console.log('Result of getFirmwaresList : !  ',firmwareList)
          return res.status(200).json({
            response: {
              result:'success',
              message:''
            },
            firmwareList:firmwareList
            // idUser:idUser,
            // lastPublicFirmwareChangeCount:lastPublicFirmwareChangeCount,
            // firmwareDetail:firmwareDetail
          });
        })
        
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
        if(firmwareId !== undefined){
          const resSelectGlobal = await pool.query('SELECT * FROM firmware_handler WHERE id = $1',[firmwareId], (error, selectFirmware) => {
            if (error) {
              console.log(error)
            }
            firm = selectFirmware.rows[0];
            let selectFirmwareObject = {creationDate: firm.creationdate, firmwareData:firm.firmwaredata, description: firm.description,id:firm.id, version: firm.version}
            // console.log('Result global detail', globalFirm.id)
            // console.log('Result global detail')
            return res.status(200).json({
              response: {
                result:'success',
                message:''
              },  
              firmwareDetail:selectFirmwareObject
            });
          })
          
        }else{
          console.log('No Firmware ID ! ')
          return res.status(200).json({
            response: {
              result:'errorNoFirmWareId',
              message:''
            }
          });
        }

    }
  })
  }
  catch(error) { return res.status(500).json(error.message) }
 
 
});


router.get('/getGlobalFirmware', function(req, res) {
	console.log('firmware GLOBAL')
  let reqs = req;
  let headers = reqs.headers;
  let token = headers.token;
  console.log('token global : ',token )

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
        const lastpublicchangecount = await pool.query('SELECT publicfirmwareid FROM global_handler', async (error, publicFirmwareId) => {
          if (error) {
            console.log(error)
          }
          console.log('ID DU FIRMWARE : ',publicFirmwareId.rows[0].publicfirmwareid)
          if( publicFirmwareId.publicfirmwareid !== undefined || publicFirmwareId.rows[0].publicfirmwareid !== ""){
            const resSelectGlobal = await pool.query('SELECT * FROM firmware_handler WHERE id = $1',[publicFirmwareId.rows[0].publicfirmwareid], (error, SelectGlobal) => {
              if (error) {
                console.log(error)
              }
              firmware = SelectGlobal.rows[0];
              console.log('DETAILS DU FIRMWARE',firmware)
              let globalFirm = {creationDate: firmware.creationdate, firmwareData:firmware.firmwaredata, description: firmware.description,id:firmware.id, version: firmware.version}
              // console.log('Result global detail', globalFirm.id)
              return res.status(200).json({
                response: {
                  result:'success',
                  message:''
                },
                
                globalFirmware:globalFirm
              });
            })
            
          }else{
            console.log('No global firmware ! ')
            return res.status(200).json({
              response: {
                result:'errorNoGlobalFirmWare',
                message:''
              }
            });
          }

        })
    }
  })
  }
  catch(error) { return res.status(500).json(error.message) } 
});



module.exports = router;
