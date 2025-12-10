// API ключ Pixabay
const API_KEY = '53649509-6b61dfdc22c474560588b9f4d';
const BASE_URL = 'https://pixabay.com/api/';

// Отримання елементів DOM
const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('#gallery');
const loader = document.querySelector('#loader');
let lightbox = null;

// Обробка події submit форми
searchForm.addEventListener('submit', handleSearch);

function handleSearch(event) {
  event.preventDefault();

  // Отримання значення пошукового запиту
  const searchQuery = event.target.searchQuery.value.trim();

  // Перевірка на порожній рядок
  if (!searchQuery) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query',
      position: 'topRight',
    });
    return;
  }

  // Очищення попередніх результатів
  gallery.innerHTML = '';

  // Показ індикатора завантаження
  showLoader();

  // Виконання HTTP-запиту
  fetchImages(searchQuery)
    .then((images) => {
      hideLoader();

      if (images.length === 0) {
        iziToast.error({
          title: 'Error',
          message: 'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
        });
        return;
      }

      // Відображення зображень
      renderGallery(images);
    })
    .catch((error) => {
      hideLoader();
      iziToast.error({
        title: 'Error',
        message: 'An error occurred while fetching images. Please try again later.',
        position: 'topRight',
      });
      console.error('Error:', error);
    });
}

// Функція для виконання HTTP-запиту до Pixabay API
function fetchImages(query) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  });

  return fetch(`${BASE_URL}?${params}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data.hits || [];
    });
}

// Функція для відображення галереї
function renderGallery(images) {
  const galleryMarkup = images
    .map(
      (image) => `
    <li class="gallery-item">
      <a href="${image.largeImageURL}" class="gallery-link">
        <img
          src="${image.webformatURL}"
          alt="${image.tags}"
          class="gallery-image"
          loading="lazy"
        />
        <div class="image-info">
          <p class="info-item">
            <b>Likes</b>
            <span>${image.likes}</span>
          </p>
          <p class="info-item">
            <b>Views</b>
            <span>${image.views}</span>
          </p>
          <p class="info-item">
            <b>Comments</b>
            <span>${image.comments}</span>
          </p>
          <p class="info-item">
            <b>Downloads</b>
            <span>${image.downloads}</span>
          </p>
        </div>
      </a>
    </li>
  `
    )
    .join('');

  // Додавання розмітки до галереї за одну операцію
  gallery.insertAdjacentHTML('beforeend', galleryMarkup);

  // Оновлення SimpleLightbox після додавання нових елементів
  if (lightbox) {
    lightbox.refresh();
  } else {
    // Ініціалізація SimpleLightbox
    lightbox = new SimpleLightbox('.gallery-link', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  }
}

// Функція для показу індикатора завантаження
function showLoader() {
  loader.style.display = 'flex';
}

// Функція для приховування індикатора завантаження
function hideLoader() {
  loader.style.display = 'none';
}

