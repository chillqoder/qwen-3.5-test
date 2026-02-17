# MVP Builder Landing

Статический лендинг для AI-платформы запуска стартапов MVP Builder.

## 🚀 Быстрый старт

1. **Откройте `index.html`** в любом современном браузере (двойной клик)
2. Готово! Никакой сборки и зависимостей не требуется.

## 📁 Структура проекта

```
/mvpbuilder-landing
├── index.html              # Главная страница
├── css/
│   └── styles.css         # Все стили (CSS переменные, responsive)
├── js/
│   ├── main.js            # Точка входа, инициализация
│   ├── utils.js           # Утилиты (расчёт токенов, валидация)
│   ├── animations.js      # Анимации (скролл, модалки, FAQ)
│   └── forms.js           # Обработка форм (валидация, отправка)
├── assets/
│   ├── images/            # Изображения
│   ├── illustrations/     # Иллюстрации
│   ├── lottie/            # Lottie анимации (опционально)
│   └── fonts/             # Шрифты (если локальные)
└── README.md              # Этот файл
```

## ⚙️ Настройка

### 1. Настройка отправки форм

Откройте `js/forms.js` и измените `FORM_ENDPOINT`:

```javascript
// Вариант 1: Formspree (рекомендуется)
const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

// Вариант 2: Getform
const FORM_ENDPOINT = 'https://www.getform.io/f/YOUR_FORM_ID';

// Вариант 3: Свой backend
const FORM_ENDPOINT = '/api/submit';
```

**Как получить Formspree ID:**
1. Зарегистрируйтесь на [formspree.io](https://formspree.io)
2. Создайте новую форму
3. Скопируйте ID из URL формы

### 2. Замена Lottie анимации (опционально)

В `js/animations.js` раскомментируйте код для подключения Lottie:

```javascript
import { loadAnimation } from 'lottie-web';

export function initHeroAnimation() {
  const container = document.getElementById('hero-animation');
  if (!container) return;
  
  loadAnimation({
    container: container,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'assets/lottie/hero-animation.json' // Ваш файл
  });
}
```

Поместите `.json` файл Lottie в `assets/lottie/`.

### 3. Изменение цветовой схемы

Откройте `css/styles.css` и измените CSS переменные:

```css
:root {
  --bg: #0f1720;           /* Фон */
  --surface: #0b1220;      /* Поверхности */
  --green-900: #064e3b;    /* Тёмно-зелёный */
  --green-700: #0f8b5f;    /* Основной зелёный */
  --green-500: #2dd4bf;    /* Акцент */
  --green-300: #7ee7c6;    /* Светлый акцент */
}
```

### 4. Изменение расчёта токенов

В `js/utils.js` измените константу:

```javascript
export const TOKEN_PRICE_RUB = 0.33; // Цена 1 токена в рублях
```

## 🎨 Особенности

- **Responsive дизайн** — работает на 320px, 768px, 1280px+
- **Доступность** — ARIA атрибуты, keyboard navigation, focus trap
- **Анимации** — scroll-triggered, с уважением `prefers-reduced-motion`
- **Валидация форм** — клиентская валидация с сообщениями об ошибках
- **Модальные окна** — с блокировкой скролла и закрытием по Esc
- **Без сборки** — ES6 modules работают напрямую в браузере

## 🌐 Поддержка браузеров

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📝 Секции лендинга

| Секция | Описание |
|--------|----------|
| Header | Логотип, навигация, CTA кнопка |
| Hero | Заголовок, подзаголовок, CTAs, анимация |
| Features | 6 карточек полного цикла MVP |
| Timeline | 14-дневный план запуска |
| Promo | Промо блок с CTA |
| Pricing | 3 тарифа (Базовый, Профессиональный, Токены) |
| FAQ | Аккордеон с вопросами |
| Marketplace | 3 карточки готовых идей |
| Benefits | Преимущества платформы |
| Agents | 6 AI-агентов (роли) |
| Turnkey | Разработка под ключ |
| Contact | Форма обратной связи |
| Footer | Копирайт, контакты, ссылки |

## 🔧 Расширение

### Добавление новой секции

1. Добавьте HTML в `index.html` после `<main>`
2. Добавьте стили в `css/styles.css`
3. При необходимости добавьте анимацию `data-animate="fade-up"`

### Добавление новой анимации

В `js/animations.js` создайте функцию:

```javascript
export function initMyAnimation() {
  // Ваша логика
}
```

Импортируйте и вызовите в `js/main.js`:

```javascript
import { initMyAnimation } from './animations.js';

function init() {
  // ...
  initMyAnimation();
}
```

### Интеграция аналитики

В `js/main.js` раскомментируйте блок Analytics:

```javascript
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID'); // Ваш ID
```

## 📄 Лицензия

© 2026 MVPBUILDER. Все права защищены.

---

**Контакты:** hi@mvpbuilder.ai
