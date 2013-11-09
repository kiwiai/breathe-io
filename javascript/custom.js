var socket = io.connect('http://build.kiwiwearables.com:3000');
 
console.log("hello");
 
// Declare global variables here 
// 1. Buffer Array's for 6 sensors (Ax, Ay, Az, Gx, Gy, Gz) and counters.
var i = 0;          
var xArray = new Array();  
var yArray = new Array();
var zArray = new Array();
var totalAccelArray = new Array(); 
var xgArray = new Array();  
var ygArray = new Array();
var zgArray = new Array();
var totalGyroArray = new Array();
 
// Declare Array variables
 
var xacArray = new Array();  
var yacArray = new Array();
var zacArray = new Array();
var xgcArray = new Array();  
var ygcArray = new Array();
var zgcArray = new Array();
 
// parameters for shake classifier 
var bufferSize = 10;    // shake --> 10
var threshold = 10;     // shake --> 40
var timeInterval = 1;   // shake --> 1
var timeBetweenShakes = 1.5; 
 
// Variables for shake classifier
var shakeArray = new Array(bufferSize);   
var shakeArrayCounter = 0; 
var start=0; 
var elapsed=0;
var shakeEventTimerArray = new Array(); // array to log the timing of shake event. 
var shakeEventArrayCounter = 0; 
var shakeElapsedTime = 0; 
var shakeEventStart = 0; 
var isShake = 0;  
 
// code for guage 
  var g; 
  jQuery(document).ready(function($) {
    g = new JustGage({
        id: "gauge",
        value: 0,
        min: 0,
        max: 20,
        title: "Punch Strength"
    });
  });
   
 
  function setDial(data) {
     g.refresh(data);    
   }
 
// edit device ID 
socket.on('connect', function() {
	socket.emit('listen', {device_id: '35', password: '123'});
});
 
socket.on('listen_response', function(data) {
 
  $('#device_streaming').html("Kiwi Streaming: ON");
//console.log(data.message);  Message is a json package - currently, raw data only
    var toParse = JSON.parse(data.message);
    var Ax = parseFloat(toParse.ax);
    var Ay = parseFloat(toParse.ay);
    var Az = parseFloat(toParse.az);
    
    var Gx = parseFloat(toParse.gx);
    var Gy = parseFloat(toParse.gy);
    var Gz = parseFloat(toParse.gz);
    
    $('#acc_x').html(Ax);
    $('#acc_y').html(Ay);
    $('#acc_z').html(Az);
    
    $('#gyro_x').html(Gx);
    $('#gyro_y').html(Gy);
    $('#gyro_z').html(Gz);
 
    // insert data into buffer array 
    xArray[i] = Ax;    // get x value 
    yArray[i] = Ay;    // get y value 
    zArray[i] = Az;    // get z value 
    
    // insert data into buffer array 
    xgArray[i] = Gx;    // get x value 
    ygArray[i] = Gy;    // get y value 
    zgArray[i] = Gz;    // get z value 
    
    totalAccelArray[i] = Math.abs(xArray[i]) + Math.abs(yArray[i]) + Math.abs(zArray[i]);
    setDial(totalAccelArray[i]); 
    //console.log(totalAccelArray[i]);
 
    // Kiwi Shake classifer - for reference : filter using time interval, acceleration threshold, and time between valid events - tested with shimmer.
 
    // Code for feature extraction and basic classifier is available if needed 
    // (raw and average variance arrays, covariance arrays)
 
    if (Math.abs(totalAccelArray[i]) >= threshold) {     
    // for shake, chose total accel >= 40 as threshold. 
       if (shakeArrayCounter == 0) { 
          start = new Date().getTime();
          //console.log("Starting at: " + start); 
            $('#glove').fadeIn(300);
           $('#myScore').html("You smoked X today. Bad boy");
  
       } 
       
       shakeArray[shakeArrayCounter] = totalAccelArray[i];  
       //shakeArray[shakeArrayCounter] = Math.abs(yArray[i]);
       shakeArrayCounter++; 
    }
 
    elapsed = new Date().getTime() - start;
    //elapsed = Math.floor(time / 100) / 10;  
  
    if (elapsed/1000 > timeInterval) {   // if > time, clear array and reset counter
        //console.log("Resetting shake counter, elapsed is > 2: " + elapsed/1000);
        shakeArrayCounter = 0; 
        shakeArray = new Array(bufferSize);
     }
   
    if (shakeArrayCounter == bufferSize && elapsed/1000 <= timeInterval) {        
    // buffer of 5 shake values in desired time interval     
       isShake = 1; 
       console.log("Got a shake");
       shakeArrayCounter = 0; 
       shakeArray = new Array(bufferSize);
 
       shakeEventStart = new Date().getTime();
       shakeEventTimerArray[shakeEventArrayCounter] = shakeEventStart;  
       // log start timer for shake event 
     }       
 
    if (isShake) {
    
      if (shakeEventArrayCounter > 0) {   // array of shake event times. 
           shakeElapsedTime = shakeEventTimerArray[shakeEventArrayCounter] - shakeEventTimerArray[shakeEventArrayCounter-1];
       }
 
       // check if valid shake event i.e. gap of 1.5 seconds.  
       if (shakeElapsedTime/1000 > timeBetweenShakes)  {
           //redis_publish.publish('techpunch', "Shake"); 
           console.log("Shake EVENT: " + shakeEventStart + " elapsed: " + shakeElapsedTime); 
           
           $('#instruction').html("Shake event detected");
              
           $('#glove').fadeIn(300);
           $('#myScore').html("You smoked X today. Bad boy");
            // use this for nicotine levels 
       }
 
 
       isShake = 0;   
       shakeEventArrayCounter++; 
    }    
    
  i++ ;  // increment raw array counter 
});
 
 
// machine learning platform 
 
// Connect second socket (for machine learning and other platforms)
//var algosocket = io.connect('http://ws.algorithms.io')
//var auth_token = 'f7280da20c03843626632f7607a171b4';
 
 
 
// can do nested stuff like this, which is cool
//algosocket.on('connect', function()  { 
//console.log("connected to Algo");
 
 
// algosocket.emit('event_save_motion', { 
      //  'authToken': auth_token,
     //     'device_id': '1',
     //       'accelerometer_x':  -0.6,
     //     'accelerometer_y': -3.8, 
     //       'accelerometer_z': -1.9,
     //       'gyroscope_x': -85.4, 
     //       'gyroscope_y': -104.6, 
     //       'gyroscope_z': 40.3,
     //       'rotation_x': 0, 
     //       'rotation_y': 0,
     //       'rotation_z': 0,
     //       'label': 'realtime' 
      // });
 
    // algosocket.emit('algorithm_random_forest_rolling_samples', { 
    //   'authToken': auth_token,
  //         'train': '3878',
    //   'device_id': '1',
    //   'dependentVariable': 'action'
    // });
 
// algosocket.on('event_save_motion_result', function(data){
//               // console.log('Saved: ' + data.data);
// });
 
// algosocket.on('algorithm_random_forest_rolling_samples_result', function(data){
//                console.log('Random Forest Result: ' + data.data);
// });