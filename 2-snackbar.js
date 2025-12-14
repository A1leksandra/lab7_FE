// Отримання посилання на форму
const form = document.querySelector('.form');

// Обробка події submit форми
form.addEventListener('submit', (event) => {
  event.preventDefault();

  // Отримання значень з форми
  const formData = new FormData(form);
  const delay = parseInt(formData.get('delay'), 10);
  const state = formData.get('state');

  // Створення промісу
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  // Обробка промісу
  promise
    .then((delay) => {
      // Проміс виконався успішно
      iziToast.success({
        title: 'Success',
        message: `✅ Fulfilled promise in ${delay}ms`,
        position: 'topRight',
      });
    })
    .catch((delay) => {
      // Проміс був відхилений
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${delay}ms`,
        position: 'topRight',
      });
    });

  // Очищення форми
  form.reset();
});





