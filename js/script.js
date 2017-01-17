
var weatherData = {};
var activeScale = 'C';

function setBackground(nowHours){
  console.log(nowHours);
  if((nowHours >= 18 && nowHours <= 23) || (nowHours >= 0 && nowHours <= 6))  {
    $('body').removeClass('day-bg').addClass('night-bg');
  } else {
    $('body').removeClass('night-bg').addClass('day-bg');
  }
}

function checkTimer(){
  let now = new Date();

  if(now.getMinutes() == 0){
    let nowHour = now.getHours();
    setBackground(nowHour);
  }
}

function getCurrentTime(){
  var monthNames = new Array("Jan", "Feb", "Mar",
  "Apr", "May", "Jun", "Jul", "Aug", "Sep",
  "Oct", "Nov", "Dec");

  var today = new Date();
  var cDate = today.getDate();
  var cMonth = today.getMonth();
  var cYear = today.getFullYear();
  var cHour = today.getHours();
  var cMin = today.getMinutes();

  return ( monthNames[cMonth] + " " +cDate  + " " +cYear + " " +cHour+ ":" + cMin);
}

function displayData(weatherData){
  console.log(weatherData);
  /*$('.temp-value').html(weatherData["temp_c"]);*/
  $('.current-location').html(weatherData["display_location"]);
  $('.last-updated-time').html(weatherData["observation_time"]);
}

function setWeatherIcon(weather, nowHours){

  if ((nowHours >= 18 && nowHours <= 23) || (nowHours >= 0 && nowHours <= 6)){
      var weatherIconName = "nt_" + weather.split(" ").join("").toLowerCase() + "@2x.png";
  } else {
    var weatherIconName = weather.split(" ").join("").toLowerCase() + "@2x.png";
  }


  var weatherIconURLPath = "url(assets/weather/" + weatherIconName + ")";

  var bgStyle = {
    "background": weatherIconURLPath,
    "background-position" : "center",
    "background-size" : "100%",
    "background-repeat" : "no-repeat"
  };
  $('.weather-icon').css(bgStyle);

}

function getInfo(){

  console.log("The active scale is : ", activeScale);

  const infoURL = "https://api.wunderground.com/api/ec6e2f5bfdfa056f/conditions/q/autoip.json";
  $.get(infoURL).done(function(data){
    weatherData["temp_f"] = data.current_observation.temp_f;
    weatherData["temp_c"] = data.current_observation.temp_c;
    weatherData["display_location"] = data.current_observation.display_location.full;
    weatherData["observation_time"] = getCurrentTime();
    weatherData["weather"] = data.current_observation.weather;

    /* I should check which of the scale-button is active and display the temperature value accordingly.  */
    displayTemperature(activeScale);
    displayData(weatherData);

    /* Check for time - the icons for day and night weathers are different! */
    let now = new Date();
    let nowHours = now.getHours();
    setWeatherIcon(weatherData["weather"], nowHours);
  });
}



function displayTemperature(scale){
  if(scale == 'C'){
    $('.temp-value').html(weatherData["temp_c"]);
  } else {
    $('.temp-value').html(weatherData["temp_f"]);
  }
}

function scaleToggleButtonClicked(){
  $(this).parent().children().removeClass('active');
  $(this).addClass('active');

  activeScale = $(this).find("p").html();
  displayTemperature(activeScale);
}



/******
 The document.ready() function is here!
 *******/
$(function(){

  /* Set the bg initially according to the time this document is loaded */
  let now = new Date();
  setBackground(now.getHours());

  /* Get and display the data for the current time once the document is loaded */
  getInfo();

  let viewPortHeight = $(window).height();
  $('body').css('height',viewPortHeight);

  /* Listen for any clicks on the 'refresh' button and refresh the displayed values accordingly */
  $('.refresh-button').click(getInfo);

  /* Listen to clicks on the scale-toggle-buttons and display temperature value accordingly! */
  $('.button').click(scaleToggleButtonClicked);

  /* To determine whether its night or day - for the bg */
  setInterval(checkTimer, 1000);

});
