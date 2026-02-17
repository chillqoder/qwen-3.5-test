# MVPBUILDER — Landing Technical Specification (AI‑ready)

> **Goal:** produce a clear, AI-friendly technical specification in **English** describing a static landing site. All visible UI copy on the site must be **Russian** (provided in this spec). The deliverable is a ready-to-implement spec that a frontend developer or an LLM can use to generate HTML/CSS/JS assets.

---

## 1. Project Overview

**Project name:** MVP Builder — AI platform to launch startups

**What to build:** a responsive, animated marketing landing page (no backend required) that presents the product, service flow (14 days MVP), pricing, marketplace of ideas, agents (roles), FAQ, and a contact/lead capture form. The landing page must be static and work by opening `index.html`.

**Language requirements:**

* Specification (this document): **English**.
* All user-facing site copy: **Russian** (text blocks provided below).

---

## 2. Deliverables

* `index.html`, `css/styles.css`, `js/main.js`, and supporting modules.
* Optimized assets folder (`assets/images`, `assets/illustrations`, `assets/lottie`, `assets/fonts`).
* Accessible, semantic HTML with ARIA where appropriate.
* Modular, commented ES6 JavaScript (no build step required).
* Animation hooks and a short README with instructions how to run locally.

---

## 3. Technology & Libraries

**Base stack:** HTML5, CSS3, Vanilla JavaScript (ES6+).

**Allowed helper libraries (choose any as needed):**

* Animations & scroll: **GSAP (with ScrollTrigger)**, **AOS**, **Lenis**.
* Vector animations: **Lottie (lottie-web)**.
* Carousel / sliders: **Swiper.js**.
* Smooth UI utilities: **MicroModal**, **FocusTrap**.

**Not allowed:** React / Next.js / Vue / Svelte or other SPA frameworks. The page must be static and openable by `index.html` in the browser.

**Performance constraints:**

* Avoid heavy runtime frameworks. Use CDN or local minified bundles only for chosen libs.
* All animations must respect `prefers-reduced-motion`.

---

## 4. Visual Identity (Supabase‑like greens)

Provide CSS variables for the palette. Example:

```css
:root{
  --bg: #0f1720;           /* dark background */
  --surface: #0b1220;
  --green-900: #064e3b;
  --green-700: #0f8b5f;    /* primary */
  --green-500: #2dd4bf;    /* accent */
  --green-300: #7ee7c6;
  --muted: #94a3b8;
  --white: #ffffff;
}
```

**Typography:**

* Primary: **Inter** (Google Fonts)
* Accent/Headlines: **Space Grotesk** or **Poppins** (optional)

**Spacing & layout:** mobile-first grid, comfortable whitespace, large hero with left-aligned copy and right-side visual.

---

## 5. File & Folder Structure

```
/mvpbuilder-landing
  index.html
  /css
    styles.css
  /js
    main.js
    animations.js
    forms.js
    utils.js
  /assets
    /images
    /illustrations
    /lottie
    /fonts
  README.md
```

---

## 6. Page Structure (blocks & required copy)

All headings, buttons and microcopy must be in Russian exactly as specified. Use the provided Russian text in the markup.

1. **Header** (sticky): logo (SVG), nav links: Продукт | Тарифы | Marketplace | Агенты | Контакты, CTA — **Получить план запуска**.

2. **Hero** (first screen): left column with title, subtitle, CTAs; right column with animated illustration.

   * Title (RU): **MVP за 14 дней без хаоса и лишних затрат**
   * Subtitle (RU): **За 14 дней вы получите стратегию и документацию, готовый MVP. 9 дней на анализ, 5 дней на разработку.**
   * Primary CTA (RU): **Получить план запуска**
   * Secondary CTA (RU): **Узнать тарифы**
   * Tiny feature list (RU): `Бизнес-план · Анализ рынка · Документация MVP · Go‑to‑market`

3. **Full cycle / Features block**

   * Heading (RU): **Полный цикл подготовки MVP**
   * Subtitle (RU): **Получите все ключевые материалы от идеи рынка до документации для разработки и запуска.**
   * Six cards (icon + title + 1‑line text) in Russian: Проработка идеи; Анализ аудитории; Бизнес-план; План действий; MVP‑документация; Реализация.

4. **14‑day Timeline**

   * Heading (RU): **График от идеи до первых пользователей за 14 дней**
   * Subheading (RU): **9 дней на стратегию и документацию, 5 дней на разработку MVP**
   * Day cards (RU):

     * **Дни 1–3: Идеи — Рынок** — `Проверяем спрос, конкуренты, формируем сильное позиционирование, анализ рынка, портрет аудитории, ценность продукта.`
     * **Дни 4–6: Архитектура MVP** — `Определяем ядро продукта, фичи, ключевые сценарии, юзерфлоу, функциональные требования, структура данных.`
     * **Дни 7–9: Бизнес‑запуск** — `Составляем экономику, каналы привлечения, стратегии роста.`
     * **Дни 10–14: Создание MVP** — `Вайп-кодинг MVP, QA, feedback, подготовка релиза.`
     * **Финал (после 14 дней)** — `Релиз: первые пользователи, маркетинг, PR, онбординг.`

5. **Promo / Reassurance block** (short UTP) — RU: `AI‑платформа для запуска стартапов — MVP за 14 дней` + CTA `Начать запуск сейчас`.

6. **Pricing** — three columns; currency — ₽ (rubles). Use the exact Russian labels below for each card.

   * **Базовый** — `2 999 ₽/мес`

     * `1 проект в месяц`
     * `Быстрый анализ идеи`
     * `План запуска за 14 дней`
     * `Экспорт в PDF`
     * `Включено: 3 000 токенов/мес`
     * CTA: `Купить`

   * **Профессиональный** — `9 999 ₽/мес`

     * `Неограниченное количество проектов`
     * `Полная MVP‑документация`
     * `Бизнес‑планы, финансовая модель`
     * `Анализ рынка и конкурентов`
     * `Приоритетная поддержка`
     * `Включено: 10 000 токенов/мес`
     * CTA: `Купить`

   * **Токены** (разовый) — `990 ₽`

     * Label (RU): `Токены единовременные — без подписки`
     * Note (RU): `Гибкое использование, токены без срока действия, доступ к регистрации.`
     * Token calculation rule: include a displayed calculation using a constant `TOKEN_PRICE_RUB = 0.33` → `990 ₽ ÷ 0.33 ₽ = 3 000 токенов`.
     * CTA: `Купить токены`

7. **FAQ** — use the following Russian Q&A items:

   * **Как расходуются токены?** — `Каждый запрос или генерация потребляет токены. Мелкие операции — 1–10 токенов, генерация полного плана — ~100–500 токенов (пример).`
   * **Могу ли я экспортировать документацию?** — `Да — PDF / MD / JSON.`
   * **Насколько точные результаты?** — `Результат зависит от входных данных; платформа даёт рабочие гипотезы и требует human‑in‑the‑loop проверку.`
   * **Есть ли бесплатный период?** — `Опционально: 7‑дневный trial с 500 токенами.`
   * **Связаться с поддержкой** — `hi@mvpbuilder.ai` (RU label: `Свяжитесь с поддержкой`).

8. **Marketplace of ideas**

   * Heading (RU): `Marketplace идей`
   * Subtitle (RU): `Готовые идеи с первичной валидацией — купите и получите стартовый пакет`.
   * Three sample cards (title, one-line RU description, deliverables, price):

     1. **EcoShop AI** — `Маркетплейс для локальных экологичных товаров с AI‑рекомендациями.` Deliverables: one‑pager, TAM, конкурентный анализ. Price: **15 000 ₽**.
     2. **AutoMVP Store** — `Генератор лендингов и MVP для локального бизнеса (шаблоны + интеграции).` Deliverables: продуктовая идея, минимальный фреймворк, план монетизации. Price: **10 000 ₽**.
     3. **HealthFace AI** — `Сервис персонализированных планов здоровья с ИИ‑ассистентом.` Deliverables: краткая документация, целевая аудитория, оценка рынка. Price: **12 500 ₽**.
   * CTA: `Открыть Marketplace`.

9. **Benefits / Why MVPBUILDER** (bullet list in RU)

   * `Глубокий анализ рынка`
   * `Валидация идеи и спроса`
   * `Готовые артефакты (one‑pager, PRD, flow, financials)`
   * `Быстрый запуск — от идеи до релиза`
   * `Human‑in‑the‑loop финальная проверка`

10. **Agents (roles)** — 6+1 cards; each card title and one‑line RU description (examples):

* `Продукт‑архитектор` — `Определяет ядро, API, стек. Выход: PRD, ER‑diagram.`
* `Маркет‑аналитик` — `Изучает рынок, сегменты, каналы. Выход: TAM, конкурентный анализ.`
* `Маркетинг‑специалист` — `Стратегии продвижения, первые каналы. Выход: launch plan, KPI.`
* `UX/Product Designer` — `Прототипы, user‑flows. Выход: Figma prototype.`
* `UI Designer` — `Визуальная система, assets. Выход: UI‑kit.`
* `Финансовый advisor` — `Финмодель, unit economics. Выход: P&L, прогноз.`
* CTA: `Нужен кастомный агент — обсудить задачу`.

11. **Turnkey Development** (service pitch in RU)

* Heading (RU): `Разработка под ключ`
* Short description (RU): `Мы превращаем вашу документацию из MVP в готовый технологичный продукт.`
* Bullets (RU) with capabilities: `SaaS web‑platform`, `Mobile‑first (Flutter)`, `Telegram ecosystem`, `AI Engineering`, `Custom LLM agents`.
* CTA: `Реализовать мой MVP`.

12. **Footer** (RU): `© 2026 MVPBUILDER. Все права защищены.` Contact: `hi@mvpbuilder.ai`, links to Privacy Policy and Terms.

---

## 7. UX & Animation Requirements

* **Hero:** animated Lottie or light canvas visualization on the right. Left column contains Russian copy and two CTAs. Primary CTA should have an entrance microanimation.
* **Timeline:** on desktop — horizontal timeline; mobile — stacked vertical cards. Cards animate on scroll (fade + translateY) via ScrollTrigger/AOS.
* **Pricing:** highlight recommended plan with a slight scale/raised shadow. Show token calculation inline for the token pack.
* **Modal & forms:** accessible focus trap; keyboard close via Esc.
* Use transform & opacity for animations (GPU friendly). Respect `prefers‑reduced‑motion`.

---

## 8. Forms & Interactions

* Main lead form fields (RU labels): `Имя`, `Email`, `Краткое описание идеи` (textarea), `Согласие` checkbox.
* Submit: client validation + POST to a configurable endpoint (or Formspree). The README must explain how to swap endpoint.
* On successful submit: show modal in RU: `Спасибо! Мы подготовим ваш план запуска и свяжемся с вами.`

---

## 9. Pricing & Token Calculation (exact rule)

Set a constant `TOKEN_PRICE_RUB = 0.33`. When rendering the token package card, display the computed tokens: `Math.floor(990 / TOKEN_PRICE_RUB) = 3000 tokens` (show result `3 000 токенов`). Keep this calculation in `utils.js` and show results in the pricing card dynamically.

---

## 10. Acceptance Criteria

* All UI copy appears exactly in Russian as specified above.
* The page opens by double‑clicking `index.html` in a modern browser.
* Responsive & accessible (320px, 768px, 1280px).
* Animations are smooth and optional libs loaded lazily.
* Forms function and README explains endpoints.

---

## 11. Hidden Prompting Tips (to improve AI code generation)

When sending this spec to an LLM or AI-based code generator, include the following short instructions in the prompt to reduce errors:

1. **"Produce static HTML/CSS/JS files only — no build step, no frameworks."**
2. **"Use CSS variables for colors and a single `styles.css` file."**
3. **"Split JavaScript into modules: `main.js`, `animations.js`, `forms.js`, `utils.js`."**
4. **"Respect `prefers-reduced-motion` and keyboard accessibility."**
5. **"Leave comments where to change Lottie files and where to swap the form endpoint."**
6. **"Do not invent additional pages — keep everything on a single landing file."**

---

## 12. Next steps (suggested)

* Confirm color shades/brand assets and provide logo SVG.
* Decide whether to use Lottie illustrations (supply `.json`) or static SVG placeholders.
* If you want, I can generate a starter kit: `index.html`, `css/styles.css`, `js/main.js` with the Russian copy and basic animations (no libraries), ready to iterate.

---

*End of English spec. All user-facing text included above is in Russian as requested.*
