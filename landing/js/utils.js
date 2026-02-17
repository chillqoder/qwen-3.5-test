/**
 * utils.js — Утилиты и вспомогательные функции
 * 
 * Включает:
 * - Расчёт токенов (TOKEN_PRICE_RUB = 0.33)
 * - Форматирование чисел
 * - Проверка email
 * - Debounce/throttle
 */

// ===================================
// Константы
// ===================================

/**
 * Цена одного токена в рублях
 * @type {number}
 */
export const TOKEN_PRICE_RUB = 0.33;

// ===================================
// Расчёт токенов
// ===================================

/**
 * Вычисляет количество токенов по сумме в рублях
 * @param {number} rubles — Сумма в рублях
 * @returns {number} Количество токенов (округлено вниз)
 */
export function calculateTokens(rubles) {
  return Math.floor(rubles / TOKEN_PRICE_RUB);
}

/**
 * Форматирует число с разделителями тысяч (пробелы)
 * @param {number} num — Число для форматирования
 * @returns {string} Отформатированное число
 */
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Форматирует цену в рублях
 * @param {number} rubles — Сумма в рублях
 * @returns {string} Отформатированная цена
 */
export function formatPrice(rubles) {
  return `${formatNumber(rubles)} ₽`;
}

// ===================================
// Валидация
// ===================================

/**
 * Проверяет корректность email
 * @param {string} email — Email для проверки
 * @returns {boolean} true если email валиден
 */
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

/**
 * Проверяет, что поле не пустое
 * @param {string} value — Значение для проверки
 * @returns {boolean} true если не пустое
 */
export function isNotEmpty(value) {
  return value && value.trim().length > 0;
}

// ===================================
// Утилиты для DOM
// ===================================

/**
 * Находит ближайшего родителя по селектору
 * @param {Element} element — Начальный элемент
 * @param {string} selector — CSS селектор
 * @returns {Element|null} Найденный родитель или null
 */
export function closestParent(element, selector) {
  if (!element) return null;
  return element.closest(selector);
}

/**
 * Плавно скроллит к элементу
 * @param {string} selector — CSS селектор элемента
 * @param {number} offset — Отступ сверху в пикселях
 */
export function scrollToElement(selector, offset = 0) {
  const element = document.querySelector(selector);
  if (!element) return;
  
  const rect = element.getBoundingClientRect();
  const top = rect.top + window.pageYOffset - offset;
  
  window.scrollTo({
    top,
    behavior: 'smooth'
  });
}

// ===================================
// Debounce / Throttle
// ===================================

/**
 * Создаёт debounced версию функции
 * @param {Function} func — Функция для debounce
 * @param {number} wait — Задержка в мс
 * @returns {Function} Debounced функция
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Создаёт throttled версию функции
 * @param {Function} func — Функция для throttle
 * @param {number} limit — Интервал в мс
 * @returns {Function} Throttled функция
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ===================================
// Инициализация расчёта токенов
// ===================================

/**
 * Инициализирует отображение расчёта токенов на странице pricing
 * Должна вызываться после загрузки DOM
 */
export function initTokenCalculation() {
  const tokenCalcElement = document.getElementById('token-calc');
  if (!tokenCalcElement) return;
  
  const tokens = calculateTokens(990);
  const formattedTokens = formatNumber(tokens);
  
  tokenCalcElement.textContent = `${formattedTokens} токенов`;
  tokenCalcElement.title = `990 ₽ ÷ ${TOKEN_PRICE_RUB} ₽ = ${formattedTokens} токенов`;
}
