var APIKey = "eab7cbb1ac76505f11cbecc73d7ad55f";
var cities = []
console.log(cities)


function displayWeatherData(city) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?" + "q=" + city + "&appid=" + APIKey;

    $.ajax({
            url: queryURL,
            method: "GET"
        })
        // Storing retrieved data inside response object
        .then(function(response) {
            console.log(queryURL);
            console.log(response);

            //Temp from Kelvin to degrees
            var degrees = response.main.temp - 273.15;

            

            var UnixTimestamp = (response.dt)
            var milliseconds = UnixTimestamp * 1000
            var dateObject = new Date(milliseconds)
              
            var humanDateFormat = dateObject.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })

            

            iconID = response.weather[0].icon

            //converting data to text(html) 
            $(".city-date").text(city + " " + humanDateFormat)
            $("#temp").text("Temperature: " + degrees.toFixed(2) + " °C");
            $("#humidity").text("Humidity: " + response.main.humidity + " %")
            $("#windspeed").text("Wind Speed: " + response.wind.speed + " MPH")
            $("#UV-index").text("UV-Index: ")

            
            $(".icon").attr("src", " https://openweathermap.org/img/wn/" + iconID + ".png")


            var lat = response.coord.lat;
            var lon = response.coord.lon;
            console.log(lat)
            console.log(lon)
                
            $.ajax({
                    url: "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon,
                    method: "GET"
                }).then(function(response) {
                    console.log(response);

                    
                    var colorIndex = $("<p>")
                    colorIndex.addClass("data")
                    colorIndex.attr("id", "uv-index")


                    $(colorIndex).text(response.value)
                    $("#current-city").append(colorIndex)
                    console.log(response.value)

                    var uvValue = response.value
                        
                    if (uvValue < "3") {
                        colorIndex.attr("style", "background-color:green")
                    }
                    if (uvValue >= "3" && uvValue <= "5.99") {
                        colorIndex.attr("style", "background-color: gold")
                    }
                    if (uvValue >= "6" && uvValue <= "7.99") {
                        colorIndex.attr("style", "background-color: orange")
                    }
                    if (uvValue >= "8" && uvValue <= "10.99") {
                        colorIndex.attr("style", "background-color: red")
                    }
                    if (uvValue === "11" || uvValue > "11") {
                        colorIndex.attr("style", "background-color:Indigo")
                    }
                })
                // 5 day forecaset
            var forecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey
            $.ajax({
                url: forecastURL,
                method: "GET"
            }).then(function(response) {
                console.log(response);

                for (var i = 0; i < 5; i++) {
                    
                    var cardforecast = $("<section>")
                    var Headerforecast = $("<h3>")
                    var icon = $("<img>")
                    var tempforecast = $("<p>")
                    var humidforecast = $("<p>")


                    
                    cardforecast.addClass("card")
                    Headerforecast.addClass("forecast-date")
                    icon.addClass("forecast-icon")
                    tempforecast.addClass("forcast-temp")
                    humidforecast.addClass("forecast-humidity")

                    
                    icon.attr("src", " https://openweathermap.org/img/wn/" + iconID + ".png")

                    //converting the data
                    UnixTimestamp = (response.daily[i].dt)
                    milliseconds = UnixTimestamp * 1000
                    dateObject = new Date(milliseconds)
                    humanDateFormat = dateObject.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })
                    degrees = response.daily[i].temp.day - 273.15;
                    console.log(degrees)
                    
                    Headerforecast.text(humanDateFormat)
                    tempforecast.text("Temp: " + degrees.toPrecision(4) + " °c")
                    humidforecast.text("Humidity: " + response.daily[i].humidity + "%")

                    $(".five-day-forecast").append(cardforecast)
                    $(cardforecast).append(Headerforecast)
                    $(cardforecast).append(icon)
                    $(cardforecast).append(tempforecast)
                    $(cardforecast).append(humidforecast)
                }
            });


        })
}

function renderSearchButton() {

    $(".searchBtn").on("click", function() {
        event.preventDefault();

        city = $("#search-bar").val().trim();
        displayWeatherData(city);


        var results = $("<p>");
        results.addClass("results");
        results.attr("data-name");
        results.text(city)
        $(".form").append(results);





        console.log(city)

        cities.push(City)

        if (localStorage.getItem("allCities")) {
            var citiesString = [...cities, ...JSON.parse(localStorage.getItem("allCities"))]
            var noDuplicates = citiesString.filter((item, index) => citiesString.indexOf(item) === index);
            noDuplicates = JSON.stringify(noDuplicates);
            localStorage.setItem("allCities", noDuplicates)
        } else {
            var citiesString = JSON.stringify(cities)
            localStorage.setItem("allCities", citiesString)
        }


        console.log(cities)

    })

}

function renderCitiesLocalStorage() {
    var citiesArray = JSON.parse(localStorage.getItem("allCities"))

    for (var i = 0; i < citiesArray.length; i++) {

        var results = $("<p>");
        results.addClass("results");
        results.attr("data-name", citiesArray[i]);
        results.text(citiesArray[i]);
        $(".form").append(results);
        results.on("click", function() {
            event.preventDefault();
            displayWeatherData($(this).attr("data-name")); 
        })
    }


}


if (localStorage.getItem("allCities")) {
    renderCitiesLocalStorage();

}







renderSearchButton();