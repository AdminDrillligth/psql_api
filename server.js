const express = require('express')
var cors = require('cors');
const app = express()
const port = 3000

var tokenController = require("./tokenController");
var accountController = require("./accountController");
var resultController = require("./resultController");
var exerciseController = require("./exerciseController");
var econesController = require("./econesController");
var firmwareController = require("./firmwareController"); 


// Use middleware to set the default Content-Type
app.use(cors({ origin: ['https://devserver.drilllight.com/','http://localhost:4200','http://localhost:8100','https://drilllight.web.app','http://localhost:8100', 'capacitor://localhost','https://localhost']}));
app.use(express.json({limit: '50mb'}));
app.use(function (req, res, next) {
//    res.header('Content-Type': 'application/json, charset=utf-8');
    next();
});


app.get('/overview', (req, res) => {
   let json =  { status: 'votre requete est exécutée avec succés' };
   res.status(200).send(json);
})

app.use('/token', tokenController);

app.use('/account', accountController );

app.use('/result', resultController );

app.use('/exercise', exerciseController );

app.use('/econes', econesController );

app.use('/firmware', firmwareController );

app.listen(port, () => {
  console.log(`Api Drilllight en cours d'execution ! sur le port: ${port} ! launch ${new Date().toLocaleDateString('en-GB')}`)
})
