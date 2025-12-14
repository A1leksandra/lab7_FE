// API ключ Pixabay
const API_KEY = '53649509-6b61dfdc22c474560588b9f4d';
const BASE_URL = 'https://pixabay.com/api/';

// Отримання елементів DOM
const searchForm = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const loader = document.getElementById('loader');

// Ініціалізація SimpleLightbox
let lightbox = null;

// Функція для показу індикатора завантаження
function showLoader() {
  loader.style.display = 'flex';
}

// Функція для приховування індикатора завантаження
function hideLoader() {
  loader.style.display = 'none';
}

// Функція для очищення галереї
function clearGallery() {
  gallery.innerHTML = '';
}

// Функція для створення розмітки картки зображення
function createImageCard(image) {
  return `
    <li class="gallery-item">
      <a href="${image.largeImageURL}" class="gallery-link">
        <img
          src="${image.webformatURL}"
          alt="${image.tags}"
          class="gallery-image"
          loading="lazy"
        />
      </a>
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
    </li>
  `;
}

// Функція для відображення зображень у галереї
function renderGallery(images) {
  const markup = images.map(createImageCard).join('');
  gallery.insertAdjacentHTML('beforeend', markup);

  // Оновлення SimpleLightbox після додавання нових елементів
  if (lightbox) {
    lightbox.refresh();
  } else {
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  }
}

// Функція для виконання HTTP-запиту
function fetchImages(searchQuery) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  });

  const url = `${BASE_URL}?${params.toString()}`;

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      throw error;
    });
}

// Обробка події submit форми
searchForm.addEventListener('submit', (event) => {
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
  clearGallery();

  // Показ індикатора завантаження
  showLoader();

  // Виконання HTTP-запиту з використанням then() та catch()
  fetchImages(searchQuery)
    .then((data) => {
      // Приховування індикатора завантаження
      hideLoader();

      // Перевірка наявності результатів
      if (data.hits && data.hits.length > 0) {
        // Відображення зображень
        renderGallery(data.hits);
      } else {
        // Показ повідомлення про відсутність результатів
        iziToast.info({
          title: 'Info',
          message: 'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
        });
      }
    })
    .catch((error) => {
      // Приховування індикатора завантаження при помилці
      hideLoader();

      // Показ повідомлення про помилку
      iziToast.error({
        title: 'Error',
        message: 'Something went wrong. Please try again later.',
        position: 'topRight',
      });

      console.error('Error fetching images:', error);
    });

  // Очищення поля пошуку
  event.target.searchQuery.value = '';
});

