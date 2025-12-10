// Оголошення змінної для обраної дати
let userSelectedDate = null;

// Отримання елементів DOM
const datetimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

// Змінна для зберігання інтервалу таймера
let timerInterval = null;

// Кнопка Start неактивна при завантаженні сторінки
startButton.disabled = true;

// Опції для flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    
    if (selectedDate) {
      // Перевірка, чи дата в минулому
      if (selectedDate < new Date()) {
        // Показуємо повідомлення через iziToast
        iziToast.error({
          title: 'Error',
          message: 'Please choose a date in the future',
          position: 'topRight',
        });
        
        // Кнопка стає неактивною
        startButton.disabled = true;
        userSelectedDate = null;
      } else {
        // Дата валідна (в майбутньому)
        userSelectedDate = selectedDate;
        startButton.disabled = false;
      }
    }
  },
};

// Ініціалізація flatpickr
const flatpickrInstance = flatpickr(datetimePicker, options);

// Функція для конвертації мілісекунд у дні, години, хвилини, секунди
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Функція для додавання ведучого нуля
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// Функція для оновлення інтерфейсу таймера
function updateTimer() {
  if (!userSelectedDate) return;

  const currentTime = new Date();
  const timeDifference = userSelectedDate - currentTime;

  if (timeDifference <= 0) {
    // Таймер досяг кінцевої дати
    clearInterval(timerInterval);
    timerInterval = null;
    
    // Встановлюємо всі значення в 00
    daysValue.textContent = '00';
    hoursValue.textContent = '00';
    minutesValue.textContent = '00';
    secondsValue.textContent = '00';
    
    // Робимо інпут активним для вибору нової дати
    datetimePicker.disabled = false;
    // Кнопка залишається неактивною
    startButton.disabled = true;
    
    return;
  }

  // Обчислюємо залишок часу
  const { days, hours, minutes, seconds } = convertMs(timeDifference);

  // Оновлюємо інтерфейс з форматуванням
  daysValue.textContent = addLeadingZero(days);
  hoursValue.textContent = addLeadingZero(hours);
  minutesValue.textContent = addLeadingZero(minutes);
  secondsValue.textContent = addLeadingZero(seconds);
}

// Обробник кліку на кнопку Start
startButton.addEventListener('click', () => {
  if (!userSelectedDate) return;

  // Робимо кнопку та інпут неактивними
  startButton.disabled = true;
  datetimePicker.disabled = true;

  // Оновлюємо таймер одразу
  updateTimer();

  // Запускаємо інтервал для оновлення кожну секунду
  timerInterval = setInterval(updateTimer, 1000);
});

