// set up event listeners
const input = document.querySelector('input');
const button = document.querySelector('button');
const form = document.querySelector('form');

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

async function getProcessedWeather(location) {}

function renderWeather() {
  const location = input.value;
  showLoader();
  getWeather(location)
    .finally(() => hideLoader())
    .then((weather) => {
      renderWeatherCard(weather);
    })
    .catch((err) => {
      showError(err);
    });
}

function showLoader() {}

function hideLoader() {}

function showError(err) {
  console.log(err);
}

function renderWeatherCard() {}
