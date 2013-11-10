var socket = io.connect('http://build.kiwiwearables.com:3000');
 
console.log("hello");
 
// Declare global variables here 

// Declare Array variables
var smokesArray = new Array(),
    total_smokes = new TimeSeries(),
    total_nicotine = new TimeSeries(),
    ax = new TimeSeries(),
    ay = new TimeSeries(),
    az = new TimeSeries(),
    gx = new TimeSeries(),
    gy = new TimeSeries(),
    gz = new TimeSeries(),

    total,
    dragArrayCounter = 0; 
    isDrag = 0,

    dontCheck = 0,
    nicotine = 0,
    nicotinefinal = 0
    start = new Date().getTime(),
    lambda = Math.LN2/36000000,

 
    bufferSize = 10,    // drag --> 10
    threshold = 45,     // threshold --> 35
    dragArray = new Array(bufferSize);

jQuery(document).ready(function($){});


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
    var dtw = DTW(data.message);
    total = dtw.total;

    total_smokes.append(new Date().getTime(), graphDTW(total/6));
    ax.append(new Date().getTime(), graphDTW(dtw.ax));
    ay.append(new Date().getTime(), graphDTW(dtw.ay));
    az.append(new Date().getTime(), graphDTW(dtw.az));
    gx.append(new Date().getTime(), graphDTW(dtw.gx));
    gy.append(new Date().getTime(), graphDTW(dtw.gy));
    gz.append(new Date().getTime(), graphDTW(dtw.gz));

    (total <= threshold) ? $("body").addClass('drag') : $("body").removeClass('drag');
    if ((total <= threshold) && (dontCheck == 0)) {
             
        dragArrayCounter++; 

        //only count a drag if 10 predictions are counted
        if(dragArrayCounter >= bufferSize){
          isDrag++;
          nicotine = nicotinefinal + 50; // 1ug for 1 cigarette and 20 drags for one cigarette
          start = new Date().getTime();
          $('#skull').toggleClass("skull-off");
          callout();
          dontCheck = 1;

          setTimeout(function(){
            dragArrayCounter = 0;
            dontCheck = 0;
            $('#skull').toggleClass("skull-off");
          },2000);
        }
    }

    nicotinefinal = (nicotine * Math.exp(-(new Date().getTime()- start)*lambda)); 
    total_nicotine.append(new Date().getTime(), nicotinefinal);

    if(nicotinefinal <= 1){
        $('#happy').removeClass("happy-off");
    }else{
        $('#happy').addClass("happy-off");
    }

    $('#totalDrags').html(isDrag);
    $('#totalNicotine').html(Math.round(nicotinefinal*1000)/1000);

});

function graphDTW(amt, max){
  return Math.max(((max || 10) - amt), 0);
}

function createTimeline() {
    var gy_min = 0;
    var gy_max = 10;

    var chart_gy = new SmoothieChart({millisPerPixel: 12, grid: {fillStyle: '#ffffff', strokeStyle: '#f4f4f4', sharpLines: true, millisPerLine: 5000, verticalSections: 5}, timestampFormatter: SmoothieChart.timeFormatter, minValue: gy_min, maxValue: gy_max, labels:{fillStyle:'#000000'}});

    chart_gy.addTimeSeries(ax, {lineWidth: 2, strokeStyle: '#BCF4FF'});
    chart_gy.addTimeSeries(ay, {lineWidth: 2, strokeStyle: '#BCF4FF'});
    chart_gy.addTimeSeries(az, {lineWidth: 2, strokeStyle: '#BCF4FF'});
    chart_gy.addTimeSeries(gx, {lineWidth: 2, strokeStyle: '#BBFFC9'});
    chart_gy.addTimeSeries(gy, {lineWidth: 2, strokeStyle: '#BBFFC9'});
    chart_gy.addTimeSeries(gz, {lineWidth: 2, strokeStyle: '#BBFFC9'});
    chart_gy.addTimeSeries(total_smokes, {lineWidth: 2, strokeStyle: 'black', fillStyle:'rgba(0, 0, 0, 0.3)'});
    chart_gy.streamTo(document.getElementById("chart-1"), 500);

    var sy_min = 0;
    var sy_max = 600;

    var chart_sy = new SmoothieChart({millisPerPixel: 12, grid: {fillStyle: '#ffffff', strokeStyle: '#f4f4f4', sharpLines: true, millisPerLine: 5000, verticalSections: 5}, timestampFormatter: SmoothieChart.timeFormatter, minValue: sy_min, maxValue: sy_max, labels:{fillStyle:'#000000'}});

    chart_sy.addTimeSeries(total_nicotine, {lineWidth: 4, strokeStyle: '#FF0000', fillStyle:'rgba(255,38,0,0.30)'});
    chart_sy.streamTo(document.getElementById("chart-2"), 500);

}

createTimeline();
