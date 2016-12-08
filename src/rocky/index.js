var rocky = require('rocky');

var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 
  'Oct', 'Nov', 'Dec'];
var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var weather = null;
var loading = false;

rocky.on('draw', function(drawEvent) {
  var ctx = drawEvent.context;
  var w = ctx.canvas.unobstructedWidth;
  var h = ctx.canvas.unobstructedHeight;
  var obstruction_h = (ctx.canvas.clientHeight - ctx.canvas.unobstructedHeight) / 2;

  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
  var d = new Date();
  ctx.fillStyle = 'white';

  // TIME
  var clockTime = leftpad(d.getHours(), 2, 0) + ':' + 
                    leftpad(d.getMinutes(), 2, 0); // TODO: Detect 24h
  ctx.font = '42px bold numbers Leco-numbers';
  ctx.textAlign = 'center';
  ctx.fillText(clockTime, w / 2, 56 - obstruction_h);

  // DATE
  ctx.fillStyle = 'lightgray';
  var clockDate = d.getDate() + ' ' + 
                    monthNames[d.getMonth()];
  // dayNames[d.getDay()] + ' ' + 
  ctx.font = '24px bold Gothic';
  ctx.textAlign = 'center';
  ctx.fillText(clockDate, w / 2, 120 - obstruction_h);

  // COLON BLINK MASK
  if (loading) {
    ctx.fillStyle = 'black';
    ctx.fillRect(66, 72 - obstruction_h, 12, 26);
  }

  // WEATHER
  if (weather) {
    ctx.fillStyle = 'white';
    var weatherText = weather.city.substr(0, 10) + '\n' 
    + weather.temp + 'C - ' + weather.temp_min + '/'  + weather.temp_max ;
    ctx.font = '18px bold Gothic';
    ctx.textAlign = 'center';
    ctx.fillText(weatherText, w / 2, 12 - obstruction_h);
  }

});

rocky.on('message', function(event) {
  weather = event.data;
  console.log(JSON.stringify(weather));
  loading = false;
  rocky.requestDraw();
});

rocky.on('minutechange', function(e) {
  var d = new Date();
  if (weather == null || (d.getMinutes() % 15 == 0) ) {
    loadWeather();
  } else {
    rocky.requestDraw();
  }
});

rocky.on('hourchange', function(e) {
//  loadWeather();
});

function loadWeather() {
  if (loading) return;
  console.log('Weather...');
  loading = true;
  rocky.requestDraw();
  rocky.postMessage({command: 'weather'});
}

function leftpad(str, len, ch) {
  str = String(str);
  var i = -1;
  if (!ch && ch !== 0) ch = ' ';
  len = len - str.length;
  while (++i < len) {
    str = ch + str;
  }
  return str;
}
