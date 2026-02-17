# MovieSwipe — Flutter Mobile Application

Приложение для выбора фильмов по настроению и через свайп-взаимодействие.

## Структура проекта

```
lib/
├── main.dart                          # Точка входа, инициализация Hive и роутинг
├── data/
│   └── movie_repository.dart          # Репозиторий для работы с данными фильмов
├── domain/
│   ├── models/
│   │   ├── movie.dart                 # Модель Movie с Hive адаптером
│   │   └── movie.g.dart               # Сгенерированный Hive адаптер
│   └── repositories/
│       └── movie_repository_interface.dart  # Интерфейс репозитория
└── presentation/
    ├── theme/
    │   └── app_theme.dart             # Тёмная тема приложения
    ├── providers/
    │   └── movie_provider.dart        # Riverpod провайдеры для state management
    ├── screens/
    │   ├── home_screen.dart           # Главный экран с навигацией
    │   ├── swipe/
    │   │   └── swipe_screen.dart      # Экран свайпа фильмов
    │   ├── mood/
    │   │   └── mood_screen.dart       # Экран выбора по настроению
    │   ├── favorites/
    │   │   └── favorites_screen.dart  # Экран избранных фильмов
    │   ├── profile/
    │   │   └── profile_screen.dart    # Экран профиля/настроек
    │   ├── catalog/
    │   │   └── catalog_screen.dart    # Экран каталога/поиска
    │   └── details/
    │       └── movie_details_screen.dart  # Экран деталей фильма
    └── widgets/
        ├── movie_card.dart            # Виджет карточки фильма для свайпа
        └── movie_grid_item.dart       # Виджет карточки для сетки

test/
├── widget_test.dart                   # Тесты модели и темы
└── movie_repository_test.dart         # Тесты логики фильтрации
```

## Основные возможности

### 1. Свайп (главный экран)
- Стопка карточек с фильмами
- Свайп вправо = лайк / добавить в избранное
- Свайп влево = пропустить
- Тап по карточке = открыть детали
- Кнопки: Like, Dislike, Undo

### 2. Настроение
- Выбор mood-тегов (романтичное, смешное, триллер и т.д.)
- Случайный фильм по выбранным настроениям

### 3. Избранное
- Список сохранённых фильмов
- Удаление из избранного

### 4. Профиль
- Настройки темы (тёмная по умолчанию)
- Язык интерфейса (русский)
- Информация о приложении

### 5. Каталог
- Поиск по названию, режиссёру, актёрам
- Фильтр по жанрам

## Используемые технологии

- **Flutter** 3.x+
- **State Management**: flutter_riverpod
- **Local Storage**: Hive (для избранных фильмов)
- **Network**: cached_network_image (для загрузки постеров)
- **UI**: Material 3, кастомная тёмная тема

## Цветовая схема

- Фон: `#111219` (тёмно-серый)
- Поверхности: `#15171A`
- Текст основной: `#E6E7EB`
- Текст вторичный: `#A6A8AD`
- Акцент: `#2ECC71` (зелёный)
- Ошибка: `#FF6B6B`

## Запуск приложения

```bash
# Установка зависимостей
flutter pub get

# Генерация Hive адаптеров
dart run build_runner build --delete-conflicting-outputs

# Запуск
flutter run

# Тесты
flutter test

# Сборка
flutter build apk --debug  # или --release
```

## Данные

Фильмы загружаются из локального JSON файла:
```
assets/movies.json
```

Пользовательские данные (избранное) хранятся в Hive box `favorites`.

## Тесты

- Unit-тесты для модели Movie
- Тесты логики фильтрации
- Тесты Hive операций

Запуск: `flutter test`

## Примечания

- UI приложения полностью на русском языке
- Документация и код — на английском
- Приложение работает offline (кроме загрузки изображений постеров)
