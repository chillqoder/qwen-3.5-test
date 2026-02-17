/**
 * forms.js — Обработка форм и модальных окон
 * 
 * Включает:
 * - Валидация форм
 * - Отправка данных (настраиваемый endpoint)
 * - Модальные окна с focus trap
 * - Уведомления об успехе/ошибке
 * 
 * Настройка endpoint для отправки форм:
 * Измените FORM_ENDPOINT в конфигурации ниже
 */

import { isValidEmail, isNotEmpty } from './utils.js';

// ===================================
// Конфигурация
// ===================================

/**
 * Endpoint для отправки форм
 * 
 * Варианты:
 * - Formspree: 'https://formspree.io/f/YOUR_FORM_ID'
 * - Getform: 'https://www.getform.io/f/YOUR_FORM_ID'
 * - Свой backend: '/api/submit'
 * 
 * @type {string}
 */
const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'; // ЗАМЕНИТЬ на свой

/**
 * Показывать ли уведомления в консоли
 * @type {boolean}
 */
const DEBUG_MODE = true;

// ===================================
// Modal Management
// ===================================

/**
 * Открывает модальное окно
 * @param {string} modalId — ID модального окна
 */
export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  
  modal.hidden = false;
  document.body.style.overflow = 'hidden'; // Блокируем скролл фона
  
  // Focus trap — фокус на первый интерактивный элемент
  const focusable = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusable.length) {
    focusable[0].focus();
  }
  
  // Закрытие по Esc
  const onKeydown = (e) => {
    if (e.key === 'Escape') {
      closeModal(modalId);
      document.removeEventListener('keydown', onKeydown);
    }
  };
  document.addEventListener('keydown', onKeydown);
}

/**
 * Закрывает модальное окно
 * @param {string} modalId — ID модального окна
 */
export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  
  modal.hidden = true;
  document.body.style.overflow = ''; // Возвращаем скролл
}

/**
 * Инициализирует обработчики для модальных окон
 */
export function initModals() {
  // Кнопки открытия
  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.modalOpen;
      openModal(modalId);
    });
  });
  
  // Кнопки закрытия и overlay
  document.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', () => {
      const modal = el.closest('.modal');
      if (modal) {
        closeModal(modal.id);
      }
    });
  });
  
  // Закрытие по клику на overlay
  document.querySelectorAll('.modal__overlay').forEach(overlay => {
    overlay.addEventListener('click', () => {
      const modal = overlay.closest('.modal');
      if (modal) {
        closeModal(modal.id);
      }
    });
  });
}

// ===================================
// Form Validation
// ===================================

/**
 * Валидирует поле формы
 * @param {HTMLInputElement|HTMLTextAreaElement} field — Поле для валидации
 * @returns {{valid: boolean, message: string}} Результат валидации
 */
export function validateField(field) {
  const value = field.value.trim();
  const name = field.name;
  const type = field.type;
  const required = field.required;
  
  // Проверка required
  if (required && !isNotEmpty(value)) {
    return { valid: false, message: 'Это поле обязательно для заполнения' };
  }
  
  // Проверка email
  if (type === 'email' && value && !isValidEmail(value)) {
    return { valid: false, message: 'Введите корректный email' };
  }
  
  // Проверка checkbox
  if (type === 'checkbox' && required && !field.checked) {
    return { valid: false, message: 'Необходимо согласие' };
  }
  
  return { valid: true, message: '' };
}

/**
 * Показывает ошибку валидации для поля
 * @param {HTMLInputElement|HTMLTextAreaElement} field — Поле
 * @param {string} message — Сообщение об ошибке
 */
export function showFieldError(field, message) {
  field.classList.add('input--error');
  field.setAttribute('aria-invalid', 'true');
  
  // Находим или создаём элемент ошибки
  let errorEl = field.parentElement.querySelector('.field-error');
  if (!errorEl) {
    errorEl = document.createElement('span');
    errorEl.className = 'field-error';
    errorEl.style.cssText = 'color: #ef4444; font-size: 0.8125rem; margin-top: 4px; display: block;';
    field.parentElement.appendChild(errorEl);
  }
  errorEl.textContent = message;
}

/**
 * Убирает ошибку валидации с поля
 * @param {HTMLInputElement|HTMLTextAreaElement} field — Поле
 */
export function clearFieldError(field) {
  field.classList.remove('input--error');
  field.removeAttribute('aria-invalid');
  
  const errorEl = field.parentElement.querySelector('.field-error');
  if (errorEl) {
    errorEl.remove();
  }
}

/**
 * Валидирует всю форму
 * @param {HTMLFormElement} form — Форма для валидации
 * @returns {boolean} true если форма валидна
 */
export function validateForm(form) {
  const fields = form.querySelectorAll('input, textarea, select');
  let isValid = true;
  
  fields.forEach(field => {
    const result = validateField(field);
    if (!result.valid) {
      showFieldError(field, result.message);
      isValid = false;
    } else {
      clearFieldError(field);
    }
  });
  
  return isValid;
}

// ===================================
// Form Submission
// ===================================

/**
 * Собирает данные формы в объект
 * @param {HTMLFormElement} form — Форма
 * @returns {Object} Данные формы
 */
export function getFormData(form) {
  const formData = new FormData(form);
  const data = {};
  
  formData.forEach((value, key) => {
    // Обработка checkbox
    if (form.querySelector(`[name="${key}"]`).type === 'checkbox') {
      data[key] = form.querySelector(`[name="${key}"]`).checked;
    } else {
      data[key] = value.trim();
    }
  });
  
  return data;
}

/**
 * Отправляет форму на сервер
 * @param {HTMLFormElement} form — Форма для отправки
 * @param {string} endpoint — URL endpoint (по умолчанию FORM_ENDPOINT)
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export async function submitForm(form, endpoint = FORM_ENDPOINT) {
  if (!validateForm(form)) {
    return { success: false, error: 'Валидация не пройдена' };
  }
  
  const data = getFormData(form);
  
  if (DEBUG_MODE) {
    console.log('[Form Submit] Данные формы:', data);
    console.log('[Form Submit] Endpoint:', endpoint);
  }
  
  // Если endpoint не настроен — имитируем успех
  if (endpoint === 'https://formspree.io/f/YOUR_FORM_ID' || endpoint === '') {
    if (DEBUG_MODE) {
      console.warn('[Form Submit] Endpoint не настроен! Имитация успеха.');
      console.warn('[Form Submit] Для реальной отправки настройте FORM_ENDPOINT в forms.js');
    }
    
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, data };
  }
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (DEBUG_MODE) {
      console.log('[Form Submit] Ответ сервера:', result);
    }
    
    return { success: true, data: result };
    
  } catch (error) {
    console.error('[Form Submit] Ошибка:', error);
    return { success: false, error: error.message };
  }
}

// ===================================
// Form Handlers
// ===================================

/**
 * Обрабатывает отправку формы lead (из модального окна)
 * @param {Event} e — Событие submit
 */
async function handleLeadFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  // Блокируем кнопку на время отправки
  submitBtn.disabled = true;
  submitBtn.textContent = 'Отправка...';
  
  const result = await submitForm(form);
  
  if (result.success) {
    // Закрываем форму lead
    closeModal('lead-form-modal');
    // Показываем успех
    openModal('success-modal');
    // Сбрасываем форму
    form.reset();
  } else {
    alert('Произошла ошибка при отправке. Пожалуйста, попробуйте ещё раз.');
  }
  
  // Разблокируем кнопку
  submitBtn.disabled = false;
  submitBtn.textContent = originalText;
}

/**
 * Обрабатывает отправку контактной формы
 * @param {Event} e — Событие submit
 */
async function handleContactFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  submitBtn.disabled = true;
  submitBtn.textContent = 'Отправка...';
  
  const result = await submitForm(form);
  
  if (result.success) {
    openModal('success-modal');
    form.reset();
  } else {
    alert('Произошла ошибка при отправке. Пожалуйста, попробуйте ещё раз.');
  }
  
  submitBtn.disabled = false;
  submitBtn.textContent = originalText;
}

/**
 * Инициализирует обработчики форм
 */
export function initForms() {
  // Lead form (в модалке)
  const leadForm = document.getElementById('lead-form');
  if (leadForm) {
    leadForm.addEventListener('submit', handleLeadFormSubmit);
  }
  
  // Contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactFormSubmit);
  }
  
  // Очистка ошибок при вводе
  document.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      clearFieldError(field);
    });
    
    field.addEventListener('blur', () => {
      const result = validateField(field);
      if (!result.valid && field.value.trim()) {
        showFieldError(field, result.message);
      }
    });
  });
}
