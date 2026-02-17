/**
 * animations.js — Анимации и эффекты прокрутки
 * 
 * Включает:
 * - Анимация при скролле (Intersection Observer)
 * - Параллакс эффекты
 * - Микроанимации UI
 * 
 * Примечание: Для Lottie анимаций можно подключить lottie-web
 * и заменить placeholder в #hero-animation
 */

import { throttle } from './utils.js';

// ===================================
// Проверка поддержки reduced-motion
// ===================================

/**
 * Проверяет предпочтение пользователя по анимациям
 * @returns {boolean} true если анимации уменьшены
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ===================================
// Scroll Animations (Intersection Observer)
// ===================================

/**
 * Инициализирует анимации при скролле с помощью Intersection Observer
 * Анимация срабатывает когда элемент появляется во viewport
 */
export function initScrollAnimations() {
  if (prefersReducedMotion()) {
    // Если пользователь предпочёл уменьшенные анимации — показываем всё сразу
    document.querySelectorAll('[data-animate]').forEach(el => {
      el.classList.add('animate');
    });
    return;
  }
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px', // Срабатывает когда элемент виден на 50px
    threshold: 0.05
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target); // Анимировать только один раз
      }
    });
  }, observerOptions);
  
  const elements = document.querySelectorAll('[data-animate]');
  console.log('[Animations] Найдено элементов для анимации:', elements.length);
  
  elements.forEach(el => {
    observer.observe(el);
  });
}

// ===================================
// Header Scroll Effect
// ===================================

/**
 * Добавляет класс header при скролле для изменения стиля
 */
export function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;
  
  const onScroll = throttle(() => {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }, 100);
  
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Проверить начальное состояние
}

// ===================================
// Hero Animation Placeholder
// ===================================

/**
 * Инициализирует анимацию в hero секции
 * Здесь можно подключить Lottie или другую библиотеку
 * 
 * Пример подключения Lottie:
 * 
 * import { loadAnimation } from 'lottie-web';
 * 
 * export function initHeroAnimation() {
 *   const container = document.getElementById('hero-animation');
 *   if (!container) return;
 *   
 *   loadAnimation({
 *     container: container,
 *     renderer: 'svg',
 *     loop: true,
 *     autoplay: true,
 *     path: 'assets/lottie/hero-animation.json' // Путь к Lottie файлу
 *   });
 * }
 */
export function initHeroAnimation() {
  const heroAnimation = document.getElementById('hero-animation');
  if (!heroAnimation) return;
  
  // Placeholder анимация уже работает через CSS
  // Для замены на Lottie — раскомментируйте код выше
  
  // Добавляем интерактивность — лёгкое следование за мышью
  if (prefersReducedMotion()) return;
  
  heroAnimation.addEventListener('mousemove', (e) => {
    const rect = heroAnimation.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    heroAnimation.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
  });
  
  heroAnimation.addEventListener('mouseleave', () => {
    heroAnimation.style.transform = 'translate(0, 0)';
  });
}

// ===================================
// Smooth Scroll for Anchor Links
// ===================================

/**
 * Добавляет плавный скролл для якорных ссылок
 */
export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      
      const headerHeight = document.getElementById('header')?.offsetHeight || 0;
      const rect = target.getBoundingClientRect();
      const top = rect.top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
      });
      
      // Обновляем URL без скролла
      history.pushState(null, '', href);
    });
  });
}

// ===================================
// Button Hover Microanimation
// ===================================

/**
 * Добавляет микроанимации на кнопки при наведении
 */
export function initButtonAnimations() {
  if (prefersReducedMotion()) return;
  
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    btn.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
}

// ===================================
// FAQ Accordion Animation
// ===================================

/**
 * Инициализирует анимацию аккордеона для FAQ
 */
export function initFAQAnimation() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-item__header');
    if (!header) return;
    
    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      
      // Закрываем все остальные
      faqItems.forEach(otherItem => {
        const otherHeader = otherItem.querySelector('.faq-item__header');
        if (otherHeader && otherHeader !== header) {
          otherHeader.setAttribute('aria-expanded', 'false');
          otherItem.classList.remove('active');
        }
      });
      
      // Переключаем текущий
      header.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      item.classList.toggle('active');
    });
  });
}

// ===================================
// Mobile Menu Animation
// ===================================

/**
 * Инициализирует анимацию мобильного меню
 */
export function initMobileMenu() {
  const toggle = document.querySelector('.header__mobile-toggle');
  const nav = document.querySelector('.header__nav');
  const cta = document.querySelector('.header__cta');
  
  if (!toggle || !nav) return;
  
  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    
    toggle.setAttribute('aria-expanded', !isExpanded);
    nav.classList.toggle('header__nav--mobile-open');
    
    // Анимация иконки гамбургера
    const spans = toggle.querySelectorAll('span');
    if (isExpanded) {
      spans[0].style.transform = 'rotate(0) translateY(0)';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'rotate(0) translateY(0)';
    } else {
      spans[0].style.transform = 'rotate(45deg) translateY(7px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
    }
  });
}

// ===================================
// Parallax Effect (optional)
// ===================================

/**
 * Добавляет параллакс эффект для элементов
 * Использовать осторожно — может влиять на производительность
 */
export function initParallax() {
  if (prefersReducedMotion()) return;
  
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (parallaxElements.length === 0) return;
  
  const onScroll = throttle(() => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      const yPos = -(scrolled * speed);
      el.style.transform = `translateY(${yPos}px)`;
    });
  }, 16); // ~60fps
  
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ===================================
// CountUp Animation (for numbers)
// ===================================

/**
 * Анимация счётчика чисел
 * @param {Element} element — Элемент для анимации
 * @param {number} end — Конечное значение
 * @param {number} duration — Длительность в мс
 */
export function animateCountUp(element, end, duration = 2000) {
  if (prefersReducedMotion()) {
    element.textContent = end;
    return;
  }
  
  const start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (easeOutQuart)
    const ease = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (end - start) * ease);
    
    element.textContent = current.toLocaleString('ru-RU');
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}
