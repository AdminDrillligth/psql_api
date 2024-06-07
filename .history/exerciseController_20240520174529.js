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
  let headers = reqs.headers;
  let token = headers.token;
  const json = body.json;
  let newUuid = uuidv4();
  // let idUser = json.id;

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
            console.log('JSON du create : ! ',json);
            console.log('JSON modified : ! ',json.header.modified);
            console.log('JSON status : ! ',json.header.status);
            console.log('JSON ID : ! ',json.header.id);
            console.log('JSON Selected : ! ',json.selected);
            json.header.modified = isoDateString;
            // json.header.id = newUuid;
            delete json.selected;
            if(json.header.status === 'public'){
              const resSelect = await pool.query('SELECT lastpublicchangecount FROM global_handler', async (error, results) => {
                if (error) {
                  console.log(error)
                }
                console.log('lastpublicchangecount : !', results.rows[0].lastpublicchangecount)
                results.rows[0].lastpublicchangecount = results.rows[0].lastpublicchangecount +1;
                const res = pool.query('UPDATE global_handler SET lastpublicchangecount = $1 WHERE id = $2',
                [results.rows[0].lastpublicchangecount, '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'],
                (error, results) => {
                  if (error) {
                    console.log(error)
                  }
                  console.log('User modified with ID:',results.rows)
                })
              });
            }
            if(json.header.status === 'private'){

            }
            const resp = pool.query( "INSERT INTO exercise_handler ( id, header, steps ) VALUES ($1, $2, $3) RETURNING *",
                [json.header.id, json.header, json.steps ]
              , (error, results) => {if (error) { console.log(error) }
                console.log(`User added with ID: ${results}`);
                res.status(200).json({
                  response: {
                    result: 'success',
                    message: ''
                  },
                  // id:newUuid,
                  json:json
                });
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
  userDetail  = undefined;
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
        const resSelectUser = await pool.query('SELECT * FROM account_handler WHERE id = $1',[idUser], (error, resultsUser) => {
          if (error) {
            console.log(error)
          }
          console.log('le user de ces exos : ? ', resultsUser.rows[0])
          userDetail = resultsUser.rows[0];
        })
        console.log('le user de ces exos : ? ', userDetail)
        const lastpublicchangecount = await pool.query('SELECT lastpublicchangecount FROM global_handler', async (error, lastpublicchangecount) => {
          if (error) {
            console.log(error)
          }
          console.log('result lastpublicchangecount : ', lastpublicchangecount.rows[0].lastpublicchangecount , 'le send is : ', publicExercisesChangeCount)
          if(lastpublicchangecount.rows[0].lastpublicchangecount > publicExercisesChangeCount){
            const resSelect = await pool.query('SELECT * FROM exercise_handler', async (error, results) => {
              if (error) {
                console.log(error)
              }
              // console.log('Result du get exo : ! ',results)
              return res.status(200).json({
                response: {
                  result:'success',
                  message:''
                },
                json:results.rows,
              });
            });
          }
          if(lastpublicchangecount.rows[0].lastpublicchangecount < publicExercisesChangeCount){
  
          }
          if(lastpublicchangecount.rows[0].lastpublicchangecount === publicExercisesChangeCount){
  
          }
        
        });
        // If the last update is upper than the last storage
        
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
