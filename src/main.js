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

let width;

const form = document.querySelector('.form');
const userInput = document.querySelector('.user-input');
const btnPages = document.querySelector('.btn-load');

function showBtn() {
  btnPages.style.display = 'block';
  console.log('Button shown');
}

export function closeBtn() {
  btnPages.style.display = 'none';
  console.log('Button hidden');
}

closeBtn();

let userText;

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (userInput.value.trim()) {
    userText = userInput.value.trim();
    resetPage();
    btnPages.removeEventListener('click', loadMoreImages);
  } else {
    userText = undefined;
  }

  if (userText) {
    showLoading();
    try {
      const data = await fetchImages(userText);
      if (!renderImages(data, lightbox)) {
        throw new Error('No images found!');
      } else {
        showBtn();

        btnPages.addEventListener('click', loadMoreImages);
      }
    } catch (error) {
      closeBtn();
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        messageSize: 18,
        messageLineHeight: 30,
        position: 'topRight',
      });
    } finally {
      hideLoading();
    }
  }
});

async function loadMoreImages() {
  incrementPage();
  console.log('Current page:', pages);
  try {
    showLoading();
    const data = await fetchImages(userText);
    if (data.hits.length === 0) {
      closeBtn();
      iziToast.warning({
        message: 'No more images to load.',
        messageSize: 18,
        messageLineHeight: 30,
        position: 'topRight',
      });
      return;
    }
    renderImages(data, lightbox);

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    }, 300);
    update();
  } catch (error) {
    console.log(error);
  }
}

function update() {
  const elem = document.querySelector('.gallery');
  const rect = elem.getBoundingClientRect();
  if (rect.height) {
    width = rect.height;
  }
}

document.addEventListener('scroll', update);
update();
