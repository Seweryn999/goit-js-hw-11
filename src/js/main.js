import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { searchPhrase } from './requests';

const searchForm = document.querySelector('#search-form');
const loadMore = document.querySelector('.load_more');
const gallery = document.querySelector('.gallery');
const inputForm = document.querySelector('#search-form input');
let page = 1;
const cardTemplate = obj => `
  <div class="photo-card">
    <a href="${obj.largeImageURL}">
      <img src="${obj.webformatURL}" alt="${obj.tags}" title="User: ${obj.user}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item"><b>Likes</b><span>${obj.likes}</span></p>
      <p class="info-item"><b>Views</b><span>${obj.views}</span></p>
      <p class="info-item"><b>Comments</b><span>${obj.comments}</span></p>
      <p class="info-item"><b>Downloads</b><span>${obj.downloads}</span></p>
    </div>
  </div>`;

const handleSearch = (value, resetPage = true) => {
  if (!value.trim()) {
    Notiflix.Notify.failure('Type some words in search box ;)');
    return;
  }

  searchPhrase(value, page)
    .then(response => {
      const { hits, totalHits } = response.data; // Zmiana z data na hits i totalHits
      if (!hits || !hits.length) {
        // Poprawka dla hits
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      const cards = hits.map(cardTemplate).join(''); // Poprawka dla hits
      if (resetPage) gallery.innerHTML = cards;
      else gallery.innerHTML += cards;
      if (totalHits < 40) loadMore.setAttribute('hidden', '');
      else loadMore.removeAttribute('hidden');
      lightbox.refresh();

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();
      window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
    })
    .catch(error => {
      Notiflix.Report.failure(
        'Failure',
        '"We cant reach the server."<br/><br/>- Try again later',
        'Okay'
      );
      console.log(error);
    });
};

searchForm.addEventListener('submit', ev => {
  ev.preventDefault();
  handleSearch(inputForm.value);
});

loadMore.addEventListener('click', () => {
  page++;
  handleSearch(inputForm.value, false);
});

const lightbox = new SimpleLightbox('.gallery a', {});
