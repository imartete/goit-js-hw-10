import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const inputNode = document.querySelector('#search-box');
const countryListNode = document.querySelector('.country-list');
const countryInfoNode = document.querySelector('.country-info');

inputNode.addEventListener(
  'input',
  debounce(event => {
    const searchedCountry = event.target.value.trim();
    fetchCountries(searchedCountry)
      .then(countriesArray => {
        if (countriesArray.length === 1) {
          countryListNode.textContent = '';
          countryInfoNode.replaceChildren(createCountryMeta(countriesArray[0]));
        } else if (countriesArray.length > 10) {
          countryListNode.textContent = countryInfoNode.textContent = '';
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else {
          countryInfoNode.textContent = '';
          countryListNode.replaceChildren(...createCountryList(countriesArray));
        }
      })
      .catch(error => {
        countryInfoNode.textContent = countryListNode.textContent = '';
        if (searchedCountry)
          Notify.failure('Oops, there is no country with that name');
      });
  }, DEBOUNCE_DELAY)
);

function createCountryList(countriesArray) {
  return countriesArray.map(country => {
    const countryListItem = document.createElement('li');
    countryListItem.classList.add('country-list-item');

    const countryListTitle = document.createElement('p');
    countryListTitle.textContent = country.name.official;
    countryListTitle.classList.add('country-list-title');

    const countryListIcon = document.createElement('img');
    countryListIcon.src = country.flags.svg;
    countryListIcon.classList.add('country-list-icon');

    countryListItem.append(countryListIcon, countryListTitle);
    return countryListItem;
  });
}

function createCountryMeta(countryObject) {
  const countryDiv = document.createElement('div');

  const countryTitle = document.createElement('p');
  countryTitle.textContent = countryObject.name.official;
  countryTitle.classList.add('country-title');

  const countryIcon = document.createElement('img');
  countryIcon.src = countryObject.flags.svg;

  const capital = document.createElement('p');
  capital.textContent = 'Capital: ' + countryObject.capital.join(', ');

  const population = document.createElement('p');
  population.textContent = 'Population: ' + countryObject.population;

  const languages = document.createElement('p');
  languages.textContent =
    'Languages: ' + Object.values(countryObject.languages).join(', ');

  countryDiv.append(countryIcon, countryTitle, capital, population, languages);
  return countryDiv;
}
