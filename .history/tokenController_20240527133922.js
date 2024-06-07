var express = require('express');
var router = express.Router();
const { pool } = require("./db");
var jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
var DateString = new Date().toLocaleDateString('en-GB');
var isoDateString = new Date().toISOString();
router.use(function timeLog(req, res, next) {
  // console.log('Time: ', Date.now(), req);
  next();

});

router.get('/', function(req, res) {
console.log('ontoken')
  res.status(200).json({
       response: {
          result: 'success',
          message: 'token api handler'
       },
  });
});



router.get('/getToken',async function(req, res) {
    console.log('getToken',req.headers.username)
    username = req.headers.username;
    console.log('getToken',req.headers.passwordhash)
    try {

      if(req.headers.passwordhash === undefined || req.headers.username === undefined){
        res.status(200).json({
          response: {
            result:'errorBadRequest',
            message:''
          },
        });
      }else{
        const resSelect = await pool.query('SELECT * FROM account_handler WHERE email = $1',[username], (error, results) => {
          if (error) {
            console.log(error)
          }
          // console.log(results)
          if(results.rowCount === 0){
              res.status(200).json({
                response: {
                  result:'errorNoAccount',
                  message:'aucun utilisateur'
                },
              });
          }
          if(results.rowCount === 1){
            if(results.rows[0].passwordhash !== "" && results.rows[0].passwordhash === req.headers.passwordhash){
              if(results.rows[0].warning){
                res.status(200).json({
                  response: {
                    result:'errorBlockedAccount',
                    message:''
                  },
                });
              }else{
                let newUuid = uuidv4();
                jwt.sign({ 
                  hash:results.rows[0].passwordhash,
                  id: results.rows[0].id,
                  date: isoDateString,
                  key:newUuid, 
              
                },'secret',{ expiresIn:'30d'},async function(err, token) {
                console.log('le id : ! ',results.rows[0].id,'Le token: ', token);
                res.status(200).json({
                    response: {
                      result:'success',
                      message:''
                    },
                    token:token,
                    id:results.rows[0].id
                  });
                });
  
                
              }
             
            }else{
              res.status(200).json({
                response: {
                  result:'invalidPasswordError',
                  message:'Mot de passe incorrect'
                },
              });
            }
            
          }
          if(results.rowCount > 1){
            // Set log error functions
            console.log('error duplicate account')
          }
        })
      }  
    }
    catch(error){
        console.log(error)
    }  
});

  
router.get('/validateToken', function(req, res) {
	  let reqs = req;
  	  let headers = reqs.headers;
  	  let token = headers.token;
  	  let idUser = headers.id;
  	  let userDetail=[];
	  console.log(headers);
  	try{
      jwt.verify(token, 'secret', { expiresIn: '30d' }, async function(err, decoded) {
        if(err){
          return res.status(200).json({
            response: {
              result:'expiredTokenError',
              message:''
            },
          });
        }else{
          if(idUser !== undefined){
            const resSelect = await pool.query('SELECT * FROM account_handler WHERE id = $1',[idUser], (error, results) => {
              if (error) {
                console.log(error)
              }
              res.status(200).json({
               response: {
                 result:'success',
                 message:''
               },
             });
            })
          }
        }
      })
	 } catch(error) {
      	  return res.status(500).json(error.message);
  	}
});

  
router.get('/passwordHash',async  function(req, res) {
  	let reqs = req;
  	let headers = reqs.headers;
  	let passwordHash = headers.passwordhash;
  	let username = headers.username;
  	let userDetail  = '';
	console.log('EMAIL USERNAME : ',username);
	try {
	const resSelect = await pool.query('SELECT * FROM account_handler WHERE email = $1',[username], (error, results) => {
      	   if (error) {
      	     console.log(error)
      	   }
      	   res.status(200).json({
            response: {
              result:'success',
              message:''
            },
          });
	  })

 	} catch(error) { return res.status(500).json(error.message) }
});



module.exports = router;