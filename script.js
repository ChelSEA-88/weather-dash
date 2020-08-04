$(document).ready(function() {

  // capture search button value on click
  $("#search-button").on("click", function() {
    event.preventDefault();
    var searchValue = $("#search-value").val();

    //* clear input box after hitting search *//
    $(searchValue).val("");

    searchWeather(searchValue);
    console.log("var searchValue = ", searchValue);
  });

    // Search History //
  $(".history").on("click", "li", function() {
    searchWeather($(this).text());
    console.log("History (this):", this);
  });

  function makeRow(text) {
    var li = $("<li>")
    // add class and name
    .addClass("list-group-item list-group-item-action")
    // add text
    .text(text);

    //append search history//
    $(".history").append(li);
  }

  // Variable for API key //
  var apiKey = "&appid=10790390a41f7cd5821fb4d30eaf16d1";

  // Metric to Imperial conversion //
  var imperialConvers = "&units=imperial";
  
// -- Today's Weather Forecast -- //


  function searchWeather(searchValue) {
            // jquery API callback function //
            $.ajax({
              type: "GET",
              url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + imperialConvers + apiKey,
              dataType: "json",
              success: function(data) {
                console.log(data);
                console.log(data.city);
                console.log("City Name:", data.city.name);
                console.log(data.humidity);
                console.log(data.windspeed)

                // create history link for this search
                if (history.indexOf(searchValue) === -1) {
                  history.push(searchValue);
                  window.localStorage.setItem("history", JSON.stringify(history));
            
                  makeRow(searchValue);
                }
                
                // clear any old content
                $("#today").empty();
                $("#forecast").empty();

                // create html content for current weather

                var currentForecast = $("<div>",  { id: "forecast-container" });


                var cityName = $("<div>",  { id: "city-name" });
                cityName.text(data.city.name  +  "(" + new Date().toLocaleDateString() + ")");

                var weatherImg = $("<div>", { id: "weather-img" });

                var showImg = $("<img>");
                showImg.attr(
                  "src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");

                weatherImg.append(showImg);

                //list items//
                var temp = $("<div>",  { id: "temp" });
                temp.text("Current Temperature: " + data.list[i].main.temp + "°F");

                var humidity = $("<div>", { id: "humidity" });
                humidity.text("Humdidity: " + data.list[i].main.humidity + "%");

                console.log("humidity" + data.list[i].main.humidity)

                var windSpeed = $("<div>", { id: "windspeed" });
                windSpeed.text("Wind Speed", + data.list[i].wind.speed + "MPH");

                var UVIndex = $("<div>", { id: "uv-index" });

                currentForecast.append(
                  cityName, 
                  weatherImg, 
                  temp,
                  humidity, 
                  windSpeed, 
                  UVIndex,);

                // merge and add to page
                $("#today").append(currentForecast);
                
                // call follow-up api endpoints
                getForecast(searchValue);
                getUVIndex(data.city.coord.lat, data.city.coord.lon);
              }
    });
  }
  var imperialConvers = "&units=imperial";
  function getForecast(searchValue) {
              $.ajax({
                type: "Get",
                url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + imperialConvers + apiKey,
                dataType: "json",
                success: function(data) {
                  console.log("get forecast function has fired");
                  // overwrite any existing content with title and empty row
                  $("#forecast").empty();


                  //create title//
                  var fiveDayTitle = $("<div>", { id: "five-day-title" });

                  fiveDayTitle.text("A look ahead: 5-Day Forecast");

                  //Forecast card container//
                  var fiveDayContent = $("<div>",  { class: "card-container", id: "five-day-content"});

                  // loop over all forecasts (by 3-hour increments)
                  for (var i = 0; i < data.list.length; i++) {
                    // only look at forecasts around 3:00pm
                    if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                      // create html elements for a bootstrap card

                      var fiveCard = $("<div>", { class: "card", id: "five-card", });

                      var fiveDate = $("<h4>", {
                        class: "card-title",
                        id: "five-date"
                      });

                      fiveDate.text("(" + new Date().toLocaleDateString() + ")");

                      var fiveImage = $("<p>", {
                        class: "card-body",
                        id: "five-img",
                      });

                      var fiveIcon = $("<img>");
                      fiveIcon.attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png",
                    );
                    fiveImage.append(fiveIcon);

                    var fiveTemp = $("<p>", {
                      class: "card-body",
                      id: "five-temp"
                    });

                    fiveTemp.text("Temperature: " + data.list[i].main.temp + "°F");

                    var fiveHumidity = $("<p>", {
                      class: "card-body",
                      id: "five-humidity"
                    });

                    fiveHumidity.text("Humdidity: " + data.list[i].main.humidity + "%");

                    fiveCard.append(fiveDate, fiveIcon, fiveTemp, fiveHumidity);
                    // merge together and put on page

                    $("#forecast").append(fiveCard)



          }
        }
      }
    });
  }

  // UV Index //
  function getUVIndex(lat, lon) {
    $.ajax({
      type: "GET",
      url: "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + apiKey,
      dataType: "json",
      success: function(data) {
        var uv = data[0].value;
        var uvText = $("<p>").text("UV Index: ");
        var btn = $("<span>").addClass("btn btn-sm").text(data[0].value);
        
        // change color depending on uv value

        if (uv > 0 && uv <= 2.99) {
					btn.addClass("low-uv");
					btn.css("color", "white");
					btn.css("background-color", "lightblue");
				} else if (uv >= 3 && uv <= 5.99) {
					btn.addClass("moderate-uv");
					btn.css("color", "white");
					btn.css("background-color", "green");
				} else if (uv >= 6 && uv <= 7.99) {
					btn.addClass("high-uv");
					btn.css("color", "white");
					btn.css("background-color", "orange");
				} else if (uv >= 8 && uv <= 10.99) {
					btn.addClass("vhigh-uv");
					btn.css("color", "white");
					btn.css("background-color", "red");
				} else {
					btn.addClass("extreme-uv");
					btn.css("color", "white");
					btn.css("background-color", "darkred");
				}
        
        $("#today #uv-index").append(uvText.append(btn));
      }
    });
  }

  // get current history, if any
  var history = JSON.parse(window.localStorage.getItem("history")) || [];

  if (history.length > 0) {
    searchWeather(history[history.length-1]);
  }

  for (var i = 0; i < history.length; i++) {
    makeRow(history[i]);
  }
});

$("#clear-button").on("click", function () {
	console.clear();
	// clear
	localStorage.clear();
	// reload list
	window.location.reload();
});

