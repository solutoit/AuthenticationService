var express = require('express'),
    bodyParser = require('body-parser'),
    oauthserver = require('oauth2-server'),
    model = require('./model.js');

var app = express();

app.use(bodyParser()); // REQUIRED

app.oauth = oauthserver({
    model: model,
    grants: ['password'],
    debug: true
});

app.all('/oauth/token', app.oauth.grant());

app.get('/', app.oauth.authorise(), function (req, res) {
    res.send('Secret area');
});

app.use(app.oauth.errorHandler());

var port = process.env.port || 3000;
app.listen(port);
