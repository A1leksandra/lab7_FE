// Оголошення об'єкта formData поза будь-якими функціями
const formData = {
  email: '',
  message: '',
};

// Отримання посилання на форму
const feedbackForm = document.querySelector('.feedback-form');

// Перевірка наявності форми
if (!feedbackForm) {
  console.error('Форма не знайдена! Перевірте, чи правильно підключено HTML.');
}

// Функція для збереження даних у локальне сховище
function saveToLocalStorage() {
  localStorage.setItem('feedback-form-state', JSON.stringify(formData));
}

// Функція для завантаження даних з локального сховища
function loadFromLocalStorage() {
  if (!feedbackForm) return;
  
  const savedData = localStorage.getItem('feedback-form-state');
  
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      
      // Заповнення об'єкта formData (переконаємося, що немає undefined)
      formData.email = (parsedData.email && typeof parsedData.email === 'string') ? parsedData.email : '';
      formData.message = (parsedData.message && typeof parsedData.message === 'string') ? parsedData.message : '';
      
      // Заповнення полів форми
      const emailInput = feedbackForm.querySelector('input[name="email"]');
      const messageTextarea = feedbackForm.querySelector('textarea[name="message"]');
      
      if (emailInput) {
        emailInput.value = formData.email;
      }
      if (messageTextarea) {
        messageTextarea.value = formData.message;
      }
    } catch (error) {
      console.error('Помилка при парсингу даних з localStorage:', error);
      // Очищення невалідних даних
      localStorage.removeItem('feedback-form-state');
    }
  }
}

// Завантаження даних при завантаженні сторінки
loadFromLocalStorage();

// Делегування події input на формі
if (feedbackForm) {
  feedbackForm.addEventListener('input', (event) => {
    const target = event.target;
    
    // Перевірка, чи це поле email або message
    if (target.name === 'email' || target.name === 'message') {
      // Збереження значення з обрізанням пробілів по краях
      formData[target.name] = target.value.trim();
      
      // Збереження у локальне сховище
      saveToLocalStorage();
    }
  });
}

// Обробка події submit форми
if (feedbackForm) {
  feedbackForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    // Оновлення formData з актуальними значеннями (з обрізанням пробілів)
    const emailInput = feedbackForm.querySelector('input[name="email"]');
    const messageTextarea = feedbackForm.querySelector('textarea[name="message"]');
    
    formData.email = emailInput.value.trim();
    formData.message = messageTextarea.value.trim();
    
    // Перевірка заповненості полів
    if (!formData.email || !formData.message) {
      alert('Fill please all fields');
      return;
    }
    
    // Виведення об'єкта у консоль з актуальними значеннями
    const submitData = {
      email: formData.email,
      message: formData.message,
    };
    console.log(submitData);
    
    // Очищення локального сховища
    localStorage.removeItem('feedback-form-state');
    
    // Очищення об'єкта formData
    formData.email = '';
    formData.message = '';
    
    // Очищення полів форми
    feedbackForm.reset();
  });
}

