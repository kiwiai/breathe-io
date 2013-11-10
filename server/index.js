var restify = require('restify'),
	client = require('twilio')('ACabffae70b1c03d458c03c32c437d7272', '678aae597a9af8434c0ade072e1d86dc'),
	server = restify.createServer(),
	messages = [
		'Yo man. Just got a msg from Breathe.io about you having a smoke.  Try to get back on track bro.',
		'Another one man! Dude call me. As your Quit Buddy I\'m here for you.',
		'Not to nag, but bro as your Quit Buddy I just wanna say, remember why you\'re trying to quit.'
	],
	messageIndex = 0;

server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
	  return next();
	}
);

server.post('/msg', function respond(req, res, next) {

	//DEBUG CODE
	// console.log('About to send out: ' + messages[messageIndex % messages.length]);
	// res.send('About to send out: ' + messages[messageIndex % messages.length]);
	// res.end();
	// messageIndex++;

	//Send an SMS text message
	client.sendMessage({
	    to:'+14168214838', // Any number Twilio can deliver to
	    from: '+12892362554', // A number you bought from Twilio and can use for outbound communication
	    body: messages[messageIndex % messages.length] // body of the SMS message

	}, function(err, responseData) { //this function is executed when a response is received from Twilio

			messageIndex++;

	    if (!err) { // "err" is an error received during the request, if any
	        // "responseData" is a JavaScript object containing data received from Twilio.
	        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
	        // http://www.twilio.com/docs/api/rest/sending-sms#example-1

	    		var clientResp = 'Sent to: ' + responseData.from + ', Body: ' + responseData.body;

	        console.log(clientResp);

	        res.send(clientResp);
	        res.end();
	    }
	    else {
	    	console.dir(err);
	    	res.send('Something went wrong. Check server log.');
	    	res.end();
	    }
	});
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
