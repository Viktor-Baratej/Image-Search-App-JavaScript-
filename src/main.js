import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import {
  fetchImages,
  incrementPage,
  pages,
  resetPage,
} from './js/pixabay-api.js';

import {
  renderImages,
  showLoading,
  hideLoading,
} from './js/render-functions.js';

const body = document.querySelector('body');
let lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
  loop: true,
});

const form = document.querySelector('.form');
const userInput = document.querySelector('.user-input');
const btnPages = document.querySelector('.btn-load');

function showBtn() {
  btnPages.classList.remove('hidden');
}

export function closeBtn() {
  btnPages.classList.add('hidden');
}

closeBtn();

let userText;

form.addEventListener('submit', async event => {
  event.preventDefault();
  userText = userInput.value.trim();

  if (userText) {
    resetPage();
    showLoading();
    btnPages.removeEventListener('click', loadMoreImages);

    try {
      const data = await fetchImages(userText);
      if (!renderImages(data, lightbox)) {
        iziToast.error({
          message: 'No images found. Try a different query!',
          position: 'topRight',
        });
        closeBtn();
      } else if (data.totalHits > 15) {
        showBtn();
        btnPages.addEventListener('click', loadMoreImages);
      }
    } catch (error) {
      iziToast.error({
        message: 'An error occurred while fetching images. Please try again.',
        position: 'topRight',
      });
    } finally {
      hideLoading();
    }
  }
});

async function loadMoreImages() {
  incrementPage();
  showLoading();
  try {
    const data = await fetchImages(userText);
    if (data.hits.length === 0) {
      iziToast.warning({
        message: 'No more images to load.',
        position: 'topRight',
      });
      closeBtn();
    } else {
      renderImages(data, lightbox);
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  } catch (error) {
    iziToast.error({
      message: 'Failed to load more images. Please try again.',
      position: 'topRight',
    });
  } finally {
    hideLoading();
  }
}
