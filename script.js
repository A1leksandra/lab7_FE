const images = [
  {
    preview:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    original:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=900&fit=crop',
    description: 'Команда працює над дизайн-проєктом з кольоровими нотатками',
  },
  {
    preview:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    original:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=900&fit=crop',
    description: 'Ідея в руках на градієнтному фоні',
  },
  {
    preview:
      'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=400&h=300&fit=crop',
    original:
      'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=1200&h=900&fit=crop',
    description: 'Смартфон з текстом біля рослини та кави',
  },
  {
    preview:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
    original:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=900&fit=crop',
    description: 'Сучасна переговорна кімната з дерев\'яним столом',
  },
  {
    preview:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=300&fit=crop',
    original:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=900&fit=crop',
    description: 'Яскравий офісний інтер\'єр з кольоровими стінами',
  },
  {
    preview:
      'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=400&h=300&fit=crop',
    original:
      'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=1200&h=900&fit=crop',
    description: 'Відкритий офісний простір з працівниками',
  },
  {
    preview:
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop',
    original:
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&h=900&fit=crop',
    description: 'Робочий стіл з ноутбуком та канцелярією',
  },
  {
    preview:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop',
    original:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=900&fit=crop',
    description: 'Людина працює на ноутбуці в жовтому светрі',
  },
  {
    preview:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop',
    original:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=900&fit=crop',
    description: 'Команда на зустрічі з презентацією',
  },
];

// Створення розмітки галереї
const galleryContainer = document.querySelector('.gallery');

const galleryMarkup = images
  .map(
    ({ preview, original, description }) => `
    <li class="gallery-item">
      <a class="gallery-link" href="${original}">
        <img
          class="gallery-image"
          src="${preview}"
          alt="${description}"
          data-original="${original}"
        />
      </a>
    </li>
  `
  )
  .join('');

galleryContainer.innerHTML = galleryMarkup;

// Делегування подій на ul.gallery
galleryContainer.addEventListener('click', (event) => {
  event.preventDefault();
  
  const clickedElement = event.target.closest('.gallery-item');
  if (!clickedElement) return;
  
  const imageElement = clickedElement.querySelector('.gallery-image');
  if (!imageElement) return;
  
  const originalImageUrl = imageElement.dataset.original || imageElement.closest('.gallery-link').href;
  const imageDescription = imageElement.alt;
  
  // Виведення посилання на велике зображення в консоль
  console.log('Посилання на велике зображення:', originalImageUrl);
  
  // Відкриття модального вікна з basicLightbox
  const instance = basicLightbox.create(
    `
    <div class="modal-content">
      <img src="${originalImageUrl}" alt="${imageDescription}" class="modal-image" />
      <p class="modal-description">${imageDescription}</p>
    </div>
    `,
    {
      onShow: (instance) => {
        document.addEventListener('keydown', closeOnEscape);
      },
      onClose: (instance) => {
        document.removeEventListener('keydown', closeOnEscape);
      },
    }
  );
  
  function closeOnEscape(event) {
    if (event.key === 'Escape') {
      instance.close();
    }
  }
  
  instance.show();
});

