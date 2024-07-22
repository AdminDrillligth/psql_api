
var express = require('express');
var router = express.Router();
const { pool } = require("./db");
var jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
var _ = require('lodash');

router.use(function timeLog(req, res, next) {
  console.log('Time Account Function : ', new Date().toLocaleDateString('en-GB'));
  next();
});

router.get('/', function(req, res) {
	console.log('account')
  res.status(200).json({
       response: {
          result: 'success',
          message: 'account_handler'
       },
  });
});

router.post('/createAccount',async function(req, res) {
      var DateString = new Date().toLocaleDateString('en-GB');
      var isoDateString = new Date().toISOString();
      let bodyOfRequest = req.body;
      // console.log('req headers Create Account : : ', req.headers.token)
      token = req.headers.token
      // console.log('req headers Create Account WITHOUT TEST : : ', token)
      // console.log('createAccount',bodyOfRequest )
      let dataBodyOfRequest = bodyOfRequest.data;
      console.log('createAccount', dataBodyOfRequest )
      try{
        jwt.verify(token, 'secret', { expiresIn: '30d' }, async function(err, decoded) {
          if(err) {
            return res.status(200).json({
              response: {
                result:'expiredTokenError',
                message:'Votre token a expiré'
              }
            });
           } else {
            console.log("good request : !")
            let newUuid = uuidv4();
            let email = "";
            let passwordHash = "";
            let firstName = "";
            let familyName = "";
            let fullName = "";
            let avatarurl = "";
            let birthDate = "";
            let simpleBirthdate = "";
            let address1 = "";
            let address2 = "";
            let zip = "";
            let city = "";
            let region = "";
            let phone = "";
            let comment = "";
            let rights = [];
            let users = {};
            let staff = {};
            let econes = [];
            let trainings = {};
            let videos = {};
            let licensed = 10;
            let warning = false;
            let owner = "";
            let role = "user";
            let id = "";
            let privateOnly = false;
            let privateFirmwareId="";
            let userDetailOwner = []
            if(dataBodyOfRequest.id !== undefined){
              id = dataBodyOfRequest.id;
            }else{
              id = newUuid;
            }
            if(dataBodyOfRequest.owner !== undefined){
              const resSelect = await pool.query('SELECT * FROM account_handler WHERE id = $1',[dataBodyOfRequest.owner], (error, results) => {
                if (error) {
                  console.log(error)
                }
                if(results.rowCount === 0){
                  console.log('account owner ?')
                  res.status(200).json({
                    response: {
                       result: 'noAccountError',
                       message: ''
                    },
                  });
                }else{
                  userDetailOwner= results.rows[0];
                  console.log('LOG OWNER ACCOUNT: ! ' ,results.rows[0]);
                  if(dataBodyOfRequest.role === 'staff'){
                    if(userDetailOwner.staff === null){
                      userDetailOwner.staff = [];
                    }
                    userDetailOwner.staff.push(JSON.stringify({"id":id}));
                    const res = pool.query('UPDATE account_handler SET staff = $1 WHERE id = $2',
                    [userDetailOwner.staff, dataBodyOfRequest.owner],
                    (error, results) => {
                      if (error) {
                        throw error
                      }
                      console.log('User modified with ID:',results.rows)
                    })
                  }
                  console.log(dataBodyOfRequest.role)
                  if(userDetailOwner.users === null){
                    userDetailOwner.users = [];
                  }
                  if(dataBodyOfRequest.role === 'user' || dataBodyOfRequest.role === undefined){
                    userDetailOwner.users.push(JSON.stringify({"id":id}));
                    const res = pool.query('UPDATE account_handler SET users = $1 WHERE id = $2',
                    [userDetailOwner.users, dataBodyOfRequest.owner],
                    (error, results) => {
                      if (error) {
                        throw error
                      }
                      console.log('User modified with ID:',results.rows)
                    })
                  }
                }
              });
            }      
            if(dataBodyOfRequest.passwordHash !== undefined){ passwordHash = dataBodyOfRequest.passwordHash}
            if(dataBodyOfRequest.privateFirmwareId !== undefined){ privateFirmwareId = dataBodyOfRequest.privateFirmwareId}
            if(dataBodyOfRequest.firstName !== undefined){ firstName = dataBodyOfRequest.firstName}
            if(dataBodyOfRequest.familyName !== undefined){ familyName = dataBodyOfRequest.familyName}
            if(dataBodyOfRequest.fullName !== undefined){ fullName = dataBodyOfRequest.firstName  + ' ' +dataBodyOfRequest.familyName}
            if(dataBodyOfRequest.avatarURL !== undefined){ avatarURL = dataBodyOfRequest.avatarURL}
      
            if(dataBodyOfRequest.personalInfo.birthdate !== undefined){ birthdate = dataBodyOfRequest.personalInfo.birthDate}
            if(dataBodyOfRequest.personalInfo.simpleBirthdate !== undefined){ simpleBirthdate = dataBodyOfRequest.personalInfo.simpleBirthdate}
            if(dataBodyOfRequest.personalInfo.address1 !== undefined){ address1 = dataBodyOfRequest.personalInfo.address1}
            if(dataBodyOfRequest.personalInfo.address2 !== undefined){ address2 = dataBodyOfRequest.personalInfo.address2}
            if(dataBodyOfRequest.personalInfo.zip !== undefined){ zip = dataBodyOfRequest.personalInfo.zip}
            if(dataBodyOfRequest.personalInfo.city !== undefined){ city = dataBodyOfRequest.personalInfo.city}
            if(dataBodyOfRequest.personalInfo.region !== undefined){ region = dataBodyOfRequest.personalInfo.region}
            if(dataBodyOfRequest.personalInfo.phone !== undefined){ phone = dataBodyOfRequest.personalInfo.phone}
            if(dataBodyOfRequest.personalInfo.comment !== undefined){ comment = dataBodyOfRequest.personalInfo.comment}
      
            if(dataBodyOfRequest.rights !== undefined){ rights = dataBodyOfRequest.rights}
            if(dataBodyOfRequest.users !== undefined){ users = dataBodyOfRequest.users}
            if(dataBodyOfRequest.staff !== undefined){ staff = dataBodyOfRequest.staff}
            if(dataBodyOfRequest.econes !== undefined){ econes = dataBodyOfRequest.econes}
            if(dataBodyOfRequest.trainings !== undefined){ trainings = dataBodyOfRequest.trainings}
            if(dataBodyOfRequest.videos !== undefined){ videos = dataBodyOfRequest.videos}
            if(dataBodyOfRequest.licensed !== undefined){ licensed = dataBodyOfRequest.licensed}
            if(dataBodyOfRequest.warning !== undefined){ warning = dataBodyOfRequest.warning}
      
            if(dataBodyOfRequest.owner !== undefined){ owner = dataBodyOfRequest.owner}
            if(dataBodyOfRequest.role !== undefined){ role = dataBodyOfRequest.role}
            if(dataBodyOfRequest.privateOnly !== undefined){ privateOnly = dataBodyOfRequest.privateOnly}
            if(dataBodyOfRequest.email){

              email = dataBodyOfRequest.email;
              const userObject = {
                id: id,
                owner: owner,
                role: role,
                email: email,
                passwordhash: "",
                firstname: firstName,
                familyname: familyName,
                fullname: fullName,
                avatarurl: avatarurl,
                personalinfo: {
                    birthdate: birthDate,
                    simpleBirthdate: simpleBirthdate,
                    address1: address1,
                    address2: address2,
                    zip: zip,
                    city: city,
                    region: region,
                    phone: phone,
                    comment: comment
                },
                privileges: {
                    rights: rights
                },
                users:users,
                privateexerciseschangecount:0,
                staff: staff,
                econes: econes,
                trainings: trainings,
                videos: videos,
                licensed: licensed,
                warning:warning,
                date:DateString,
                dateiso:isoDateString,
                update:DateString,
                privatefirmwareid:privateFirmwareId,
                updateiso:isoDateString,
                privateonly:privateOnly
            }
            console.log(`User added with ID: `, userObject );
              const resp = pool.query( "INSERT INTO account_handler ( id, role, owner, email, passwordhash, firstname, familyname, fullname , personalinfo, privileges, users, staff, econes, trainings, videos, licensed, warning, date, dateiso, update, updateiso, privateonly, avatarurl ) VALUES ($1, $2,$3, $4,$5, $6,$7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23) RETURNING *",
                [userObject.id,  userObject.role, userObject.owner, userObject.email, userObject.passwordhash, userObject.firstname, userObject.familyname, userObject.fullname , userObject.personalinfo, userObject.privileges, userObject.users, userObject.staff, userObject.econes, userObject.trainings, userObject.videos, userObject.licensed, userObject.warning, userObject.date, userObject.dateiso, userObject.update, userObject.updateiso, userObject.privateonly, userObject.avatarurl ]
              , (error, results) => {if (error) { throw error }
              if(results){
                // console.log(`User added with ID: ${results.rows[0].id}`);
                  res.status(200).json({
                    response: {
                      result: 'success',
                      message: ''
                    },
                    account: userObject
                  });
                }
               
                // console.log(userObject);
              });
            }
           }
        })

      }catch(error){ return res.status(500).json(error.message)}

});


router.get('/getAccountDetails', function(req, res) {
	console.log('getAccountDetails')
  console.log('getToken',req.headers.token)
  console.log('getToken',req.headers.id)
  userId = "";
  userEmail="";
  accountUsers = [];
  accountStaff = [];
  try {
    if(req.headers.token !== undefined){
      token = req.headers.token;
      jwt.verify(token, 'secret', { expiresIn: '30d' }, async function(err, decoded) {
        if(err) {
          return res.status(200).json({
            response: {
              result:'expiredTokenError',
              message:'Votre token a expiré'
            },
          });
        }else {
          console.log('RESULTS ADMIN : ',req.headers.id)
          if(req.headers.id !== undefined){
            id = req.headers.id;
            const resSelect = await pool.query('SELECT * FROM account_handler WHERE id = $1',[id], async (error, results) => {
              if (error) {
                console.log(error)
              }
              console.log('RESULTS ADMIN :we get resp !')
              if(results.rowCount === 0){
                res.status(200).json({
                  response: {
                    result: 'noAccountError',
                    message: 'aucun utilisateur'
                  },
                });
              }
              if(results.rowCount === 1){
            
                // results.rows[0].role === 'owner' || 
                // console.log('RESULTS ADMIN DETAILS : ',results.rows[0].role)
               
                if(results.rows[0].role === 'admin' || results.rows[0].role === 'owner' ){
                   accountSelected = results.rows[0];
                      // let's make a CamelCase Object
                      // console.log('we get details: ', accountSelected)
                      let account = {
                        id: id,
                        owner:accountSelected.owner,
                        role:accountSelected.role,
                        email: accountSelected.email,
                        firstName: accountSelected.firstname,
                        familyName: accountSelected.familyname,
                        fullName: accountSelected.fullname,
                        avatarurl: accountSelected.avatarurl,
                        personalInfo: {
                            // birthdate: accountSelected.personalinfo.birthdate,
                            // simpleBirthdate: accountSelected.personalinfo.simplebirthdate,
                            // address1: accountSelected.personalinfo.address1,
                            // address2: accountSelected.personalinfo.address2,
                            // zip: accountSelected.personalinfo.zip,
                            // city: accountSelected.personalinfo.city,
                            // region: accountSelected.personalinfo.region,
                            // phone: accountSelected.personalinfo.phone,
                            // comment: accountSelected.personalinfo.comment
                            birthdate: "",
                            simpleBirthdate: "",
                            address1: "",
                            address2: "",
                            zip: "",
                            city: "",
                            region: "",
                            phone: "",
                            comment: ""
                        },
                        privileges: {
                            rights: accountSelected.privileges.rights
                        },
                        users:accountSelected.users,
                        privateExercisesChangeCount:accountSelected.privateexerciseschangecount,
                        staff: accountSelected.staff,
                        econes: accountSelected.econes,
                        trainings: accountSelected.trainings,
                        videos: accountSelected.videos,
                        licensed: accountSelected.licensed,
                        warning:accountSelected.warning,
                        date:accountSelected.date,
                        dateIso:accountSelected.dateiso,
                        update:accountSelected.update,
                        privateFirmwareId:accountSelected.privatefirmwareid,
                        updateIso:accountSelected.updateiso,
                        privateOnly:accountSelected.privateonly

                      }
                  //  console.log('RESULTS AFTER SELECT ADMIN : ', accountSelected.users, accountSelected.users.length)
                  if(accountSelected.users!== null && accountSelected.users.length > 0 && accountSelected.users !== undefined){
                      accountSelected.users.forEach(async user => {
                      // console.log('RESP OF FOR EACH : ',user)
                      const selectUser = await pool.query('SELECT * FROM account_handler WHERE id = $1',[user.id], async (error, resultsUser) => {
                        if (error) {
                          console.log(error)
                        }
                        validateUser = false;
                        console.log('password Hash????? ', user.id)
                        // console.log(resultsUser.rows[0].passwordhash)
                        if(resultsUser.rows !== undefined){
                          if(resultsUser.rows[0] !== undefined){
                            if(resultsUser.rows[0].passwordhash !== undefined && resultsUser.rows[0].passwordhash !== ""){
                              // console.log('RESULT USERS OF GET DETAILS :  passwordhash??! ', resultsUser.rows[0].passwordhash )
                              validateUser = true;
                            }
                            console.log('RESULT USERS OF GET DETAILS :  ! ', resultsUser.rows[0].id)
                            accountUsers.push({validate:validateUser, id: resultsUser.rows[0].id, email:resultsUser.rows[0].email, fullName:resultsUser.rows[0].fullname,familyName:resultsUser.rows[0].familyname, firstName: resultsUser.rows[0].firstname, role: resultsUser.rows[0].role });
                            console.log('RESULT OBJECT OF ACCOUNT USERS OF ACCOUNT:  ! ', accountUsers.length, accountSelected.users.length)
                            
                          }
                        }
                        if(accountUsers.length === accountSelected.users.length){
                          account.users = accountUsers;
                          account.users = _.orderBy(account.users, ['fullName'],['asc'])
                          console.log('ACCOUNT USER : ',accountUsers);
                          // 
                          if(accountSelected.staff !== null && accountSelected.staff.length > 0 && accountSelected.staff !== undefined){
                            accountSelected.staff.forEach(async staff => {
                             // console.log('RESP OF FOR EACH : ',user)
                             const selectUser = await pool.query('SELECT * FROM account_handler WHERE id = $1',[staff.id], async (error, resultsStaff) => {
                               if (error) {
                                 console.log(error)
                               }
                               validateStaff = false;
                               //console.log('password Hash????? ')
        
                               // console.log(resultsUser.rows[0].passwordhash)
                               if(resultsStaff.rows !== undefined){
                                 if(resultsStaff.rows[0] !== undefined){
                                   if(resultsStaff.rows[0].passwordhash !== undefined){
                                     //console.log('RESULT USERS OF GET DETAILS :  passwordhash??! ', resultsUser.rows[0].passwordhash )
                                     validateStaff = true;
                                   }
                                   //console.log('RESULT USERS OF GET DETAILS :  ! ', resultsStaff.rows[0].id)
                                   accountStaff.push({validate:validateStaff, id: resultsStaff.rows[0].id, email:resultsStaff.rows[0].email, fullName:resultsStaff.rows[0].fullname,familyName:resultsStaff.rows[0].familyname, firstName: resultsStaff.rows[0].firstname, role: resultsStaff.rows[0].role });
                                   
        
                                   //console.log('RESULT OBJECT OF ACCOUNT USERS OF ACCOUNT:  ! ', accountStaff)
                                 }
                                 
                               }
                               if(accountStaff.length === accountSelected.staff.length){
                                account.staff = accountStaff;
                                account.staff = _.orderBy(account.staff, ['fullName'],['asc'])
                                console.log('ACCOUNT STAFF : ',accountStaff);
                                console.log('END OF GET DETAILS');
                                delete account.passwordhash;
                                 res.status(200).json({
                                  response: {
                                    result: 'success',
                                    message: ''
                                  },
              
                                  account:account
                                });
                              }
                               
                             });     
                         
                           });
                           
                           
                          }else{
                            delete account.passwordhash;
                                 res.status(200).json({
                                  response: {
                                    result: 'success',
                                    message: ''
                                  },
              
                                  account:account
                            });
                          }
                        }  
                      });    
                      
                    });
                  }else{
                    // Si le compte n'a pas de users
                    if(accountSelected.staff !== null && accountSelected.staff.length > 0 && accountSelected.staff !== undefined){
                    
                      accountSelected.staff.forEach(async staff => {
                       // console.log('RESP OF FOR EACH : ',user)
                       const selectUser = await pool.query('SELECT * FROM account_handler WHERE id = $1',[staff.id], async (error, resultsStaff) => {
                         if (error) {
                           console.log(error)
                         }
                         validateStaff = false;
                         //console.log('password Hash????? ')
  
                         // console.log(resultsUser.rows[0].passwordhash)
                         if(resultsStaff.rows !== undefined){
                           if(resultsStaff.rows[0] !== undefined){
                             if(resultsStaff.rows[0].passwordhash !== undefined){
                               //console.log('RESULT USERS OF GET DETAILS :  passwordhash??! ', resultsUser.rows[0].passwordhash )
                               validateStaff = true;
                             }
                             //console.log('RESULT USERS OF GET DETAILS :  ! ', resultsStaff.rows[0].id)
                             accountStaff.push({validate:validateStaff, id: resultsStaff.rows[0].id, email:resultsStaff.rows[0].email, fullName:resultsStaff.rows[0].fullname,familyName:resultsStaff.rows[0].familyname, firstName: resultsStaff.rows[0].firstname, role: resultsStaff.rows[0].role });
                             //console.log('RESULT OBJECT OF ACCOUNT USERS OF ACCOUNT:  ! ', accountStaff)
                      }
                           
                    }
                    if(accountStaff.length === accountSelected.staff.length){
                          
                          account.staff = accountStaff;
                          account.staff = _.orderBy(account.staff, ['fullName'],['asc'])
                          console.log('ACCOUNT STAFF : ',accountStaff);
                          console.log('END OF GET DETAILS');
                          delete account.passwordhash;
                           res.status(200).json({
                            response: {
                              result: 'success',
                              message: ''
                            },
        
                            account:account
                          });
                      }   
                    });     
                   
                    });
                     
                     
                    }
                    else{
                      // Si il n'a pas de users ou de staff
                          delete account.passwordhash;
                           res.status(200).json({
                            response: {
                              result: 'success',
                              message: ''
                            },
                            account:account
                      });
                    }
                   }
                }else{
                  // Not owner or admin
                  res.status(200).json({
                    response: {
                      result: 'success',
                      message: ''
                    },
                    role:results.rows[0].role,
                    account:results.rows[0]
                  });
                }
              }
              if(results.rowCount > 1){
                console.log("ducplicate account error")
              }
            })
          }
          if(req.headers.email !== undefined){
            userEmail = req.headers.email;
            const resSelect = await pool.query('SELECT * FROM account_handler WHERE email = $1',[userEmail], (error, results) => {
              if (error) {
                console.log(error)
              }
              if(results.rowCount === 0){
                res.status(200).json({
                  response: { result: 'noAccountError',  message: 'aucun utilisateur' },
                });
              }
              if(results.rowCount === 1){
                if(results.rows[0].role === 'owner' || results.rows[0].role === 'admin'){
                  console.log('On vient de get le compte ', results.rows[0])
                  delete results.rows[0].passwordHash;
                  res.status(200).json({
                    response: { result: 'success', message: '' },
                    role:results.rows[0].role,
                    account:results.rows[0]
                  });
                }
                if(results.rows[0].role === 'staff' || results.rows[0].role === 'users'){
                  // Not owner or admin
                  res.status(200).json({
                    response: { result: 'success', message: '' },
                    role:'not admin or owner:  '+ results.rows[0].role,
                    account:results.rows[0]
                  });
                }
              }
              if(results.rowCount > 1){
                console.log("ducplicate account error")
              }
            })
          }
        }
      })
    }else{
      console.log("log error !! No token ?")
      // return res.status(200).json({
      //   response: {
      //     result:'TokenError',
      //     message:''
      //   },
      // });
    }
  }
  catch(error){ return res.status(500).json(error.message) }   
});


router.get('/getAccountsList', function(req, res) {
	console.log('getAccountsList')
  console.log('getToken',req.headers.token)
  console.log('getToken',req.headers.id)
  userId = "";
  userEmail="";
  try {
    if(req.headers.token !== undefined){
      token = req.headers.token;
      jwt.verify(token, 'secret', { expiresIn: '30d' }, async function(err, decoded) {
        if(err) {
          return res.status(200).json({
            response: {
              result:'expiredTokenError',
              message:'Votre token a expiré'
            },
          });
        }else {
          //no token error
          if(req.headers.id !== undefined){
            userId = req.headers.id;
            const resSelect = await pool.query('SELECT * FROM account_handler WHERE id = $1',[userId], async (error, results) => {
              if (error) {
                console.log('error no account: ! ', error)
              }
              if(results.rowCount === 0){
                res.status(200).json({
                  response: { result: 'noAccountError',  message: 'aucun utilisateur' },
                });
              }
              if(results.rowCount === 1){
                if(results.rows[0].role === 'admin'){
                  console.log('let gets owners and admins')
                  // console.log(results)
                  accountsAdminsOwners = []
                  const resSelect = await pool.query("SELECT * FROM account_handler WHERE role IN ('admin','owner')", (error, results) => {
                    console.log('on a recup les admins et les owners')
                    if (error) {
                      console.log(error)
                    }
                    // console.log('let gets owners and admins', results.rowCount)
                    // console.log('let gets owners and admins', results.rows)
                    results.rows.forEach(account =>{
                      usersAccount = 0;
                      if(account.staff !== null){
                        usersAccount = account.staff.length;
                      }
                      if(account.users !== null){
                        usersAccount = usersAccount + account.users.length;
                      }
                      // console.log('LENGTH USERS :  ! ',account.id, usersAccount)
                      let validate = false;
                      // console.log('details account',account)
                      if(account.passwordhash !== undefined && account.passwordhash !== ""){
                        validate = true;
                      }
                      // console.log('DETAIL OF EACH ACCOUNT : ',account)
                      
                      accountsAdminsOwners.push({validate: validate, id:account.id, email:account.email, role:account.role, fullName:account.fullname, familyName:account.familyname, firstName:account.firstname, licensed: usersAccount})
                      accountsAdminsOwners = _.orderBy(accountsAdminsOwners, ['fullName'],['asc'])
                    })
                    // console.log(results)
                    res.status(200).json({
                      response: { result: 'success', message: '' },

                      accounts:accountsAdminsOwners
                    });
                  })
                  
                }
              }
            })
          }
          // res.status(200).json({
          //   response: {
          //     result: 'success',
          //     message: ''
          //   },
          // });
        }
      })
    }
  }catch(error){return res.status(500).json(error.message)}
});

// ICI ON UPDATE AVEC LA FONCTION UPDATE ADMIN VIA PATCH
// REQUEST TEMPLATE

router.post('/updateAccount', async (req, res) => {
  var DateString = new Date().toLocaleDateString('en-GB');
  var isoDateString = new Date().toISOString();
  let bodyOfRequest = req.body;
  let dataBodyOfRequest = bodyOfRequest.data;
  let resetPassword = bodyOfRequest.resetpassword;
  let headers = req.headers;
  let token = headers.token;
  let idUser = dataBodyOfRequest.id;
  let userDetail  = '';
  // console.log('token', token)
  // console.log('idUser', idUser)
  // console.log('resetPassword', resetPassword)
  // console.log('resetPassword', resetPassword)
  console.log("bodyOfRequest : :", dataBodyOfRequest.privateOnly)
   try {
    jwt.verify(token, 'secret', { expiresIn: '30d' }, async function(err, decoded) {
      if(err) {
        return res.status(200).json({
          response: {
            result:'expiredTokenError',
            message:''
          },
        });
      } else {
          if(resetPassword === true && resetPassword !== undefined){
            // sendEmailResetPasswordAccount(dataBodyOfRequest)
            // sendEmailResetPassword(dataBodyOfRequest)
            return res.status(200).json({
              response: {
                result:'success',
                message:'resetPassword'
              },
              resetPassword:resetPassword,
              dataBodyOfRequest:dataBodyOfRequest
            });
          }else{
            const resSelect = await pool.query('SELECT * FROM account_handler WHERE id = $1',[idUser], async (error, results) => {
              if (error) {
                console.log('error no account: ! ', error)
              }
              if(results.rowCount === 0){
                res.status(200).json({
                  response: { result: 'noAccountError',  message: 'aucun utilisateur' },
                });
              }
              if(results.rowCount === 1){
                console.log("bodyOfRequest 2: :", dataBodyOfRequest.privateOnly)
                userDetail = results.rows[0];
                // console.log('the account BEFORE: ! ', userDetail)
                if(userDetail !== ""){
                      // userDetail.update = DateString;
                      // userDetail.updateIso = isoDateString;
                }
                console.log('USERS DETAILS', dataBodyOfRequest.users)
                dataBodyOfRequest.users.forEach((user)=>{
                  console.log('USER ID : ',user.id)
                  delete user.validate; delete user.email; delete user.fullName;delete user.familyName;delete user.firstName;delete user.role;
                })

                dataBodyOfRequest.staff.forEach((staff)=>{
                  console.log('USER ID : ',staff.id)
                  delete staff.validate; delete staff.email; delete staff.fullName;delete staff.familyName;delete staff.firstName;delete staff.role;
                })
                const resUpdate = pool.query('UPDATE account_handler SET email = $1, firstname = $2, familyname = $3, fullname = $4, avatarurl= $5, role =$6, personalinfo = $7, users = $8, staff = $9, econes = $10, trainings = $11, videos = $12, licensed = $13, warning = $14, privateonly = $15, privatefirmwareid = $16 WHERE id = $17',
                // Order to veritfy integrity of this model ! 
                  [ 
                    dataBodyOfRequest.email,
                    dataBodyOfRequest.firstName, 
                    dataBodyOfRequest.familyName,
                    dataBodyOfRequest.firstName + ' ' + dataBodyOfRequest.familyName,
                    dataBodyOfRequest.avatarurl, 
                    dataBodyOfRequest.role,
                    dataBodyOfRequest.personalInfo,
                    dataBodyOfRequest.users,
                    dataBodyOfRequest.staff,
                    dataBodyOfRequest.econes,
                    dataBodyOfRequest.trainings,  
                    dataBodyOfRequest.videos,
                    dataBodyOfRequest.licensed,
                    dataBodyOfRequest.warning,
                    dataBodyOfRequest.privateOnly,
                    dataBodyOfRequest.privateFirmwareId,
                    idUser
                  ],
                  (error, resultsUpdatedAccount) => {
                    if (error) {
                      throw error
                    }
                    console.log('User modified with ID:',resultsUpdatedAccount.rowCount)
                    if(resultsUpdatedAccount.rowCount > 0){
                      res.status(200).json({
                          response: {
                            result:'success',
                            message:'updatedAccount'
                          },
                          account:dataBodyOfRequest
                      });
                    }
                  })
              }
            });
          }   
      }
    });
   }
  catch(error) { return res.status(500).json(error.message) }
})

module.exports = router;