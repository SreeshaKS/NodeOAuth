
const express = require('express')
const path = require('path');
const secret = require('./config/secret')
var rp = require('request-promise');

const run = () => {
  const app = express()

  app.use(express.static(path.join(__dirname, 'client/public')))
  app.use(express.static(path.join(__dirname, 'client/dist')))

  app.get('/*', (req, res) => {
    if (req.params.code) {
      var options = {
        method: 'POST',
        uri: 'http://localhost:3000/api/oauth2/token',
        formData: {
          code: req.params.code,
          grant_type: 'authorization_code',
          redirect_uri: secret.redirect_uri
        },
        auth: {
          'user': secret.clientID,
          'pass': secret.clientSecret
        },
        json: true
      };

      rp(options)
        .then(function (parsedBody) {
          res.cookie('auth', parsedBody)
          res.sendFile('client/index.html', { root: __dirname });
        })
        .catch(function (err) {
          res.cookie('err', err)
          res.sendFile('client/index.html', { root: __dirname });
        });
    }
    res.sendFile('client/index.html', { root: __dirname });
  })

  app.listen(8181, () => {
    console.log('listening on ', 'http:://localhost:8181');
  });
}

module.exports = {
  run
}
