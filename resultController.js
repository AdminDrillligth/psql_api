var express = require('express');
var router = express.Router();
const { pool } = require("./db");
var jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
var DateString = new Date().toLocaleDateString('en-GB');
var isoDateString = new Date().toISOString();
var _ = require('lodash');



router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  console.log('we are on results')
  next();

});

router.get('/', function(req, res) {
	console.log('result')
  res.status(200).json({
       response: {
          result: 'result',
          message: 'aucun utilisateur'
       },
  });
  
});

router.post('/createResult', function (req, res) {
  let reqs = req;
  let body = reqs.body;
  let results = body.data;
  let headers = reqs.headers;
  let token = headers.token;
  let reslutsParse = [];
  let lengthOfResults = results.length;
  let countOfPushDataIntoResults = 0;
  try{
    console.log('RESULTS DATA: ',results)

      const resp = pool.query( "INSERT INTO reports_handler (report) VALUES ($1) RETURNING *",
      [results]
    , (error, resultsOfReports) => {if (error) { throw error }
      // console.log(`Report added with ID: ${resultsOfReports.rows[0].id}`);
      if(resultsOfReports.rowCount === 1){
        results.forEach((result) =>{
          let newUuidResult = uuidv4();
          reslutsParse.push({result:result.results, idExercice:result.results.infos.idExercise, idResult:newUuidResult, idAccount:result.coach.id })
          console.log('LE LOG DU NEW ARRAY : ! ',reslutsParse, reslutsParse.length);
          if(lengthOfResults === reslutsParse.length){
            results.forEach((result) =>{
              console.log('INSERTION DES RESULTATS', countOfPushDataIntoResults)
              const resp = pool.query( "INSERT INTO results_handler ( idaccount, idexercice,idresult,result) VALUES ($1,$2,$3,$4) RETURNING *",
                [result.coach.id, result.results.infos.idExercise,newUuidResult, result.results]
              , (error, results) => {if (error) { throw error }
  
              countOfPushDataIntoResults = countOfPushDataIntoResults+1;
              console.log('countOfPushDataIntoResults',countOfPushDataIntoResults)
              if(countOfPushDataIntoResults === lengthOfResults){
                res.status(200).json({
                           response: {
                             result: 'success',
                             message: ''
                           },
                           results: reslutsParse
                 });
              }
              })
            })
           
          
          }
        })
        



      }else{
        res.status(200).json({
          response: {
            result: 'errorCreateReport',
            message: 'Une erreur dans votre formulaire'
          },
        });
      }
      // console.log(userObject);
      
    });
    // res.status(200).json({
    //   response: {
    //      result: 'success',
    //      message: ''
    //   },
    //   results:results
    // });
  }
  catch(error){ return res.status(500).json(error.message)}
})



router.get('/getResultsList', async function(req, res) {
  let reqs = req;

  let headers = reqs.headers;
  let token = headers.token;
  let idUser = headers.id;
	console.log('result')
  let resultsArray = [];
  try{

    const resSelect = await pool.query('SELECT * FROM results_handler WHERE idaccount = $1',[idUser], async (error, resultsOfResults) => {
      if (error) {
        console.log(error)
      }
      if(resultsOfResults.rowCount > 0){
        // results = _.orderBy(results, ['result.infos.startDate'],['desc'])
        resultsOfResults.rows.forEach((result)=>{
          console.log('EACH RESULT : ',result)
          resultsArray.push({idAccount:result.idaccount, idExercice:result.idexercice, idResult:result.idresult, result:result.result})
          if(resultsArray.length === resultsOfResults.rowCount){
            // res.status(200).json({
            //   response: {
            //      result: 'success',
            //      message: ''
            //   },
            //   rowCount:resultsOfResults.rowCount,
            //   results:resultsArray
            // });
          }else{
            // res.status(200).json({
            //   response: {
            //      result: 'errorParsing',
            //      message: ''
            //   },
            //   rowCount:resultsOfResults.rowCount
            // });
          }
        })
        console.log('LE LENGTH ARRAY OF RESULTS : ',resultsArray.length)
        if(resultsArray.length === resultsOfResults.rowCount){
          console.log('we are same length', resultsArray)
          res.status(200).json({
            response: {
               result: 'success',
               message: ''
            },
            idUser:idUser,
            rowCount:resultsOfResults.rowCount,
            results:resultsArray
          });
        }else{
          // Error log system
          res.status(200).json({
            response: {
               result: 'errorParsingResultsRows',
               message: ''
            },
            idUser:idUser,
            rowCount:resultsOfResults.rowCount,
          });
        }

      }else{
        res.status(200).json({
          response: {
             result: 'errorNoResults',
             message: ''
          },
          idUser:idUser,
          rowCount:resultsOfResults.rowCount
        });
      }
    })
  }
  catch(error){ return res.status(500).json(error.message)}
});





module.exports = router;
