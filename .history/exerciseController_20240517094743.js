var express = require('express');
var router = express.Router();
const { pool } = require("./db");
var jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');


router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();

});

router.get('/', function(req, res) {
	console.log('exercise')
  res.status(200).json({
       response: {
          result: 'exercise',
          message: 'aucun utilisateur'
       },
  });
});


router.post('/createExercise', function(req, res) {
  var DateString = new Date().toLocaleDateString('en-GB');
  var isoDateString = new Date().toISOString();
  let reqs = req;
  let body = reqs.body;
  let globalHandler = [];
  let userDetail  = '';
  let idTable;
  const json = body.json;
  // let idUser = json.id;
  console.log('JSON du create : ! ',json)
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
            // const resp = pool.query( "INSERT INTO account_handler ( id, role) VALUES ($1, $2) RETURNING *",
            //     [userObject.id,  userObject.role]
            //   , (error, results) => {if (error) { throw error }
            //     console.log(`User added with ID: ${results.rows[0].id}`);
            //     // console.log(userObject);
            //     res.status(200).json({
            //       response: {
            //         result: 'success',
            //         message: ''
            //       },
            //       account: userObject
            //     });
            //   });



            return res.status(200).json({
              response: {
                result:'success',
                message:''
              },
              // jsonExo: json,
              // userId:idUser
            });
           }
    })
  } catch(error) { return res.status(500).json(error.message) } 
});

router.get('/getExercisesList', function(req, res) {
  let reqs = req;
  let headers = reqs.headers;
  let allExercises = [];
  let publicExercises=[];
  let privateExercises=[];
  let token = headers.token;
  let webapp = headers.webapp
  let publicExercisesChangeCount =  headers.publicexerciseschangecount;
  publicExercisesChangeCount = Number(publicExercisesChangeCount);
  let privateExercisesChangeCount =  headers.privateexerciseschangecount;
  privateExercisesChangeCount = Number(privateExercisesChangeCount);
  let idUser = headers.id;
  let userDetail  = '';
  let globalHandler = [];
  let lastPublicChangeCount="";
  let privatechanged = false;
  let publicChanged = false;
  let privateOnly = false;
  console.log('TOKEN EX LIST: ',token)
  console.log('public ex;: ', publicExercisesChangeCount)
  console.log('private ex;: ', privateExercisesChangeCount)
  console.log('Webapp;: ', webapp)
  console.log('idUser;: ', idUser)
  try {
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
        });
      }
    })
  }catch(error){ return res.status(500).json(error.message) }

});


router.get('/updateExercise', function(req, res) {
  let token = headers.token;
  // let firmwareList = [];
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
        return res.status(200).json({
          response: {
            result:'success',
            message:''
          },
        });
       }
    })
  }catch(error){ return res.status(500).json(error.message) }
});


module.exports = router;
