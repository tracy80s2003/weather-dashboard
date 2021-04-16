let city = $("#searchTerm").val();
const apiKey = "e92e74499378a79ea76476a034597b88";
let date = new Date();

// $("#searchTerm").keypress(function(event) { 
	
// 	if (event.keyCode === 13) { 
// 		event.preventDefault();
// 		$("#searchBtn").click(); 
// 	} 
// });

$("#searchBtn").on("click", function() {

  $('#forecastH5').addClass('show');

  // get the value of the input from user
  city = $("#searchTerm").val();
  
  // clear input box
  $("#searchTerm").val("");  

  // full url to call api
  const dailyURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`
  const queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial";

  // $.ajax({
  //   url: queryUrl,
  //   method: "GET"
  // })
  fetch(dailyURL)
  .then(res => res.json())
  .then(data => {
    console.log(data)
    let longitude = data.coord.lon
    let latitude = data.coord.lat
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
    .then(res => res.json())
    .then(uvData => {
      console.log(uvData)
      getCurrentConditions(data, uvData);

    })
  })

  fetch(queryUrl)
  .then(res => res.json())
  .then(function (response){

    let newAgeSearch = response.list.filter(query => query.dt_txt.includes("09:00:00"))
    console.log(newAgeSearch);

    // getCurrentForecast(response);
    makeList();

    });
});



function makeList() {
  let listItem = $("<li>").addClass("list-group-item").text(city);
  $(".list").append(listItem);
}

function getCurrentConditions (currentData, UVData) {

    // get the temperature and convert to fahrenheit
  $("#city-name").text(currentData.name)
  // $("#current-pic").attr('src', '')
  $("#temperature").text("Temp: " + currentData.main.temp + "°F")
  $("#humidity").text("Humidity: " + currentData.main.humidity + "%")
  $("#wind-speed").text("Wind Speed: " + currentData.wind.speed + "mi/h")
  $("#UV-index").text("UV-Index: " + UVData.current.uvi)
    // add to page
   
}

function getCurrentForecast () {
  
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + apiKey,
    method: "GET"
  }).then(function (response){

    console.log(response);
    console.log(response.dt);
    $('#forecast').empty();

    // variable to hold response.list
    let results = response.list;
    console.log(results);
    
    //declare start date to check against
    // startDate = 20
    //have end date, endDate = startDate + 5

    for (let i = 0; i < results.length; i++) {

      let day = Number(results[i].dt_txt.split('-')[2].split(' ')[0]);
      let hour = results[i].dt_txt.split('-')[2].split(' ')[1];
      console.log(day);
      console.log(hour);

      if(results[i].dt_txt.indexOf("12:00:00") !== -1){
        
        // get the temperature and convert to fahrenheit 
        let temp = (results[i].main.temp - 273.15) * 1.80 + 32;
        let tempF = Math.floor(temp);

        const card = $("<div>").addClass("card col-md-2 ml-4 bg-primary text-white");
        const cardBody = $("<div>").addClass("card-body p-3 forecastBody");
        const cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
        const temperature = $("<p>").addClass("card-text forecastTemp").text("Temperature: " + tempF + " °F");
        const humidity = $("<p>").addClass("card-text forecastHumidity").text("Humidity: " + results[i].main.humidity + "%");

        const image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png");

        cardBody.append(cityDate, image, temperature, humidity);
        card.append(cardBody);
        $("#forecast").append(card);

      }
    }
  });

}

// Storage
function loadFromStorage () {

    for(i = 8; i <= 17; i++) {

        var content = localStorage.getItem("div" + i);
        $("#div"+ i ).val(content);
    }
}
loadFromStorage();

function clearEverything(){
    for(i=8; i<=17;i++){
        $("#div"+i).val("");
    }
    localStorage.clear();
}

$(document).on("click", "button", function(e){
    e.preventDefault();
    var contextToBeSaved = $(this).prev().val();
    var keyForSaved = $(this).prev().attr('id');
    localStorage.setItem(keyForSaved, contextToBeSaved);
});