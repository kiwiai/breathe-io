var restify = require('restify'),
	client = require('twilio')('ACabffae70b1c03d458c03c32c437d7272', '678aae597a9af8434c0ade072e1d86dc');

var server = restify.createServer();

server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
	  return next();
	}
);

server.post('/msg', function respond(req, res, next) {
	//Send an SMS text message
	client.sendMessage({
	    to:'+14168214838', // Any number Twilio can deliver to
	    from: '+12892362554', // A number you bought from Twilio and can use for outbound communication
	    body: 'word to your mother.' // body of the SMS message

	}, function(err, responseData) { //this function is executed when a response is received from Twilio

	    if (!err) { // "err" is an error received during the request, if any

	        // "responseData" is a JavaScript object containing data received from Twilio.
	        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
	        // http://www.twilio.com/docs/api/rest/sending-sms#example-1

	        console.log(responseData.from); // outputs "+14506667788"
	        console.log(responseData.body); // outputs "word to your mother."

	    }
	    else {
	    	console.dir(err);
	    }
	});
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
