var socket = io.connect('http://build.kiwiwearables.com:3000');
 
console.log("hello");
 
// Declare global variables here 

// Declare Array variables
var smokesArray = new Array();
var total_smokes = new TimeSeries();
var total_nicotine = new TimeSeries();

var total;
var dragArrayCounter = 0; 
var isDrag = 0; 

var dontCheck = 0; 
var nicotine = 0;
var nicotinefinal = 0;
var start = new Date().getTime();
 
// code for guage 
var g; 

jQuery(document).ready(function($){});
   
 
function setDial(data) {
    // g.refresh(data);
}

// Send text message to Brian
function callout() {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/msg'
    })
    .done(function (msg) {
        console.log(msg);
    });
}
 
// edit device ID 
socket.on('connect', function() {
    socket.emit('listen', {device_id: '35', password: '123'});
});
 
socket.on('listen_response', function(data) {

    $('#device_streaming').html("Kiwi Streaming: ON");
    total = DTW(data.message);

    var bufferSize = 10;    // drag --> 10
    var threshold = 35;     // threshold --> 35

    var dragArray = new Array(bufferSize);   

    $('#totalSmokes').html(total);

    total_smokes.append(new Date().getTime(), graphDTW(total));

    if ((total <= threshold) && (dontCheck == 0)) {
             
        dragArrayCounter++; 

        //only count a drag if 10 predictions are counted
        if(dragArrayCounter >= bufferSize){
          isDrag++;
          nicotine = nicotinefinal + 5; // 1ug for 1 cigarette and 20 drags for one cigarette
          start = new Date().getTime();
          $('#skull').removeClass("skull-off").addClass("skull-on");
          //callout();
          dontCheck = 1;

          setTimeout(function(){
            dragArrayCounter = 0;
            dontCheck = 0;
            $('#skull').removeClass("skull-on").addClass("skull-off");
          },2000);
        }
    }

    var lambda = Math.LN2/6000;

    nicotinefinal = (nicotine * Math.exp(-(new Date().getTime()- start)*lambda)); 
    total_nicotine.append(new Date().getTime(), nicotinefinal);

    if(nicotinefinal <= 1){
        $('#happy').removeClass("happy-off").addClass("happy-on");
    }else{
      $('#happy').removeClass("happy-on").addClass("happy-off");
    }

    $('#totalDrags').html(isDrag);
    $('#totalNicotine').html(Math.round(nicotinefinal*1000)/1000);

});

function graphDTW(amt){
  return Math.max((65 - amt), 0);
}

function createTimeline() {

  var color_x = '#6e97aa';

  $("#total_smokes").css("color", color_x);

  var gy_min = 0;
  var gy_max = 50;

  var chart_gy = new SmoothieChart({millisPerPixel: 12, grid: {fillStyle: '#ffffff', strokeStyle: '#f4f4f4', sharpLines: true, millisPerLine: 5000, verticalSections: 5}, timestampFormatter: SmoothieChart.timeFormatter, minValue: gy_min, maxValue: gy_max});

  chart_gy.addTimeSeries(total_smokes, {lineWidth: 2, strokeStyle: color_x});
  chart_gy.streamTo(document.getElementById("chart-1"), 500);

  var color_y = '#FF0000';

  $("#total_smokes").css("color", color_x);

  var sy_min = 0;
  var sy_max = 20;

  var chart_sy = new SmoothieChart({millisPerPixel: 12, grid: {fillStyle: '#ffffff', strokeStyle: '#f4f4f4', sharpLines: true, millisPerLine: 5000, verticalSections: 5}, timestampFormatter: SmoothieChart.timeFormatter, minValue: sy_min, maxValue: sy_max});

  chart_sy.addTimeSeries(total_nicotine, {lineWidth: 4, strokeStyle: color_y});
  chart_sy.streamTo(document.getElementById("chart-2"), 500);

}

createTimeline();
