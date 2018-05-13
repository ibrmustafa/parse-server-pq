const resolve = require('path').resolve;

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = 'mongodb://heroku_cknf11mk:jsu11t38acphq6v2s6ht8baln7@ds147070.mlab.com:47070/heroku_cknf11mk';//process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
	console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({

    databaseURI: 'mongodb://heroku_cknf11mk:jsu11t38acphq6v2s6ht8baln7@ds147070.mlab.com:47070/heroku_cknf11mk',//process.env.MONGODB_URI,
    cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
    serverURL: process.env.SERVER_URL || 'https://peppeq-mahesh.herokuapp.com/parse',
    allowClientClassCreation: process.env.CLIENT_CLASS_CREATION || true, 
    appId: process.env.APP_ID || 'mySampleAppID',
    masterKey: process.env.MASTER_KEY || 'myMasterKey',
    publicServerURL: process.env.SERVER_URL || 'https://peppeq-mahesh.herokuapp.com/parse',
    verifyUserEmails: true,
    appName: "peppequeue",
    
    emailAdapter: {
	module: 'parse-server-mailgun',
	options: {
	    fromAddress: process.env.EMAIL_FROM || 'PeppeQ<noreply@yourapp.com>' ,
	    domain: process.env.MAILGUN_DOMAIN || 'sandbox7f4515dafa424dad80e674d3c130df6c.mailgun.org',
	    apiKey: process.env.MAILGUN_API_KEY ||'key-eef7acd0aab4f788efde54e5e925305d' ,

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
    }
});

var app = express();

app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/public/login.html'));
});


app.get('/dashboard', function(req, res) {  
   res.sendFile(path.join(__dirname, '/public/dashboard.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function () {
	console.log('parse-server-example running on port ' + port + '.');
});


// This will enable the Live Query real-time server
			  ParseServer.createLiveQueryServer(httpServer);
			  
