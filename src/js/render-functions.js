import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { fetchImages, pages, maxPhoto } from './pixabay-api';
import { closeBtn } from '../main';

const div = document.querySelector('.wrapp');
const list = document.querySelector('.gallery');

export function renderImages(data, lightbox) {
  if (data.total === 0) {
    list.innerHTML = '';
    return;
  } else {
    const maxPages = Math.ceil(data.totalHits / maxPhoto);
    if (pages >= maxPages) {
      closeBtn();
      iziToast.error({
        message: "You've reached the end of search results.",
        position: 'topRight',
      });
    }

    const smallImg = data.hits
      .map(
        item => `
          <li class="gallery-item">
            <a href="${item.largeImageURL}" data-source="${item.largeImageURL}">
              <img src="${item.webformatURL}" alt="${item.tags}" />
            </a>
            <div class="wrapp-items">
              <div class="info-item"><p class="bold">Likes</p><p>${item.likes}</p></div>
              <div class="info-item"><p class="bold">Views</p><p>${item.views}</p></div>
              <div class="info-item"><p class="bold">Comments</p><p>${item.comments}</p></div>
              <div class="info-item"><p class="bold">Downloads</p><p>${item.downloads}</p></div>
            </div>
          </li>`
      )
      .join('');

    list.innerHTML = pages === 1 ? smallImg : list.innerHTML + smallImg;
    lightbox.refresh();
    return true;
  }
}

export function showLoading() {
  div.classList.remove('hidden');
}

export function hideLoading() {
  div.classList.add('hidden');
}
