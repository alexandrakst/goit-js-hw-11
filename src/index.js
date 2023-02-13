import './css/styles.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import searchImages from './fetchImages';

const refs = {
  form: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  galleryContainer: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
refs.loadMoreBtn.classList.add('is-hidden');

function onSubmit(evt) {
  evt.preventDefault();
  const form = evt.currentTarget;
  searchImages.galleryItems.inputValue = form.elements.searchQuery.value.trim();
  refs.loadMoreBtn.classList.remove('is-hidden');

  if (searchImages.galleryItems.inputValue === '') {
    refs.galleryContainer.innerHTML = '';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    refs.loadMoreBtn.classList.add('is-hidden');
    return;
  }

  searchImages.fetchImages(searchImages.galleryItems.inputValue).then(items => {
    if (items.length === 0) {
      refs.galleryContainer.innerHTML = '';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      refs.loadMoreBtn.classList.add('is-hidden');
      return;
    }

    refs.form.reset();
    console.log(items);
  });

  clearInterface(refs.galleryContainer);
  searchImages.galleryItems.imagePage = 1;
  onLoadMoreBtnClick();
}

function onLoadMoreBtnClick() {
  refs.loadMoreBtn.disabled = true;
  refs.loadMoreBtn.textContent = 'Loading...';

  try {
    searchImages
      .fetchImages(searchImages.galleryItems.inputValue)
      .then(items => {
        searchImages.galleryItems.imagePage += 1;
        console.log(items);
        renderImages(items);
        gallery.refresh();
        refs.loadMoreBtn.disabled = false;
        refs.loadMoreBtn.textContent = 'Load more';
      });
  } catch (error) {
    if (error.response.status === 400) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      refs.loadMoreBtn.classList.add('is-hidden');
    }
  }
}

function renderImages(hits) {
  const markup = hits
    .map(
      hit => `<div class="photo-card">
   <a href="${hit.largeImageURL}"><img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" style="object-fit:cover;"/></a>
   <div class="info">
     <p class="info-item">
       <b>Likes <br>${hit.likes}</b>
     </p>
     <p class="info-item">
       <b>Views <br>${hit.views}</b>
     </p>
     <p class="info-item">
       <b>Comments <br>${hit.comments}</b>
     </p>
     <p class="info-item">
       <b>Downloads <br>${hit.downloads}</b>
     </p>
   </div>
 </div>`
    )
    .join('');

  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
}

const gallery = new SimpleLightbox('.gallery a', {
  captions: true,
  captionDelay: 250,
});

function clearInterface(picture) {
  return (picture.innerHTML = '');
}
