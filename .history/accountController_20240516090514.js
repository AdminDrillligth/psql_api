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
	console.log('account')
  res.status(200).json({
       response: {
          result: 'success',
          message: 'account_handler'
       },
  });
});

router.post('/createAccount',async function(req, res) {
      let bodyOfRequest = req.body;
      console.log('req headers Create Account : : ', req.headers.token)
      token = req.headers.token
      console.log('req headers Create Account WITHOUT TEST : : ', token)
      // console.log('createAccount',bodyOfRequest )
      let dataBodyOfRequest = bodyOfRequest.data;
      // console.log('createAccount',dataBodyOfRequest )
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
            let newUuid = uuidv4();
            let email = "";
            let passwordHash = "";
            let firstName = "";
            let familyName = "";
            let fullName = "";
            let avatarURL = "";
            let birthdate = "";
            let simpleBirthdate = "";
            let address1 = "";
            let address2 = "";
            let zip = "";
            let city = "";
            let region = "";
            let phone = "";
            let comment = "";
            let rights = [];
            let users = [];
            let staff = [];
            let econes = [];
            let trainings = [];
            let videos = [];
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
      
            if(dataBodyOfRequest.birthdate !== undefined){ birthdate = dataBodyOfRequest.birthdate}
            if(dataBodyOfRequest.simpleBirthdate !== undefined){ simpleBirthdate = dataBodyOfRequest.simpleBirthdate}
            if(dataBodyOfRequest.address1 !== undefined){ address1 = dataBodyOfRequest.address1}
            if(dataBodyOfRequest.address2 !== undefined){ address2 = dataBodyOfRequest.address2}
            if(dataBodyOfRequest.zip !== undefined){ zip = dataBodyOfRequest.zip}
            if(dataBodyOfRequest.city !== undefined){ city = dataBodyOfRequest.city}
            if(dataBodyOfRequest.region !== undefined){ region = dataBodyOfRequest.region}
            if(dataBodyOfRequest.phone !== undefined){ phone = dataBodyOfRequest.phone}
            if(dataBodyOfRequest.comment !== undefined){ comment = dataBodyOfRequest.comment}
      
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
                owner:owner,
                role:role,
                email: email,
                passwordHash:passwordHash,
                firstName: firstName,
                familyName: familyName,
                fullName: fullName,
                avatarURL: avatarURL,
                personalInfo: {
                    birthdate: birthdate,
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
                privateExercisesChangeCount:0,
                staff: staff,
                econes: econes,
                trainings: trainings,
                videos: videos,
                licensed: licensed,
                warning:warning,
                date:DateString,
                dateIso:isoDateString,
                update:DateString,
                privateFirmwareId:privateFirmwareId,
                updateIso:isoDateString,
                privateOnly:privateOnly
            }
              const resp = pool.query( "INSERT INTO account_handler ( id, role, owner, email, passwordHash, firstName, familyName, fullName , personalInfo, privileges, users, staff, econes, trainings, videos, licensed, warning, date, dateIso, update, updateIso, privateOnly ) VALUES ($1, $2,$3, $4,$5, $6,$7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) RETURNING *",
                [userObject.id,  userObject.role, userObject.owner, userObject.email, userObject.passwordHash, userObject.firstName, userObject.familyName, userObject.fullName , userObject.personalInfo, userObject.privileges, userObject.users, userObject.staff, userObject.econes, userObject.trainings, userObject.videos, userObject.licensed, userObject.warning, userObject.date, userObject.dateIso, userObject.update, userObject.updateIso, userObject.privateOnly ]
              , (error, results) => {if (error) { throw error }
                console.log(`User added with ID: ${results.rows[0].id}`);
                // console.log(userObject);
                res.status(200).json({
                  response: {
                    result: 'success',
                    message: ''
                  },
                  account: userObject
                });
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
                delete results.rows[0].passwordhash;
                if(results.rows[0].role === 'admin'){
                   accountSelected = results.rows[0];
                  //  console.log('RESULTS AFTER SELECT ADMIN : ', accountSelected.users, accountSelected.users.length)
                   if(accountSelected.users.length > 0){
                    accountUsers = []
                    accountSelected.users.forEach(async user => {
                      // console.log('RESP OF FOR EACH : ',user)
                      const selectUser = await pool.query('SELECT * FROM account_handler WHERE id = $1',[user.id], async (error, resultsUser) => {
                        if (error) {
                          console.log(error)
                        }
                        validateUser = false;
                        console.log('RESULT USERS OF GET DETAILS :  ID ??! ', resultsUser.rows[0].id)
                        // console.log(resultsUser.rows[0].passwordhash,resultsUser.rows[0].passwordHash)
                        if(resultsUser.rows[0].passwordhash !== undefined){
                          validateUser = true;
                        }
                        console.log('RESULT USERS OF GET DETAILS :  ! ', resultsUser.rows[0].id)
                        accountUsers.push({validate:validateUser, id: resultsUser.rows[0].id, email:resultsUser.rows[0].email, fullName:resultsUser.rows[0].fullname,familyName:resultsUser.rows[0].familyname, firstName: resultsUser.rows[0].firstname });
                        console.log('RESULT OBJECT :  ! ', accountUsers)
                        
                      });     
                    });

                   }
                   res.status(200).json({
                    response: {
                      result: 'success',
                      message: ''
                    },
                    account:results.rows[0]
                  });
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
                  delete results.rows[0].passwordhash;
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
                    if (error) {
                      console.log(error)
                    }
                    console.log('let gets owners and admins', results.rowCount)
                    // console.log('let gets owners and admins', results.rows)
                    results.rows.forEach(account =>{
                      usersAccount = 0;
                      if(account.staff !== null){
                        usersAccount = account.staff.length;
                      }
                      if(account.users !== null){
                        usersAccount = usersAccount + account.users.length;
                      }
                      console.log('LENGTH USERS :  ! ',account.id, usersAccount)
                      let validate = false;
                      if(account.passwordhash !== undefined){
                        validate = true;
                      }
                      // UsersOfAccount.push({
                      //   fullName:account.data.fullName,
                      //   familyName:account.data.familyName,
                      //   firstName:account.data.firstName,
                      //   id:account.data.id,
                      //   email:account.data.email,
                      //   role:account.data.role,
                      //   validate: validate
                      // })
                      // console.log('DETAIL OF ACCOUNT SELECT : ',account.id, validate)
                      accountsAdminsOwners.push({validate: validate, id:account.id, email:account.email, role:account.role, fullName:account.fullname, familyName:account.familyname, firstName:account.firstname, })
                    })
                    // console.log(results)
                    res.status(200).json({
                      response: { result: 'success', message: '' },

                      accounts:results.rows
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

router.get('/updateAccount', async (req, res) => {
  let bodyOfRequest = req.body;
  let dataBodyOfRequest = bodyOfRequest.data;
  let resetPassword = bodyOfRequest.resetpassword;
  let headers = req.headers;
  let token = headers.token;
  let idUser = dataBodyOfRequest.id;
  let userDetail  = '';
  
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
          if(resetPassword === true){
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
            return res.status(200).json({
              response: {
                result:'success',
                message:'updatedAccount'
              },
              dataBodyOfRequest:dataBodyOfRequest
            });
            // let userhandlerProfil = await db.collection('account-handler').where('id', '==', idUser).get();
            
            // userhandlerProfil.forEach((doc:any) =>{
            // userDetail = doc.data();
            // let idOfUser = doc.id;
            // sendEmailthisanUpdate(userDetail)
            // if(userDetail !== ""){
            //   if(dataBodyOfRequest.email !== undefined){ userDetail.email = dataBodyOfRequest.email }
            //   if(dataBodyOfRequest.passwordHash !== undefined){ userDetail.passwordHash = dataBodyOfRequest.passwordHash }
            //   if(dataBodyOfRequest.firstName !== undefined){ userDetail.firstName = dataBodyOfRequest.firstName }
            //   if(dataBodyOfRequest.familyName !== undefined){ userDetail.familyName = dataBodyOfRequest.familyName }
            //   if(dataBodyOfRequest.fullName !== undefined){ userDetail.fullName = dataBodyOfRequest.firstName + ' '+dataBodyOfRequest.familyName }
            //   if(dataBodyOfRequest.avatarURL !== undefined){ userDetail.avatarURL = dataBodyOfRequest.avatarURL }
            //   if(dataBodyOfRequest.role !== undefined){ userDetail.role = dataBodyOfRequest.role }
            //       if(dataBodyOfRequest.personalInfo !== undefined){
            //           if(dataBodyOfRequest.personalInfo.birthdate !== undefined){ userDetail.personalInfo.birthdate = dataBodyOfRequest.personalInfo.birthdate }
            //           if(dataBodyOfRequest.personalInfo.simpleBirthdate !== undefined){ userDetail.personalInfo.simpleBirthdate = dataBodyOfRequest.personalInfo.simpleBirthdate }
            //           if(dataBodyOfRequest.personalInfo.address1 !== undefined){ userDetail.personalInfo.address1 = dataBodyOfRequest.personalInfo.address1 }
            //           if(dataBodyOfRequest.personalInfo.address2 !== undefined){ userDetail.personalInfo.address2 = dataBodyOfRequest.personalInfo.address2 }
            //           if(dataBodyOfRequest.personalInfo.zip !== undefined){ userDetail.personalInfo.zip = dataBodyOfRequest.personalInfo.zip }
            //           if(dataBodyOfRequest.personalInfo.city !== undefined){ userDetail.personalInfo.city = dataBodyOfRequest.personalInfo.city }
            //           if(dataBodyOfRequest.personalInfo.region !== undefined){ userDetail.personalInfo.region = dataBodyOfRequest.personalInfo.region }
            //           if(dataBodyOfRequest.personalInfo.phone !== undefined){ userDetail.personalInfo.phone = dataBodyOfRequest.personalInfo.phone }
            //           if(dataBodyOfRequest.personalInfo.comment !== undefined){ userDetail.personalInfo.comment = dataBodyOfRequest.personalInfo.comment }
            //       }
            //       if(dataBodyOfRequest.privileges !== undefined){
            //             if(dataBodyOfRequest.privileges.rights !== undefined){ userDetail.privileges.rights = dataBodyOfRequest.privileges.rights }
            //       }
            //   if(dataBodyOfRequest.users !== undefined){ userDetail.users = dataBodyOfRequest.users }
            //   if(dataBodyOfRequest.staff !== undefined){ userDetail.staff = dataBodyOfRequest.staff }
            //   if(dataBodyOfRequest.econes !== undefined){ userDetail.econes = dataBodyOfRequest.econes }
            //   if(dataBodyOfRequest.trainings !== undefined){ userDetail.trainings = dataBodyOfRequest.trainings }
            //   if(dataBodyOfRequest.videos !== undefined){ userDetail.videos = dataBodyOfRequest.videos }
            //   if(dataBodyOfRequest.licensed !== undefined){ userDetail.licensed = dataBodyOfRequest.licensed }
            //   if(dataBodyOfRequest.warning !== undefined){ userDetail.warning = dataBodyOfRequest.warning }
            //   if(dataBodyOfRequest.privateOnly !== undefined){ userDetail.privateOnly = dataBodyOfRequest.privateOnly }
            //   if(dataBodyOfRequest.privateFirmwareId !== undefined){ userDetail.privateFirmwareId = dataBodyOfRequest.privateFirmwareId }
  
  
  
            //   userDetail.update = DateString;
            //   userDetail.updateIso = isoDateString;
            //   // functions.logger.log("ACCOUNT UPDATE DETAILS NEW USER DETAIL : ",userDetail )
            //   // const account_handler = db.collection('account-handler');
            //   // account_handler.doc(idOfUser).update(userDetail).then((ref:any) => {
            //   //     return res.status(200).json({
            //   //       response: {
            //   //         result:'success',
            //   //         message:''
            //   //       },
            //   //       account:userDetail
            //   //     });
            //   //   });
            // }else{
            //   return res.status(200).json({
            //     response: {
            //       result:'noUserError',
            //       message:''
            //     },
            //   });
            // }
          // });
          }   
      }
    });
   }
  catch(error) { return res.status(500).json(error.message) }
})


module.exports = router;