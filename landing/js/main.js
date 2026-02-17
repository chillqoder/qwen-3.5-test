/**
 * main.js — Точка входа приложения
 * 
 * Инициализирует все модули после загрузки DOM:
 * - utils: расчёт токенов
 * - animations: скролл-анимации, модальные окна, FAQ
 * - forms: обработка форм
 * 
 * Примечание: Все скрипты работают без сборки (ES6 modules)
 */

import { initTokenCalculation } from './utils.js';
import {
  initScrollAnimations,
  initHeaderScroll,
  initHeroAnimation,
  initSmoothScroll,
  initButtonAnimations,
  initFAQAnimation,
  initMobileMenu
} from './animations.js';
import { initModals, initForms } from './forms.js';

// ===================================
// Инициализация после загрузки DOM
// ===================================

/**
 * Главная функция инициализации
 * Вызывается когда DOM полностью загружен
 */
function init() {
  console.log('[MVP Builder] Инициализация...');
  
  // Добавляем класс чтобы включить JS-зависимые стили
  document.documentElement.classList.add('js-loaded');
  
  // Утилиты
  initTokenCalculation();
  
  // Анимации
  initScrollAnimations();
  initHeaderScroll();
  initHeroAnimation();
  initSmoothScroll();
  initFAQAnimation();
  initMobileMenu();
  
  // Кнопки (опционально, только если не prefers-reduced-motion)
  initButtonAnimations();
  
  // Модальные окна
  initModals();
  
  // Формы
  initForms();
  
  console.log('[MVP Builder] Готово!');
}

// ===================================
// Запуск
// ===================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM уже загружен (например, скрипт загружен с defer)
  init();
}

// ===================================
// Service Worker (опционально)
// ===================================

/**
 * Регистрация Service Worker для офлайн-режима
 * Раскомментировать если нужен PWA
 */
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('[SW] Registered:', registration.scope);
      })
      .catch(error => {
        console.log('[SW] Registration failed:', error);
      });
  });
}
*/

// ===================================
// Analytics (опционально)
// ===================================

/**
 * Подключение аналитики
 * Замените на свой код Google Analytics / Yandex Metrica / etc.
 */
/*
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID');
*/
