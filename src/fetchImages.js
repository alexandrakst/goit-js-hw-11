import axios from 'axios';

const galleryItems = {
  imagePage: 1,
  inputValue: '',
};

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '33593271-922b400b6ee77099ecc074fd7';

async function fetchImages() {
  const response = await axios.get(
    `${BASE_URL}?key=${KEY}&q=${galleryItems.inputValue}&image_type=photo$orientation=horizontal&safesearch=true&per_page=40&page=${galleryItems.imagePage}`
  );
  return response.data.hits;
}

export default { galleryItems, fetchImages };
