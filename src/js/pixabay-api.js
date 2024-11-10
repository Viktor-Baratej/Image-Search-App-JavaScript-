import axios from 'axios';

export let pages = 1;
export let maxPhoto = 15;
export function incrementPage() {
  pages += 1;
}
export function resetPage() {
  pages = 1;
}
export async function fetchImages(userInput) {
  const keyApi = '46773204-8ec36d0a78d9132ebe706b3ce';
  let url = `https://pixabay.com/api/?key=${keyApi}&q=${userInput}&image_type=photo&orientation=horizontal&safesearch=true&page=${pages}&per_page=3`;

  const params = new URLSearchParams({
    key: keyApi,
    q: userInput,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: pages,
    per_page: maxPhoto,
  });

  const response = await axios.get(`https://pixabay.com/api/?${params}`);

  return response.data;
}
