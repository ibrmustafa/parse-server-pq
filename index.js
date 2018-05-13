var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
	console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({

    databaseURI: process.env.MONGODB_URI,
    cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
    serverURL: process.env.SERVER_URL,
    allowClientClassCreation: process.env.CLIENT_CLASS_CREATION || true, 
    appId: process.env.APP_ID,
    masterKey: process.env.MASTER_KEY,
    publicServerURL: 'https://peppequeue.herokuapp.com/parse',
    verifyUserEmails: true,
    appName: "peppequeue",
    
    emailAdapter: {
	module: 'parse-server-mailgun',
	options: {
	    fromAddress: 'PeppeQ<noreply@yourapp.com>',
	    domain: 'sandboxde091df17c3a43f18a3ac8367421432e.mailgun.org',
	    apiKey: 'key-ea1fb115983b4f6fcdd57154d083023c',

	    templates: {
		passwordResetEmail: {
		    subject: 'Reset your password',
		    pathPlainText: resolve(__dirname, 'public/email-templates/password_reset_email.txt'),
		    pathHtml: resolve(__dirname, 'public/email-templates/password_reset_email.html'),
		    callback: (user) => { return { firstName: user.get('firstName') }}
		    // Now you can use {{firstName}} in your templates
		},
		verificationEmail: {
		    subject: 'Confirm your account',
		    pathPlainText: resolve(__dirname, 'public/email-templates/verification_email.txt'),
		    pathHtml: resolve(__dirname, 'public/email-templates/verification_email.html'),
		    callback: (user) => { return { firstName: user.get('firstName') }}
		    // Now you can use {{firstName}} in your templates
		},
		customEmailAlert: {
		    subject: 'Urgent notification!',
		    pathPlainText: resolve(__dirname, 'public/email-templates/custom_alert.txt'),
		    pathHtml: resolve(__dirname, 'public/email-templates/custom_alert.html'),
		}
	    }
	}
    });


// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/public/login.html'));
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function (req, res) {
	res.sendFile(path.join(__dirname, '/public/test.html'));
});



var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function () {
	console.log('parse-server-example running on port ' + port + '.');
});


// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
