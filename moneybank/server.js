var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var ejs = require('ejs');

var Money = require('./models/money');
var moneyController = require('./controllers/money');
var userController = require('./controllers/user');
var clientController = require('./controllers/client');
var oauth2Controller = require('./controllers/oauth2');


var passport = require('passport');
var authController = require('./controllers/auth');
const path = require('path');

mongoose.connect('mongodb://localhost:27017/bank');

var app = express();
console.log(__dirname)
app.use(express.static(path.join(__dirname, '../reactdashboard/src/client/public')))
app.use(express.static(path.join(__dirname, '../reactdashboard/src/client/dist')))

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8181");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,credentials,Authorization");
  res.header("Access-Control-Allow-Methods", "*");
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(session({
  secret: 'blah$ blah$',
  saveUninitialized: true,
  resave: true
}));


app.get('/dashboard',(req, res) => {
  res.sendFile('../reactdashboard/src/client/index.html', { root: __dirname });
})

app.use(passport.initialize());

var port = process.env.PORT || 3000;

var router = express.Router();

router.route('/money')
  .post(authController.isAuthenticated, moneyController.postMoney)
  .get(authController.isAuthenticated, moneyController.getMoney);

router.route('/money/:trans_id')
  .get(authController.isAuthenticated, moneyController.getTrans)
  .put(authController.isAuthenticated, moneyController.updateTrans)
  .delete(authController.isAuthenticated, moneyController.deleteTrans);

router.route('/users')
  .post(userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers);

router.route('/clients')
  .post(authController.isAuthenticated, clientController.postClients)
  .get(authController.isAuthenticated, clientController.getClients)

// Create endpoint handlers for oauth2 authorize
router.route('/oauth2/authorize')
  .get(authController.isAuthenticated, oauth2Controller.authorization)
  .post(authController.isAuthenticated, oauth2Controller.decision);

// Create endpoint handlers for oauth2 token
router.route('/oauth2/token')
  .post(authController.isClientAuthenticated, oauth2Controller.token);

app.use('/api', router);

app.listen(port);
console.log('Add money on port ' + port);