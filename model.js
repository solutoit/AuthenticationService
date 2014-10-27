/*
 * Code reference: https://github.com/thomseddon/node-oauth2-server/blob/master/examples/postgresql/model.js
 * Instructions: https://github.com/thomseddon/node-oauth2-server
 * 
 * URL: http://qaenv1authservice.azurewebsites.net/oauth/token
 * grant_type=password&username=asaf&password=po09!@QW
 * Headers:
 *     Authorization:   Basic ZHVtbXlfY2xpZW50X2lkOmR1bW15X2NsaWVudF9zZWNyZXQ=  //the hash is the result of base64(dummy_client_id:dummy_client_secret)
 *     Content-Type:    application/x-www-form-urlencoded
 * 
 * This is the expeted response:
 * {
 *  "token_type": "bearer",
 *  "access_token": "1d8c5296899379797df71116641af52cb56d860c",
 *  "expires_in": 3600
 * }
 *
 */
var model = module.exports,
  connString = process.env.DATABASE_URL;

var accessTokensByBearerToken = {};
var clientsByClientId = {};
var usersByUsername = {};

(function () {
    accessTokensByBearerToken["dummy"] = {
        access_token: "dummy_access_token",
        client_id: "dummy_client_id",
        expires: "dummy_expires",
        userId: "dummy_userId",
    };

    clientsByClientId["dummy_client_id"] = {
        client_id: "dummy_client_id",
        client_secret: "dummy_client_secret",
    };

    usersByUsername["asaf"] = {
        username: "asaf",
        password: "po09!@QW"
    };
}());

model.getAccessToken = function (bearerToken, callback) {
    console.log("getAccessToken");

    var token = accessTokensByBearerToken[bearerToken];
    callback(null, {
        accessToken: token.access_token,
        clientId: token.client_id,
        expires: token.expires,
        userId: token.userId
    });
};

model.getClient = function (clientId, clientSecret, callback) {
    var client = clientsByClientId[clientId];
    console.log("getClient: " + client.client_id);

    callback(null, {
        clientId: client.client_id,
        clientSecret: client.client_secret
    });
};

model.getRefreshToken = function (bearerToken, callback) {
    console.log("not implemented");
    callback(null, false);
};

var authorizedClientIds = ['dummy_client_id', 'asaf_client_id'];
model.grantTypeAllowed = function (clientId, grantType, callback) {
    console.log("grantTypeAllowed");

    if (grantType === 'password') {
        return callback(false, authorizedClientIds.indexOf(clientId.toLowerCase()) >= 0);
    }

    callback(false, true);
};

model.saveAccessToken = function (accessToken, clientId, expires, userId, callback) {
    console.log("saveAccessToken");

    accessTokensByBearerToken[accessToken] = {
        accessToken: accessToken,
        clientId: clientId,
        expires: expires,
        userId: userId
    };
    callback(null);
};

model.saveRefreshToken = function (refreshToken, clientId, expires, userId, callback) {
    console.log("not implemented");
    callback(null);
};

/*
 * Required to support password grant type
 */
model.getUser = function (username, password, callback) {
    console.log("getUser");

    var user = usersByUsername[username];
    callback(null, user && user.password == password);
};