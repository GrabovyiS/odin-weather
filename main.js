// set up event listeners
const locationInput = document.querySelector('#location');
const degreesInput = document.querySelector('#degrees');
const degreesToggleEl = document.querySelector('.toggle-degrees');
const degreesInputText = document.querySelector('.toggle-degrees + p');
const button = document.querySelector('button');
const form = document.querySelector('form');
const weatherCard = document.querySelector('.weather-card');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  renderWeather();
});

degreesToggleEl.addEventListener('click', (e) => {
  if (e.target.classList.contains('disabled')) {
    return;
  }

  toggleDegrees();
});

function getWeather(location, units) {
  return fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${units}&elements=datetime%2Cname%2Ctemp%2Chumidity%2Cconditions&key=LH7L9BQJ8VA93UEZG77J49J3B&contentType=json`,
    { mode: 'cors' }
  )
    .then((response) => {
      if (response.status === 400) {
        throw new Error(
          `This location is not found. Status code: ${response.status}`
        );
      }

      if (!response.ok) {
        throw new Error(
          `Something went wrong. Status code: ${response.status}`
        );
      }
      return response.json();
    })
    .then((result) => {
      const tempUnits = units === 'metric' ? '°C' : '°F';
      const weather = {
        address: result.address,
        resolvedAddress: result.resolvedAddress,
        currentConditions: result.currentConditions,
        tempUnits,
      };
      return weather;
    });
}

function renderWeather() {
  const location = locationInput.value;
  const units = degreesInput.checked ? 'us' : 'metric';
  console.log('rendering');
  startLoading();
  getWeather(location, units)
    .then((weather) => {
      console.log(weather);
      getGifUrl(weather.currentConditions.conditions)
        .finally(() => {
          finishLoading();
        })
        .then((gifUrl) => {
          console.log(weather, gifUrl);
          renderWeatherCard(weather, gifUrl);
        });
    })
    .catch((err) => {
      showError(err);
    });
}

function showLoader() {
  weatherCard.textContent = '';
  const loader = document.createElement('div');
  loader.classList.add('loader');
  weatherCard.appendChild(loader);
}

function hideLoader() {
  weatherCard.textContent = '';
}

function showError(err) {
  weatherCard.textContent = '';
  const errorMessage = document.createElement('p');
  errorMessage.classList.add('error-message');
  errorMessage.textContent = err;
  weatherCard.appendChild(errorMessage);
}

function renderWeatherCard(weatherData, gifUrl) {
  console.log('rendering from:', weatherData, gifUrl);

  const addressField = document.createElement('div');
  addressField.classList.add('weather-field');

  const addressHeading = document.createElement('h2');
  addressHeading.textContent = 'Address:';

  const addressText = document.createElement('p');
  addressText.textContent = weatherData.resolvedAddress;

  addressField.appendChild(addressHeading);
  addressField.appendChild(addressText);

  const conditionsField = document.createElement('div');
  conditionsField.classList.add('weather-field');

  const conditionsHeading = document.createElement('h2');
  conditionsHeading.textContent = 'Conditions:';

  const conditionsText = document.createElement('p');
  conditionsText.textContent = weatherData.currentConditions.conditions;

  conditionsField.appendChild(conditionsHeading);
  conditionsField.appendChild(conditionsText);

  const temperatureField = document.createElement('div');
  temperatureField.classList.add('weather-field');

  const temperatureHeading = document.createElement('h2');
  temperatureHeading.textContent = 'Temperature:';

  const temperatureText = document.createElement('p');
  temperatureText.textContent = `${weatherData.currentConditions.temp}${weatherData.tempUnits}`;
  temperatureText.id = 'temperature-on-card-text';

  temperatureField.appendChild(temperatureHeading);
  temperatureField.appendChild(temperatureText);

  const gif = document.createElement('img');
  gif.src = gifUrl;
  gif.width = '100';
  gif.height = '100';

  weatherCard.appendChild(addressField);
  weatherCard.appendChild(conditionsField);
  weatherCard.appendChild(temperatureField);
  weatherCard.appendChild(gif);
}

function getGifUrl(prompt) {
  return fetch(
    `https://api.giphy.com/v1/stickers/translate?api_key=EuDOpmcYGNUEWsSJWM7hUbESNPEl0kk4&s=${prompt}`
  )
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result.data.images.fixed_height_small.url;
    });
}

function toggleDegrees() {
  if (degreesInput.checked) {
    degreesInput.checked = false;
    degreesInputText.textContent = 'Celsius';
  } else {
    degreesInput.checked = true;
    degreesInputText.textContent = 'Fahrenheit';
  }

  const temperatureText = document.querySelector('#temperature-on-card-text');

  if (temperatureText && degreesInput.checked) {
    const degreesCelsius = toFahrenheit(temperatureText.textContent);
    const roundedDegreesCelsius = round(degreesCelsius, 1);

    temperatureText.textContent = `${roundedDegreesCelsius}°F`;
  } else if (temperatureText && !degreesInput.checked) {
    const degreesFahrenheit = toCelsius(temperatureText.textContent);
    const roundedDegreesFahrenheit = round(degreesFahrenheit, 1);

    temperatureText.textContent = `${roundedDegreesFahrenheit}°C`;
  }
}

function toFahrenheit(degrees) {
  const degreesCelsius = parseFloat(degrees);
  const degreesFahrenheit = (degreesCelsius * 9) / 5 + 32;
  return degreesFahrenheit;
}

function toCelsius(degrees) {
  const degreesFahrenheit = parseFloat(degrees);
  const degreesCelsius = ((degreesFahrenheit - 32) * 5) / 9;
  return degreesCelsius;
}

function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

function startLoading() {
  showLoader();
  degreesToggleEl.classList.add('disabled');
}

function finishLoading() {
  hideLoader();
  degreesToggleEl.classList.remove('disabled');
}
