
const express = require('express')
const path = require('path');
const secret = require('./config/secret')
var rp = require('request-promise');
var bodyParser = require('body-parser');

const run = () => {
  const app = express()

  app.use(express.static(path.join(__dirname, 'client/public')))
  app.use(express.static(path.join(__dirname, 'client/dist')))
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.get('/', (req, res) => {
    if (req.query.code) {
      var options = {
        method: 'POST',
        uri: 'http://localhost:3000/api/oauth2/token',
        form: {
          code: req.query.code,
          grant_type: 'authorization_code',
          redirect_uri: secret.redirect_uri
        },
        headers: {
          "Authorization": "Basic " + new Buffer(secret.clientID + ":" + secret.clientSecret).toString("base64")
        }
      };
      rp(options)
        .then(function (parsedBody) {
          res.cookie('auth', parsedBody, { maxAge: 300000, httpOnly: false })
          res.cookie('authErr', '', { maxAge: 300000, httpOnly: false })
          res.redirect('/dashboard');
        })
        .catch(function (err) {
          res.cookie('auth', '', { maxAge: 300000, httpOnly: false })
          res.cookie('authErr', err, { maxAge: 300000, httpOnly: false })
          res.redirect('/dashboard');
        });
    } else {
      res.redirect('/dashboard');
    }
  })
  app.get('/dashboard', (req, res) => {
    res.sendFile('client/index.html', { root: __dirname });
  })
  app.listen(8181, () => {
    console.log('listening on ', 'http:://localhost:8181');
  });
}

module.exports = {
  run
}
