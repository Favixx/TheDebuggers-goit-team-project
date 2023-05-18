import MarvelAPI from './api_defaults';
import { debounce } from 'lodash';

const searchHeaderInput = document.querySelector('.search-header');
const header = document.querySelector('.header');
const form = document.querySelector('.header_search');
const buttonSearchHeader = document.querySelector('#header-search');
const autocompleteList = document.querySelector('.autocomplete-list');

const apiSearch = new MarvelAPI();

window.addEventListener('scroll', () => {
  header.classList.toggle('scroll', window.scrollY > 0);
});

function submitSearchHandle(event) {
  event.preventDefault();
  localStorage.setItem('searchQuery', searchHeaderInput.value);
  form.submit();
}

form.addEventListener('submit', submitSearchHandle);

async function getDataSearch(inputValue) {
  apiSearch.setPerPage(8);
  const objectNameInfo = await apiSearch.getNameStartWith(inputValue);
  const arrName = objectNameInfo.map(el => el.name);
  return arrName;
}

searchHeaderInput.addEventListener('input', debounce(async (event) => {
  const inputValue = event.target.value.trim();
  if (inputValue === '') {
    autocompleteList.innerHTML = '';
    return;
  }

  const result = await getDataSearch(inputValue);
  autocompleteList.innerHTML = '';

  if (result.length !== 0) {
    result.forEach(element => {
        let newElement = element.substring(0, 18) +"..."
        if(result.length<19){
        newElement = element
        }
      autocompleteList.insertAdjacentHTML('beforeend', createItemListSearch(newElement));
    });
  }

  return result;
}, 250));

buttonSearchHeader.addEventListener('click', () => {
  form.submit();
});

function createItemListSearch(newElement) {
  return `
    <li class="autocomplete-list-item">${newElement}</li>
  `;
}

autocompleteList.addEventListener('click', (event) => {
    const autocompleteElem = document.querySelectorAll('.autocomplete-list-item');
    let elementFound = false;
    let selectedElement = null;
  
    autocompleteElem.forEach((elem) => {
        console.log(elem)
        console.log(event.target)
        // console.log(elem===event.currentTarget)
      if (elem === event.target) {
        elementFound = true;
        selectedElement = elem;
      }
    });
  
    if (elementFound) {
      const contentLocal = selectedElement.textContent.replace('...', '').trim();
      localStorage.setItem('searchQueryAutocomplete', contentLocal);
      form.submit();
    }
  });
// searchHeaderInput.addEventListener('blur', () => {
//   autocompleteList.style.display = 'none';
// });
searchHeaderInput.addEventListener('focus', () => {
    autocompleteList.style.display = 'block';
  });