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

var smokesArray = new Array();
var total_smokes = new TimeSeries();
 
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
        title: "Strength"
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
    //console.log(DTW(data.message));
    var total = DTW(data.message);


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
    
    $('#totalSmokes').html(total);
    
    // insert data into buffer array 
    xArray[i] = Ax;    // get x value 
    yArray[i] = Ay;    // get y value 
    zArray[i] = Az;    // get z value 
    
    // insert data into buffer array 
    xgArray[i] = Gx;    // get x value 
    ygArray[i] = Gy;    // get y value 
    zgArray[i] = Gz;    // get z value 
	
    total_smokes.append(new Date().getTime(), total);
    
});

	function createTimeline() {
		
		    var color_x = '#6e97aa';
		
		    $("#total_smokes").css("color", color_x);
		  
	        var gy_min = 0;
	        var gy_max = 200;
	
	        var chart_gy = new SmoothieChart({millisPerPixel: 12, grid: {fillStyle: '#ffffff', strokeStyle: '#f4f4f4', sharpLines: true, millisPerLine: 5000, verticalSections: 5}, timestampFormatter: SmoothieChart.timeFormatter, minValue: gy_min, maxValue: gy_max});
	
	        chart_gy.addTimeSeries(total_smokes, {lineWidth: 2, strokeStyle: color_x});
	        chart_gy.streamTo(document.getElementById("chart-1"), 500);
		           
	}

    createTimeline();

 
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