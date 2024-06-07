var express = require('express');
var router = express.Router();
const { pool } = require("./db");
var jwt = require("jsonwebtoken");
const { uuidv4 } = require('uuid');

router.use(function timeLog(req, res, next) {
  // console.log('Time: ', Date.now(), req);
  next();

});

router.get('/', function(req, res) {
console.log('ontoken')
  res.status(200).json({
       response: {
          result: 'simple way',
          message: 'aucun utilisateur'
       },
  });
});

router.get('/getToken', function(req, res) {
    console.log('getToken',req.headers.username)
    // const [name, role] = process.argv.slice(2);

    try {


        jwt.sign({ foo: 'bar' },'secret',{ expiresIn:'30d'},async function(err, token) {
          console.log('le token : ! ', token);
          // tokenPreset = token;
          //const res = await pool.query(
            //"INSERT INTO users (name, role) VALUES ($1, $2)", [name, role]
          //);
         // console.log(`Added an admin with the name ${name} with token ${token}`);

        });
        res.status(200).json({
          response: {
             result: 'getToken',
             message: 'aucun utilisateur'
          },
          // token: tokenPreset
        });
      }
    catch(error){
        console.log(error)
    }
      // const resSelect = await pool.query('SELECT * FROM users', (error, results) => {
      //   if (error) {
      //     throw error
      //   }
      //   // response.status(200).json(results.rows)
      // })
      // console.log('SELECT RES : ',resSelect)
    
    
});
  
router.get('/validateToken', function(req, res) {
	  let reqs = req;
  	  let headers = reqs.headers;
  	  let token = headers.token;
  	  let idUser = headers.id;
  	  let userDetail=[];
	  console.log(headers);
  	try{
	  return res.status(200).json({
            	     response: {
              	result:'success',
              	message:''
            		},
            		//token:token,
          	  });
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
      	   res.status(200).json(results)
	  })

 	} catch(error) { return res.status(500).json(error.message) }
});



module.exports = router;