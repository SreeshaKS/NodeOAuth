
const express = require('express')
const path = require('path');
const secret = require('./config/secret')
var rp = require('request-promise');

const run = () => {
  const app = express()

  app.use(express.static(path.join(__dirname, 'client/public')))
  app.use(express.static(path.join(__dirname, 'client/dist')))

  app.get('/', (req, res) => {
    if (req.query.code) {
      console.log(secret.clientID + ":" + secret.clientSecret)
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
        /*,
        json: true*/
      };
      console.log(options)
      rp(options)
        .then(function (parsedBody) {
          res.cookie('auth', parsedBody)
          res.cookie('authErr', '')
          res.redirect('/dashboard')
          //res.sendFile('client/index.html', { root: __dirname });
        })
        .catch(function (err) {
          console.log(err.message)
          res.cookie('auth', '')
          res.cookie('authErr', err)
          res.redirect('/dashboard')
          //res.sendFile('client/index.html', { root: __dirname });
        });
    } else {
      res.redirect('/dashboard')
      //res.sendFile('client/index.html', { root: __dirname });
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
