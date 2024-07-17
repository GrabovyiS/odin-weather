// set up event listeners
const input = document.querySelector('input');
const button = document.querySelector('button');
const form = document.querySelector('form');
const weatherCard = document.querySelector('.weather-card');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  renderWeather();
});

function getWeather(location) {
  return fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&elements=datetime%2Cname%2Ctemp%2Chumidity%2Cconditions&key=LH7L9BQJ8VA93UEZG77J49J3B&contentType=json`,
    { mode: 'cors' }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Bad request. Status code: ${response.status}`);
      }
      return response.json();
    })
    .then((result) => {
      const weather = {
        address: result.address,
        resolvedAddress: result.resolvedAddress,
        currentConditions: result.currentConditions,
      };
      return weather;
    });
}

function renderWeather() {
  const location = input.value;
  console.log('rendering');
  showLoader();
  getWeather(location)
    .then((weather) => {
      console.log(weather);
      getGifUrl(weather.currentConditions.conditions)
        .finally(() => hideLoader())
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
  temperatureText.textContent = weatherData.currentConditions.temp;

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
