// DOM elements
const searchBox = document.getElementById("searchBox");
const displayCity = document.getElementById("city");
const displayCountry = document.getElementById("country");
const displayTemp = document.getElementById("display-temp");
const weekCard = document.getElementById("week-card");
const sunriseTime = document.getElementById("sunrise-time");
const sunsetTime = document.getElementById("sunset-time");
const airQuality = document.getElementById("air-quality");
const airQualityImg = document.getElementById("air-quality-image");
const airQualityDetails = document.getElementById("air-quality-details");
const btnWeek = document.getElementById("btnWeek");
const btnToday = document.getElementById("btnToday");
const ctx = document.getElementById("myLineChart").getContext("2d");
const api_key = "5d2532334af84796b8d120210240309";

// Get current date
const currentDate = new Date();

//Update Month
document.getElementById("calender-title").innerHTML =
  currentDate.toLocaleString("default", { month: "long" });

// Function to update the calendar
function updateCalendar() {
  const calendarBody = document.querySelector(".table");
  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  let calendarHTML = `
    <thead>
      <tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>
    </thead>
    <tbody>`;

  let day = 1;
  for (let i = 0; i < 6; i++) {
    calendarHTML += "<tr>";
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay.getDay()) {
        calendarHTML += "<td></td>";
      } else if (day > lastDay.getDate()) {
        calendarHTML += "<td></td>";
      } else {
        calendarHTML += `<td${
          day === currentDate.getDate() ? ' class="today-date"' : ""
        }>${day}</td>`;
        day++;
      }
    }
    calendarHTML += "</tr>";
    if (day > lastDay.getDate()) break;
  }

  calendarHTML += "</tbody>";
  calendarBody.innerHTML = calendarHTML;
}

// Function to set the display date
function setDisplayDate() {
  const displayDate = document.getElementById("display-date");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const month = months[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  const date = currentDate.getDate();
  const day = days[currentDate.getDay()];

  displayDate.innerHTML = `${day} ${date}, ${month} ${year}`;
}

// Update calendar and date on page load
updateCalendar();
setDisplayDate();

// Event listener for search box
searchBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    getWeatherData(searchBox.value);
  }
});

let dispayType= "week";

// Function to update weather forecast
function showData(type) {
  const city = displayCity.innerText;
  if (type === "day") {
    btnToday.style.color = "var(--primary-color)";
    btnWeek.style.color = "var(--font-color)";
    dispayType = "day";
    getWeatherData(city);
  } else {
    btnToday.style.color = "var(--font-color)";
    btnWeek.style.color = "var(--primary-color)";
    dispayType = "week";
    getWeatherData(city);
  }
}

// Function to get public IP address and weather data for location
function getPublicIp() {
  fetch("https://ipapi.co/json/", {
    method: "GET",
    headers: {},
  })
    .then((response) => response.json())
    .then((data) => {
      getWeatherData(data.country_name);
    })
    .catch((err) => {
      console.error(err);
    });
}

//getPublicIp();

// Function to get weather data
async function getWeatherData(city) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${city}&days=7`
    );
    const result = await response.json();

    if (result.location && result.current) {
      updateMainWeatherData(result);
    } else {
      console.error("Location or Current weather data is missing.");
    }

    if (result.forecast && result.forecast.forecastday) {
      updateWeatherForecast(result.forecast.forecastday);
    
    } else {
      console.error("Forecast data not available.");
    }
  } catch (error) {
    console.error(error);
    // alert("City Not Found");
  }
}

//Update Main data
function updateMainWeatherData(data) {
  displayCity.innerHTML = data.location.name;
  displayCountry.innerHTML = data.location.country;
  displayTemp.innerHTML = `${data.current.temp_c}°C`;
  updateAirQuality(data.location.name);
}

// Function to update weather forecast
function updateWeatherForecast(data) {
  console.log(data);

  sunriseTime.innerHTML = data[0].astro.sunrise;
  sunsetTime.innerHTML = data[0].astro.sunset;

  weekCard.innerHTML = "";
  let numCards = dispayType === "week" ? 7 : 24;

  for (let i = 0; i < numCards; i++) {
    let heading = "";
    let temp = "";
    let weatherCondition = "";
    let iconSrc = "";
    let windSpeed = "";
    let humidity = "";
    if(dispayType === "week"){
      heading = getDayName(data[i].date);
      temp = Math.round(data[i].day.avgtemp_c);
      weatherCondition = getCondition(data[i].day.condition.code);
      iconSrc = data[i].day.condition.icon;
      windSpeed = Math.round(data[i].day.maxwind_kph);
      humidity= Math.round(data[i].day.avghumidity);
    }else{
      let time = data[0].hour[i].time;
      heading = time.split(" ")[1];
      temp= Math.round(data[0].hour[i].temp_c);
      weatherCondition = getCondition(data[0].hour[i].condition.code);
      iconSrc = data[0].hour[i].condition.icon;
      windSpeed = Math.round(data[0].hour[i].wind_kph);
      humidity = Math.round(data[0].hour[i].humidity);
    }

    weekCard.innerHTML += `
      <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="week-card">
                  <div class="row d-flex justify-content-between">
                    <div class="col-6">
                      <h4 class="fw-bold">${heading}</h4>
                      <p class="fw-bold opacity-75">${weatherCondition}</p>
                    </div>
                    <div class="col-6">
                      <img
                        src="${iconSrc}"
                        alt="cloudy"
                        class="card-img"
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-5">
                      <div class="row">
                        <div class="col-6">
                          <img
                            src="assets/icons/wind-speed.svg"
                            alt="Wind Speed"
                            class="windspeed-img"
                          />
                          <img
                            src="assets/icons/humidity.svg"
                            alt="Humidity"
                            class="humidity-img mt-2"
                          />
                        </div>
                        <div class="col-6">
                          <p class="wind-speed">${windSpeed}kmh</p>
                          <p class="mb-2 humidity">${humidity}%</p>
                        </div>
                      </div>
                    </div>
                    <div class="col-1 align-content-end align-items-end">
                      <h3 class="card-temp">${temp}°</h3>
                    </div>
                  </div>
                </div>
              </div>

    `;
  }
}

// Function to get weather condition based on code
function getCondition(conditionCode) {
  const weatherConditions = [
    { code: 1000, text: "Sunny" },
    { code: 1003, text: "Cloudy" },
    { code: 1006, text: "Cloudy" },
    { code: 1009, text: "Overcast" },
    { code: 1030, text: "Mist" },
    { code: 1063, text: "Cloudy" },
    { code: 1066, text: "Snowy" },
    { code: 1069, text: "Sleet" },
    { code: 1072, text: "Freeze" },
    { code: 1087, text: "Thundery" },
    { code: 1114, text: "Snowy" },
    { code: 1117, text: "Blizzard" },
    { code: 1135, text: "Fog" },
    { code: 1147, text: "Freezing" },
    { code: 1150, text: "Drizzle" },
    { code: 1153, text: "Drizzle" },
    { code: 1168, text: "Freezing" },
    { code: 1171, text: "Freeze" },
    { code: 1180, text: "Light Rainy" },
    { code: 1183, text: "Rainy" },
    { code: 1186, text: "Rainy" },
    { code: 1189, text: "Rainy" },
    { code: 1192, text: "Rainy" },
    { code: 1195, text: "Rainy" },
    { code: 1198, text: "Freezing" },
    { code: 1201, text: "Freezing" },
    { code: 1204, text: "Sleet" },
    { code: 1207, text: "Sleet" },
    { code: 1210, text: "Snowy" },
    { code: 1213, text: "Snowy" },
    { code: 1216, text: "Snowy" },
    { code: 1219, text: "Snowy" },
    { code: 1222, text: "Snowy" },
    { code: 1225, text: "Snowy" },
    { code: 1237, text: "IcePellets" },
    { code: 1240, text: "Rainy" },
    { code: 1243, text: "Rainy" },
    { code: 1246, text: "Rainy" },
    { code: 1249, text: "Snowy" },
    { code: 1252, text: "Sleet" },
    { code: 1255, text: "Snowy" },
    { code: 1258, text: "Snowy" },
    { code: 1261, text: "IcePallet" },
    { code: 1264, text: "Snowy" },
    { code: 1273, text: "Thundery" },
    { code: 1276, text: "Thundery" },
    { code: 1279, text: "Thundery" },
    { code: 1282, text: "Thundery" },
  ];

  for (let i = 0; i < weatherConditions.length; i++) {
    if (weatherConditions[i].code === conditionCode) {
      return weatherConditions[i].text;
    }
  }
  return "Unknown";
}

// Function to get the day name from a date string
function getDayName(dateStr) {
  const date = new Date(dateStr);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getDay()];
}

//Update Air Quality
function updateAirQuality(location) {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(
    `https://api.weatherapi.com/v1//current.json?key=${api_key}&q=${location}&aqi=yes`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      let status =
        parseFloat(result.current.air_quality.o3) >= 40.0 ? `Good^` : `Bad^`;

      airQuality.style.color = status == "Good^" ? "#0AC249" : "red";
      airQuality.innerHTML = status;

      airQualityDetails.innerHTML = ``;

      for (let i = 0; i < 3; i++) {
        airQualityDetails.innerHTML += `
           <div class="air-card col-3 mt-4 m-2 text-center">
            ${Object.keys(result.current.air_quality)[i]}
            <div class="fw-medium">${
              result.current.air_quality[
                Object.keys(result.current.air_quality)[i]
              ]
            }</div>
            </div>
        `;
      }
    })
    .catch((error) => console.error(error));
}

// Temp Graph Line chart
const myLineChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["March", "April", "May", "June", "July", "August", "September"], // X-axis
    datasets: [
      {
        label: "Temperature in °C",
        data: [20, 15, 10, 20, 25, 30, 28], // Y-axis
        backgroundColor: "rgba(92, 156, 229, 0.2)",
        borderColor: "rgba(92, 156, 2292, 1)",
        borderWidth: 1,
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
