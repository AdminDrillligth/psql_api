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
  let idUser = json.id;
  // console.log('update this account')
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
            console.log('ID DU USER : mode Private ! ',json.id)
            console.log('JSON du create : ! ',json);
            console.log('JSON modified : ! ',json.header.modified);
            console.log('JSON status : ! ',json.header.status);
            console.log('JSON ID : ! ',json.header.id);
            console.log('JSON Selected : ! ',json.selected);
            json.header.modified = isoDateString;
            // json.header.id = newUuid;
            delete json.selected;

            ////
            // PUBLIC MODE
            ////

            if(json.header.status === 'public'){
              console.log('on est en mode public : ')
              const resSelect = await pool.query('SELECT "lastPublicChangeCount" FROM global_handler', async (error, results) => {
                if (error) {
                  console.log(error)
                  // res.status(400).json({
                  //   response: {
                  //     result: 'errorRequest',
                  //     message: error
                  //   }
                  // });
                }
                console.log('lastpublicchangecount : !', results.rows[0].lastPublicChangeCount)
                results.rows[0].lastPublicChangeCount = results.rows[0].lastPublicChangeCount +1;
                const res = pool.query('UPDATE global_handler SET "lastPublicChangeCount" = $1 WHERE id = $2',
                [results.rows[0].lastPublicChangeCount, '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'],
                (error, results) => {
                  if (error) {
                    console.log(error)
                    // res.status(400).json({
                    //   response: {
                    //     result: 'errorRequest',
                    //     message: error
                    //   }
                    // });

                  }
                  else{
                    if(results.rows !== undefined){
                      console.log('User modified with ID:',results.rows)
                    }
                  }
               
                })
              });

                 //  --> Go test public right now !
              const resp = pool.query( "INSERT INTO public_exercise_handler (  header, id, steps, status ) VALUES ($1, $2, $3, $4) RETURNING *",
                [ json.header, json.header.id, json.steps, json.header.status]
              , (error, results) => {if (error) { 
                console.log(error)
               }
               if(results.rows !== undefined){
                console.log(`Exercise added with ID: ${results.rows[0]}`);
                res.status(200).json({
                  response: {
                    result: 'success',
                    message: ''
                  },
                  // id:newUuid,
                  json:json
                });
               }
                
              });
            }

            ////
            // PRIVATE MODE
            ////

            if(json.header.status === 'private'){
              if(json.header.owner.id !== undefined){
                console.log('private');
                console.log('ID DU USER : mode Private ! ',json.header.owner.id)
                //  --> Go private right now !
                pool.query('SELECT "privateexerciseschangecount" FROM account_handler WHERE id = $1',[json.header.owner.id], async (error, resultsprivateexerciseschangecount) => {
                  if (error) {
  
                  }else{
                    console.log('resultsprivateexerciseschangecount : !',resultsprivateexerciseschangecount.rows[0].privateexerciseschangecount)
                    if(resultsprivateexerciseschangecount.rows !== undefined){
                      // if privateexerciseschangecount exist
                      resultsprivateexerciseschangecount.rows[0].privateexerciseschangecount = resultsprivateexerciseschangecount.rows[0].privateexerciseschangecount + 1
                      const resp = pool.query( "INSERT INTO private_exercise_handler (  header, id, steps, status, owner ) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                        [ json.header, json.header.id, json.steps, json.header.status, json.header.owner.id ]
                      , (error, results) => {if (error) { 
                        console.log(error)
                      }
                      if(results.rows !== undefined){
                        // Si l'exercice à bien été ajouté
                        console.log(`Exercise added with ID: ${results.rows}`);
                        pool.query('UPDATE account_handler SET "privateexerciseschangecount" = $1 WHERE id = $2',
                          [resultsprivateexerciseschangecount.rows[0].privateexerciseschangecount, json.header.owner.id],
                          (error, results) => {
                            if (error) {
                              console.log(error)
                              // res.status(400).json({
                              //   response: {
                              //     result: 'errorRequest',
                              //     message: error
                              //   }
                              // });
          
                            }
                            else{
                              if(results !== undefined){
                                   if(results.rows !== undefined){
                                // console.log('User modified with ID:',results.rows)
                                   }else{
                                    
                                   }
                                // console.log('User modified with ID:',results.rows)
                              }
                            }
                         
                          })
                        res.status(200).json({
                          response: {
                            result: 'success',
                            message: ''
                          },
                          // id:newUuid,
                          json:json
                        });
                      }
                        
                      });
                    }else{
                      const resp = pool.query( "INSERT INTO private_exercise_handler (  header, id, steps, status, owner ) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                        [ json.header, json.header.id, json.steps, json.header.status, json.header.owner.id]
                      , (error, results) => {if (error) { 
                        console.log(error)
                      }
                      if(results.rows !== undefined){
                        res.status(200).json({
                          response: {
                            result: 'success',
                            message: ''
                          },
                          json:json
                        });
                        pool.query('UPDATE account_handler SET "privateexerciseschangecount" = $1 WHERE id = $2',
                          [1, json.header.owner.id],
                          (error, results) => {
                            if (error) {
                              console.log(error)
                              // res.status(400).json({
                              //   response: {
                              //     result: 'errorRequest',
                              //     message: error
                              //   }
                              // });
          
                            }
                            else{
                              if(results.rows !== undefined){
                                // console.log('User modified with ID:',results.rows)
                              }
                            }
                         
                          })
                      }
                    })
                     
                    
                    }
                    
                   
                  }
                });
                // const updateSelectedExercise = pool.query('UPDATE account_handler SET trainings = $1 WHERE id = $2',
                // [userDetailOwner.users, dataBodyOfRequest.owner],
                // (error, results) => {
                //   if (error) {
                //     throw error
                //   }
                //   console.log('User modified with ID:',results.rows)
                // })
              }else{
                res.status(200).json({
                  response: {
                    result: 'errorNoOwnerId',
                    message: ''
                  }
                });
              }
            }
            // else{
            //   res.status(200).json({
            //     response: {
            //       result: 'errorBadStatus',
            //       message: "Le status de l\'exercice n'est pas public ou privé"
            //     },
            //     json:json
            //   });
            // }
            
           }
    })
  } catch(error) { return res.status(500).json(error.message) } 
});




router.get('/getExercisesList', async function(req, res) {
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
  let privateChanged = false;
  let publicChanged = false;
  let privateOnly = false;
  countOfSelectedTrainings = 0;
  countOfSelectedTrainingsInside = 0;
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
        pool.query('SELECT * FROM account_handler WHERE id = $1',[idUser], async (error, resultsUser) => {
          if (error) {
            console.log(error)
            res.status(400).json({
              response: {
                result: 'errorRequest',
                message: error
              }
            });
          }
          if(resultsUser.rowCount === 0){
            console.log('account owner ?')
            res.status(200).json({
              response: {
                 result: 'noAccountError',
                 message: ''
              },
            });
          }else{
            // console.log('le user de ces exos : ? ', resultsUser.rows[0])
            userDetail = resultsUser.rows[0];
            console.log('If role ?',userDetail.role)
            console.log('List of selected trainings :',userDetail.trainings)
            console.log('List of selected exercises :',userDetail.exercises)
            // console.log("privateexerciseschangecount :: ! ", userDetail.privateexerciseschangecount )
            if(userDetail.trainings !== undefined ){
              const lastpublicchangecount = await pool.query('SELECT "lastPublicChangeCount" FROM global_handler', async (error, lastpublicchangecount) => {
                if (error) {
                  console.log(error)
                  // res.status(400).json({
                  //   response: {
                  //     result: 'errorRequest',
                  //     message: error
                  //   }
                  // });
      
                }
                else{
                  if(lastpublicchangecount.rows !== undefined){
                    // console.log('le last public change count: Before get infos inside APP', lastpublicchangecount.rows)
                  }
                }
              })
                      if(userDetail.trainings.length > 0  && webapp !== '1'){
                        if(userDetail.privateonly){
                          userDetail.trainings.forEach(training => {
                            pool.query('SELECT * FROM private_exercise_handler WHERE id = $1',[training], async (error, resultsExercise) => {
                              if (error) {
                                console.log(error)
                              }
                              if(resultsExercise.rowCount > 0){
                                if(userDetail.exercises.length > 0 ){
                                  console.log('Les exos privés',resultsExercise.rows[0])
                                }
                                // countOfSelectedTrainings ++
                                privateExercises.push(resultsExercise.rows[0])
                                console.log('RESULT OF USER SELECTED TRAININGS PRIVATE : ! ',resultsExercise.rows)
                                console.log('Details of length : ! ',countOfSelectedTrainings, userDetail.trainings.length) 
                                // console.log('COUNT SELECTED PRIVATE END: ! ',countOfSelectedTrainings)
                                  // console.log('TRAININGS LENGTH: END! ',countOfSelectedTrainingsInside)
                                  // console.log('RESULT LENGTH : ', privateExercises.length, publicExercises.length)
                                  privateExercises = _.orderBy(privateExercises, ['header.title'],['asc'])
                                  console.log('RESULT DETAILS PRIVATE ET PUBLIC: ! ',publicExercises, privateExercises)
                                  return res.status(200).json({
                                    response: {
                                      result:'success',
                                      message:''
                                    },
                                    publicExercises:[],
                                    privateExercises:privateExercises,
                                    publicChanged:false,
                                    privateChanged:true,
                                    publicExercisesChangeCount:1, //  lastpublicchangecount.rows[0].lastPublicChangeCount
                                    privateExercisesChangeCount:1, //userDetail.privateexerciseschangecount
                                    idUser:idUser,
                                  });
                              }
                            }) 
                          })
                        }else{
                          //     // If user have a selected exercises
                          console.log('TRAININGS LENGTH: ! ',userDetail.trainings.length)
                          userDetail.trainings.forEach(training => {
                          countOfSelectedTrainingsInside ++;
                          // console.log('Details id : ', training)            
                          pool.query('SELECT * FROM public_exercise_handler WHERE id = $1',[training], async (error, resultsExercise) => {
                            if (error) {
                              console.log(error)
                            }
                            if(resultsExercise.rowCount > 0){
                              countOfSelectedTrainings ++
                              // console.log('RESULT OF USER SELECTED TRAININGS PUBLIC : ! ',resultsExercise.rows)
                              publicExercises.push(resultsExercise.rows[0])
                              if(countOfSelectedTrainings === userDetail.trainings.length){  
                                // console.log('COUNT SELECTED PUBLIC END: ! ',countOfSelectedTrainings)
                                // console.log('TRAININGS LENGTH: END! ',countOfSelectedTrainingsInside)
                                // console.log('RESULT LENGTH : ', privateExercises.length, publicExercises.length)
                                publicExercises = _.orderBy(publicExercises, ['header.title'],['asc'])
                                privateExercises = _.orderBy(privateExercises, ['header.title'],['asc'])
                                console.log('RESULT DETAILS PRIVATE ET PUBLIC: ! ',publicExercises, privateExercises)
                                return res.status(200).json({
                                  response: {
                                    result:'success',
                                    message:''
                                  },
                                  publicExercises:publicExercises,
                                  privateExercises:privateExercises,
                                  publicChanged:true,
                                  privateChanged:true,
                                  publicExercisesChangeCount:1, //  lastpublicchangecount.rows[0].lastPublicChangeCount
                                  privateExercisesChangeCount:1, //userDetail.privateexerciseschangecount
                                  idUser:idUser,
                                });
                              }
                            }
                            
                          })
                          pool.query('SELECT * FROM private_exercise_handler WHERE id = $1',[training], async (error, resultsExercise) => {
                            if (error) {
                              console.log(error)
                            }
                            if(resultsExercise.rowCount > 0){
                              countOfSelectedTrainings ++
                              privateExercises.push(resultsExercise.rows[0])
                              console.log('RESULT OF USER SELECTED TRAININGS PRIVATE : ! ',resultsExercise.rows)
                              console.log('Details of length : ! ',countOfSelectedTrainings, userDetail.trainings.length)
                              if(countOfSelectedTrainings === userDetail.trainings.length){
                                // console.log('COUNT SELECTED PRIVATE END: ! ',countOfSelectedTrainings)
                                // console.log('TRAININGS LENGTH: END! ',countOfSelectedTrainingsInside)
                                // console.log('RESULT LENGTH : ', privateExercises.length, publicExercises.length)
                                publicExercises = _.orderBy(publicExercises, ['header.title'],['asc'])
                                privateExercises = _.orderBy(privateExercises, ['header.title'],['asc'])
                                console.log('RESULT DETAILS PRIVATE ET PUBLIC: ! ',publicExercises, privateExercises)
                                return res.status(200).json({
                                  response: {
                                    result:'success',
                                    message:''
                                  },
                                  publicExercises:publicExercises,
                                  privateExercises:privateExercises,
                                  publicChanged:true,
                                  privateChanged:true,
                                  publicExercisesChangeCount:1, //  lastpublicchangecount.rows[0].lastPublicChangeCount
                                  privateExercisesChangeCount:1, //userDetail.privateexerciseschangecount
                                  idUser:idUser,
                                });
                              }
                            }
                          }) 
                          }) 
                        }
                         
                    }
                    else {
                      // Si le tableau user est vide
                      if(webapp === '1'){
                        // !!
                        console.log('WE ARE IN WEB APP !!! ');
                        if(userDetail.privateonly){
                          // Si le user est en exos privé uniquement

                          // BIG TODO
                          if(userDetail.privateexerciseschangecount > privateExercisesChangeCount){
                            privateChanged = true;
                            let dedicatedPrivateExercise = [];
                            console.log('on va get les privates')
                            if(userDetail.exercises.length > 0 && userDetail.role === 'owner'){
                              userDetail.exercises.forEach(exoprivate =>{
                                console.log('les exos du private only ', exoprivate)
                                pool.query('SELECT * FROM private_exercise_handler WHERE id = $1', [exoprivate], async (error, resultsPrivateExerciseUser) => {
                                  if (error) {
                                    console.log(error);
                                  }
                                  console.log('Result of private only ',resultsPrivateExerciseUser.rows)
                                  dedicatedPrivateExercise.push(resultsPrivateExerciseUser.rows[0])
                                  if(userDetail.exercises.length === dedicatedPrivateExercise.length){
                                    console.log('on va get les privates nous avons les resultats')
                                    let arrayOfPrivateExercises =  resultsPrivateExerciseUser.rows
                                    arrayOfPrivateExercises = _.orderBy(dedicatedPrivateExercise, ['header.title'],['asc'])
                                    return res.status(200).json({
                                      response: {
                                        result:'success',
                                        message:''
                                      },
                                      publicExercises:[],
                                      privateExercises:arrayOfPrivateExercises,
                                      publicChanged:false,
                                      privateChanged:true,
                                      publicExercisesChangeCount:1,
                                      privateExercisesChangeCount:userDetail.privateexerciseschangecount
                                      // idUser:idUser,
                                    });

                                  }
                                })

                              })

                            }
                            // pool.query('SELECT * FROM private_exercise_handler WHERE owner = $1',[idUser], async (error, resultsPrivateExercise) => {
                            //   if (error) {
                            //     console.log(error)
                            //     // res.status(400).json({
                            //     //   response: {
                            //     //     result: 'errorRequest',
                            //     //     message: error
                            //     //   }
                            //     // });
                            //   }
                            //   console.log('RESULT OF Private TRAININGS : ! ',resultsPrivateExercise.rows[0])
                             
                            //   let arrayOfPrivateExercises =  resultsPrivateExercise.rows
                            //   if(userDetail.exercises.length > 0 ){
                            //     console.log('Les exos privés',arrayOfPrivateExercises)
                            //   }
                            //   arrayOfPrivateExercises = _.orderBy(arrayOfPrivateExercises, ['header.title'],['asc'])
                            //   return res.status(200).json({
                            //     response: {
                            //       result:'success',
                            //       message:''
                            //     },
                            //     publicExercises:[],
                            //     privateExercises:arrayOfPrivateExercises,
                            //     publicChanged:false,
                            //     privateChanged:true,
                            //   });
                            // })
                          }
                          if(userDetail.privateexerciseschangecount < privateExercisesChangeCount){
                            if(userDetail.exercises.length > 0 ){
                              console.log('Les exos privés',arrayOfPrivateExercises)
                            }
                            privateChanged = false;
                            return res.status(200).json({
                              response: {
                                result:'success',
                                message:''
                              },
                              publicExercises:[],
                              privateExercises:[],
                              publicChanged:false,
                              privateChanged:privateChanged,
                            });
                          }
                          if(userDetail.privateexerciseschangecount === privateExercisesChangeCount){
                            if(userDetail.exercises.length > 0 ){
                              console.log('Les exos privés',arrayOfPrivateExercises)
                            }
                            privateChanged = false;
                            return res.status(200).json({
                              response: {
                                result:'success',
                                message:''
                              },
                              publicExercises:[],
                              privateExercises:[],
                              publicChanged:false,
                              privateChanged:privateChanged,
                            });
                          }
                          
                         
                        }else{
                          // Si il n'est pas uniquement en exos privé
                          console.log('not private only')
  
                           const lastpublicchangecount = await pool.query('SELECT "lastPublicChangeCount" FROM global_handler', async (error, lastpublicchangecount) => {
                            if (error) {
                              console.log(error)
                              // res.status(400).json({
                              //   response: {
                              //     result: 'errorRequest',
                              //     message: error
                              //   }
                              // });
                  
                            }
                            else{
                              console.log('lastpublicchangecount.rows',lastpublicchangecount.rows)
                              if(lastpublicchangecount.rows !== undefined){
                                // si nous avons bien un résultat dans le global handler
                                // console.log('result after get last result !!! ')
                                // console.log('result lastpublicchangecount : ', lastpublicchangecount.rows[0].lastPublicChangeCount , 'le send is : ', publicExercisesChangeCount)
                                if(lastpublicchangecount.rows[0].lastPublicChangeCount > publicExercisesChangeCount){
                                  publicChanged = true;                                
                                  const resSelect = await pool.query('SELECT * FROM public_exercise_handler WHERE status = $1',['public'], async (error, resultsExercisePublic) => {
                                    if (error) {
                                      console.log(error)
                                      // res.status(400).json({
                                      //   response: {
                                      //     result: 'errorRequest',
                                      //     message: error
                                      //   }
                                      // });
                                    }
                                    console.log('LES CHANGS COUNT : ',userDetail.privateexerciseschangecount ,privateExercisesChangeCount )
                                    if(userDetail.privateexerciseschangecount > privateExercisesChangeCount){
                                      let dedicatedPrivateExercise = [];
                                      privateChanged = true;
                                      console.log('On veut les exos privés en mode owner : !',userDetail)
                                      if(userDetail.exercises.length > 0 && userDetail.role === 'owner'){
                                        
                                        console.log('Les exos privés mode webapp',userDetail)
                                        userDetail.exercises.forEach(exoprivate =>{
                                          console.log('les exos', exoprivate)
                                          pool.query('SELECT * FROM private_exercise_handler WHERE id = $1', [exoprivate], async (error, resultsPrivateExerciseUser) => {
                                            if (error) {
                                              console.log(error);
                                            }
                                            // console.log('le result of private exo : ', resultsPrivateExerciseUser.rows[0])
                                            dedicatedPrivateExercise.push(resultsPrivateExerciseUser.rows[0])
                                            if(userDetail.exercises.length === dedicatedPrivateExercise.length){
                                              console.log('nous passons cette etape === : ! ', dedicatedPrivateExercise)
                                              let arrayOfPublicExercises =  resultsExercisePublic.rows
                                                arrayOfPublicExercises = _.orderBy(arrayOfPublicExercises, ['header.title'],['asc'])
                                                let arrayOfPrivateExercises =  resultsPrivateExerciseUser.rows
                                                arrayOfPrivateExercises = _.orderBy(dedicatedPrivateExercise, ['header.title'],['asc'])
                                                  return res.status(200).json({
                                                    response: {
                                                      result:'success',
                                                      message:''
                                                    },
                                                    publicExercises:arrayOfPublicExercises,
                                                    privateExercises:arrayOfPrivateExercises,
                                                    publicChanged:publicChanged,
                                                    privateChanged:privateChanged,
                                                    publicExercisesChangeCount:lastpublicchangecount.rows[0].lastPublicChangeCount,
                                                    privateExercisesChangeCount:userDetail.privateexerciseschangecount
                                                    // idUser:idUser,
                                                  });
                                            }
                                          })
                                        })
                                      }else{
                                        // Si le user n'a pas de exercise dans sa base
                                        pool.query('SELECT * FROM private_exercise_handler', async (error, resultsPrivateExerciseUser) => {
                                          if (error) {
                                            console.log(error);
                                          }
                                          let arrayOfPublicExercises =  resultsExercisePublic.rows
                                          arrayOfPublicExercises = _.orderBy(arrayOfPublicExercises, ['header.title'],['asc'])
                                          let arrayOfPrivateExercises =  resultsPrivateExerciseUser.rows
                                          arrayOfPrivateExercises = _.orderBy(arrayOfPrivateExercises, ['header.title'],['asc'])
                                            return res.status(200).json({
                                              response: {
                                                result:'success',
                                                message:''
                                              },
                                              publicExercises:arrayOfPublicExercises,
                                              privateExercises:arrayOfPrivateExercises,
                                              publicChanged:publicChanged,
                                              privateChanged:privateChanged,
                                              publicExercisesChangeCount:lastpublicchangecount.rows[0].lastPublicChangeCount,
                                              privateExercisesChangeCount:userDetail.privateexerciseschangecount
                                              // idUser:idUser,
                                          });

                                        })        
                                      }
                                    }
                                    if(userDetail.privateexerciseschangecount < privateExercisesChangeCount){
                                      let arrayOfPublicExercises =  resultsExercisePublic.rows
                                      arrayOfPublicExercises = _.orderBy(arrayOfPublicExercises, ['header.title'],['asc'])

                                      privateChanged = false;
                                      return res.status(200).json({
                                        response: {
                                          result:'success',
                                          message:''
                                        },
                                        publicExercises:arrayOfPublicExercises,
                                        privateExercises:[],
                                        publicChanged:publicChanged,
                                        privateChanged:privateChanged,
                                        publicExercisesChangeCount:lastpublicchangecount.rows[0].lastPublicChangeCount,
                                        privateExercisesChangeCount:userDetail.privateexerciseschangecount
                                        // idUser:idUser,
                                      });
                                    }
                                    if(userDetail.privateexerciseschangecount === privateExercisesChangeCount){
                                      let arrayOfPublicExercises =  resultsExercisePublic.rows
                                      arrayOfPublicExercises = _.orderBy(arrayOfPublicExercises, ['header.title'],['asc'])

                                      privateChanged = false;
                                      return res.status(200).json({
                                        response: {
                                          result:'success',
                                          message:''
                                        },
                                        publicExercises:arrayOfPublicExercises,
                                        privateExercises:[],
                                        publicChanged:publicChanged,
                                        privateChanged:privateChanged,
                                        publicExercisesChangeCount:lastpublicchangecount.rows[0].lastPublicChangeCount,
                                        privateExercisesChangeCount:userDetail.privateexerciseschangecount
                                        // idUser:idUser,
                                      });
                                    }
                                  });
                                }
                                if(lastpublicchangecount.rows[0].lastPublicChangeCount < publicExercisesChangeCount){
                                  publicChanged = false;
                                  if(userDetail.privateexerciseschangecount > privateExercisesChangeCount){
                                    privateChanged = true;
                                    pool.query('SELECT * FROM private_exercise_handler WHERE owner = $1',[idUser], async (error, resultsPrivateExercise) => {
                                      if (error) {
                                        console.log(error)
                                        // res.status(400).json({
                                        //   response: {
                                        //     result: 'errorRequest',
                                        //     message: error
                                        //   }
                                        // });
                                      }
  
                                      console.log('RESULT OF Private TRAININGS : ! ',resultsPrivateExercise.rows[0])


                                      let arrayOfPrivateExercises =  resultsPrivateExercise.rows
                                      arrayOfPrivateExercises = _.orderBy(arrayOfPrivateExercises, ['header.title'],['asc'])
                                      if(userDetail.exercises.length > 0 ){
                                        console.log('Les exos privés mode webapp',arrayOfPrivateExercises)
                                      }
                                      return res.status(200).json({
                                        response: {
                                          result:'success',
                                          message:''
                                        },
                                        publicExercises:[],
                                        privateExercises:arrayOfPrivateExercises,
                                        publicChanged:publicChanged,
                                        privateChanged:privateChanged,
                                        publicExercisesChangeCount:lastpublicchangecount.rows[0].lastPublicChangeCount,
                                        privateExercisesChangeCount:userDetail.privateexerciseschangecount
                                        // idUser:idUser,
                                      });
                                    })
                                  }
                                  if(userDetail.privateexerciseschangecount < privateExercisesChangeCount){
                                    privateChanged = false;
                                    return res.status(200).json({
                                      response: {
                                        result:'success',
                                        message:''
                                      },
                                      publicExercises:[],
                                      privateExercises:[],
                                      publicChanged:publicChanged,
                                      privateChanged:privateChanged,
                                      publicExercisesChangeCount:lastpublicchangecount.rows[0].lastPublicChangeCount,
                                      privateExercisesChangeCount:userDetail.privateexerciseschangecount
                                      // idUser:idUser,
                                    });
                                    
                                  }
                                  if(userDetail.privateexerciseschangecount === privateExercisesChangeCount){
                                    privateChanged = false;
                                    return res.status(200).json({
                                      response: {
                                        result:'success',
                                        message:''
                                      },
                                      publicExercises:[],
                                      privateExercises:[],
                                      publicChanged:publicChanged,
                                      privateChanged:privateChanged,
                                      publicExercisesChangeCount:lastpublicchangecount.rows[0].lastPublicChangeCount,
                                      privateExercisesChangeCount:userDetail.privateexerciseschangecount
                                      // idUser:idUser,
                                    });
                                  }
                                 
                                }
                                if(lastpublicchangecount.rows[0].lastPublicChangeCount === publicExercisesChangeCount){
                                  publicChanged = false;
                                  if(userDetail.privateexerciseschangecount > privateExercisesChangeCount){
                                    privateChanged = true;
                                    pool.query('SELECT * FROM private_exercise_handler WHERE owner = $1',[idUser], async (error, resultsPrivateExercise) => {
                                      if (error) {
                                        console.log(error)
                                        // res.status(400).json({
                                        //   response: {
                                        //     result: 'errorRequest',
                                        //     message: error
                                        //   }
                                        // });
                                      }
                                        // privateExercises = _.orderBy(privateExercises, ['?'],['desc'])
                                      // console.log('RESULT OF Private TRAININGS : ! ',resultsPrivateExercise.rows[0])

                                        let arrayOfPrivateExercises =  resultsPrivateExercise.rows
                                        arrayOfPrivateExercises = _.orderBy(arrayOfPrivateExercises, ['header.title'],['asc'])
                                        if(userDetail.exercises.length > 0 ){
                                          console.log('Les exos privés mode webapp',arrayOfPrivateExercises)
                                        }
                                        return res.status(200).json({
                                        response: {
                                          result:'success',
                                          message:''
                                        },
                                        publicExercises:[],
                                        privateExercises:arrayOfPrivateExercises,
                                        publicChanged:publicChanged,
                                        privateChanged:privateChanged,
                                        publicExercisesChangeCount:lastpublicchangecount.rows[0].lastPublicChangeCount,
                                        privateExercisesChangeCount:userDetail.privateexerciseschangecount
                                        // idUser:idUser,
                                      });
                                    })
                                  }
                                  if(userDetail.privateexerciseschangecount < privateExercisesChangeCount){
                                    privateChanged = false;
                                    return res.status(200).json({
                                      response: {
                                        result:'success',
                                        message:''
                                      },
                                      publicExercises:[],
                                      privateExercises:[],
                                      publicChanged:publicChanged,
                                      privateChanged:privateChanged,
                                      publicExercisesChangeCount:lastpublicchangecount.rows[0].lastPublicChangeCount,
                                      privateExercisesChangeCount:userDetail.privateexerciseschangecount
                                      // idUser:idUser,
                                    });
                                  }
                                  if(userDetail.privateexerciseschangecount === privateExercisesChangeCount){
                                    privateChanged = false;
                                    return res.status(200).json({
                                      response: {
                                        result:'success',
                                        message:''
                                      },
                                      publicExercises:[],
                                      privateExercises:[],
                                      publicChanged:publicChanged,
                                      privateChanged:privateChanged,
                                      publicExercisesChangeCount:lastpublicchangecount.rows[0].lastPublicChangeCount,
                                      privateExercisesChangeCount:userDetail.privateexerciseschangecount
                                      // idUser:idUser,
                                    });
                                  }
                                }
                              }
                            }
                          });
                        }
                      }

                      if(webapp !== '1'){
                        // !!
                        console.log('WE ARE IN APP !!! ');
                        return res.status(200).json({
                          response: {
                            result:'success',
                            message:'noExercise'
                          },
                          publicExercises:[],
                          privateExercises:[],
                          publicChanged:false,
                          privateChanged:false,
                          publicExercisesChangeCount:0,
                          privateExercisesChangeCount:0
                          // idUser:idUser,
                        });
                      }
                      //////
                      //////

                    }
            }else{
              // Si le user n'a pas de selected exercises
              console.log('No selected exercises')
              console.log('lets get last public')

              if(webapp === '1'){
                // !!
                console.log('WE ARE IN WEB APP 2!!! ');
              }

              if(webapp !== '1'){
                // !!
                console.log('WE ARE IN APP 2!!! ');
              }

              const lastpublicchangecount = await pool.query('SELECT "lastPublicChangeCount" FROM global_handler', async (error, lastpublicchangecount) => {
                if (error) {
                  console.log(error)
                  // res.status(400).json({
                  //   response: {
                  //     result: 'errorRequest',
                  //     message: error
                  //   }
                  // });
      
                }
                else{
                  if(lastpublicchangecount.rows !== undefined){
                    // si nous avons bien un résultat dans le global handler
                    console.log('result after get last result !!! ')
                    console.log('result lastpublicchangecount : ', lastpublicchangecount.rows[0].lastPublicChangeCount , 'le send is : ', publicExercisesChangeCount)
                    if(lastpublicchangecount.rows[0].lastPublicChangeCount > publicExercisesChangeCount){
                      publicChanged = true;
                      
                      
                      const resSelect = await pool.query('SELECT * FROM public_exercise_handler WHERE status = $1',['public'], async (error, resultsExercisePublic) => {
                        if (error) {
                          console.log(error)
                          // res.status(400).json({
                          //   response: {
                          //     result: 'errorRequest',
                          //     message: error
                          //   }
                          // });
                        }
                        if(userDetail.privateexerciseschangecount > privateExercisesChangeCount){
                          privateChanged = true;
                          pool.query('SELECT * FROM private_exercise_handler WHERE owner = $1',[idUser], async (error, resultsPrivateExercise) => {
                            if (error) {
                              console.log(error)
                              // res.status(400).json({
                              //   response: {
                              //     result: 'errorRequest',
                              //     message: error
                              //   }
                              // });
                            }

                            console.log('RESULT OF Private TRAININGS : ! ',resultsPrivateExercise.rows[0])
                            let arrayOfPublicExercises =  resultsExercisePublic.rows
                            arrayOfPublicExercises = _.orderBy(arrayOfPublicExercises, ['header.title'],['asc'])
                            let arrayOfPrivateExercises =  resultsPrivateExercise.rows
                            arrayOfPrivateExercises = _.orderBy(arrayOfPrivateExercises, ['header.title'],['asc'])
                            return res.status(200).json({
                              response: {
                                result:'success',
                                message:''
                              },
                              publicExercises:arrayOfPublicExercises,
                              privateExercises:arrayOfPrivateExercises,
                              publicChanged:publicChanged,
                              privateChanged:privateChanged,
                              publicExercisesChangeCount:lastpublicchangecount.rows[0].lastPublicChangeCount,
                              privateExercisesChangeCount:userDetail.privateexerciseschangecount
                              // idUser:idUser,
                            });
                          })

                        }
                        if(userDetail.privateexerciseschangecount < privateExercisesChangeCount){
                          let arrayOfPublicExercises =  resultsExercisePublic.rows
                          arrayOfPublicExercises = _.orderBy(arrayOfPublicExercises, ['header.title'],['asc'])

                          privateChanged = false;
                          return res.status(200).json({
                            response: {
                              result:'success',
                              message:''
                            },
                            publicExercises:arrayOfPublicExercises,
                            privateExercises:[],
                            publicChanged:publicChanged,
                            privateChanged:privateChanged,
                            publicExercisesChangeCount:lastpublicchangecount.rows[0].lastPublicChangeCount,
                            privateExercisesChangeCount:userDetail.privateexerciseschangecount

                            // idUser:idUser,
                          });
                        }
                        if(userDetail.privateexerciseschangecount === privateExercisesChangeCount){
                          let arrayOfPublicExercises =  resultsExercisePublic.rows
                          arrayOfPublicExercises = _.orderBy(arrayOfPublicExercises, ['header.title'],['asc'])

                          privateChanged = false;
                          return res.status(200).json({
                            response: {
                              result:'success',
                              message:''
                            },
                            publicExercises:arrayOfPublicExercises,
                            privateExercises:[],
                            publicChanged:publicChanged,
                            privateChanged:privateChanged,
                            publicExercisesChangeCount:lastpublicchangecount.rows[0].lastPublicChangeCount,
                            privateExercisesChangeCount:userDetail.privateexerciseschangecount

                            // idUser:idUser,
                          });
                        }
                        // console.log('Result du get exo : ! ',results)

                      });
                    }
                    if(lastpublicchangecount.rows[0].lastPublicChangeCount < publicExercisesChangeCount){
                      publicChanged = false;

                      if(userDetail.privateexerciseschangecount > privateExercisesChangeCount){
                        privateChanged = true;
                        
                        pool.query('SELECT * FROM private_exercise_handler WHERE owner = $1',[idUser], async (error, resultsPrivateExercise) => {
                          if (error) {
                            console.log(error)
                            // res.status(400).json({
                            //   response: {
                            //     result: 'errorRequest',
                            //     message: error
                            //   }
                            // });
                          }

                          console.log('RESULT OF Private TRAININGS : ! ',resultsPrivateExercise.rows[0])


                          let arrayOfPrivateExercises =  resultsPrivateExercise.rows
                          arrayOfPrivateExercises = _.orderBy(arrayOfPrivateExercises, ['header.title'],['asc'])
                          return res.status(200).json({
                            response: {
                              result:'success',
                              message:''
                            },
                            publicExercises:[],
                            privateExercises:arrayOfPrivateExercises,
                            publicChanged:publicChanged,
                            privateChanged:privateChanged,
                            publicExercisesChangeCount:lastpublicchangecount.rows[0].lastPublicChangeCount,
                            privateExercisesChangeCount:userDetail.privateexerciseschangecount
                            // idUser:idUser,
                          });
                        })


                      }
                      if(userDetail.privateexerciseschangecount < privateExercisesChangeCount){
                        privateChanged = false;
                        return res.status(200).json({
                          response: {
                            result:'success',
                            message:''
                          },
                          publicExercises:[],
                          privateExercises:[],
                          publicChanged:publicChanged,
                          privateChanged:privateChanged,
                          publicExercisesChangeCount:lastpublicchangecount.rows[0].lastPublicChangeCount,
                          privateExercisesChangeCount:userDetail.privateexerciseschangecount

                          // idUser:idUser,
                        });
                      }
                      if(userDetail.privateexerciseschangecount === privateExercisesChangeCount){
                        privateChanged = false;


                        return res.status(200).json({
                          response: {
                            result:'success',
                            message:''
                          },
                          publicExercises:[],
                          privateExercises:[],
                          publicChanged:publicChanged,
                          privateChanged:privateChanged,
                          publicExercisesChangeCount:lastpublicchangecount.rows[0].lastPublicChangeCount,
                          privateExercisesChangeCount:userDetail.privateexerciseschangecount

                          // idUser:idUser,
                        });
                      }
                    }
                    if(lastpublicchangecount.rows[0].lastPublicChangeCount === publicExercisesChangeCount){
                      publicChanged = false;
                      if(userDetail.privateexerciseschangecount > privateExercisesChangeCount){
                        privateChanged = true;
                        
                        pool.query('SELECT * FROM private_exercise_handler WHERE owner = $1',[idUser], async (error, resultsPrivateExercise) => {
                          if (error) {
                            console.log(error)
                            // res.status(400).json({
                            //   response: {
                            //     result: 'errorRequest',
                            //     message: error
                            //   }
                            // });
                          }

                          console.log('RESULT OF Private TRAININGS : ! ',resultsPrivateExercise.rows[0])

                          let arrayOfPrivateExercises =  resultsPrivateExercise.rows
                          arrayOfPrivateExercises = _.orderBy(arrayOfPrivateExercises, ['header.title'],['asc'])
                          return res.status(200).json({
                            response: {
                              result:'success',
                              message:''
                            },
                            publicExercises:[],
                            privateExercises:arrayOfPrivateExercises,
                            publicChanged:publicChanged,
                            privateChanged:privateChanged,
                            publicExercisesChangeCount:lastpublicchangecount.rows[0].lastPublicChangeCount,
                            privateExercisesChangeCount:userDetail.privateexerciseschangecount
                            // idUser:idUser,
                          });
                        })


                      }
                      if(userDetail.privateexerciseschangecount < privateExercisesChangeCount){
                        privateChanged = false;
                        return res.status(200).json({
                          response: {
                            result:'success',
                            message:''
                          },
                          publicExercises:[],
                          privateExercises:[],
                          publicChanged:publicChanged,
                          privateChanged:privateChanged,
                          publicExercisesChangeCount:lastpublicchangecount.rows[0].lastPublicChangeCount,
                          privateExercisesChangeCount:userDetail.privateexerciseschangecount

                          // idUser:idUser,
                        });
                      }
                      if(userDetail.privateexerciseschangecount === privateExercisesChangeCount){
                        privateChanged = false;


                        return res.status(200).json({
                          response: {
                            result:'success',
                            message:''
                          },
                          publicExercises:[],
                          privateExercises:[],
                          publicChanged:publicChanged,
                          privateChanged:privateChanged,
                          publicExercisesChangeCount:lastpublicchangecount.rows[0].lastPublicChangeCount,
                          privateExercisesChangeCount:userDetail.privateexerciseschangecount

                          // idUser:idUser,
                        });
                      }
                    }
                  }
                }
              });
            }
          }
        });



        
   
        // If the last update is upper than the last storage
        
      }
    })
  }catch(error){ return res.status(500).json(error.message) }

});


router.post('/updateExercise', function(req, res) {
  let token = req.headers.token;
  let data = req.body
  delete data.json.selected;
  console.log('data to update exercise', data.json)

  // console.log('token to update exercise', token)
  console.log('token to update exercise', data.id)
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
        if(data.json.header.status === "private"){
          const resultsOfUpdate = pool.query('UPDATE private_exercise_handler SET header = $1, steps = $2 WHERE id = $3',
              [data.json.header, data.json.steps, data.json.id],
              (error, results) => {
                if (error) {
                  throw error
                }
                return res.status(200).json({
                  response: {
                    result:'success',
                    message:''
                  },
                  data: data.json
                });
               
              })  
      }
        
        else{
          const resultsOfUpdate = pool.query('UPDATE public_exercise_handler SET header = $1, steps = $2 WHERE id = $3',
            [data.json.header, data.json.steps, data.json.id],
            (error, results) => {
              if (error) {
                throw error
              }
              return res.status(200).json({
                response: {
                  result:'success',
                  message:''
                },
              });
              console.log('User modified with ID:',results.rows)
            })
          }
        
        // no error token
        
       }
    })
  }catch(error){ return res.status(500).json(error.message) }
});


router.post('/deleteExercise', function(req, res) {
  let token = req.headers.token;
  let data = req.body
  // delete data.json.selected;
  console.log('data delete exercise', data)
  if(data.json.status === 'private'){
    pool.query('DELETE FROM private_exercise_handler WHERE id = $1', [data.json.header.id], (error, results) => {
      if (error) {
        throw error
      }
      console.log('we deleted this exercise ::! ', results.rows[0])
      return res.status(200).json({
        response: {
          result:'success',
          message:''
        },
      });
    })
  }else{
    pool.query('DELETE FROM public_exercise_handler WHERE id = $1', [data.json.header.id], (error, results) => {
      if (error) {
        throw error
      }
      console.log('we deleted this exercise ::! ', results.rows[0])
      return res.status(200).json({
        response: {
          result:'success',
          message:''
        },
      });
    })
  }
  
})


module.exports = router;
