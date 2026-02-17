import 'package:flutter_test/flutter_test.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:movieswipe/domain/models/movie.dart';
import 'package:movieswipe/data/movie_repository.dart';

void main() {
  late Box<Movie> favoritesBox;
  late Box metadataBox;
  late MovieRepository repository;

  setUpAll(() async {
    TestWidgetsFlutterBinding.ensureInitialized();
    // Initialize Hive for tests
    Hive.init('test_hive');
    // Register Hive adapter
    Hive.registerAdapter(MovieAdapter());
  });

  setUp(() async {
    // Open test boxes
    favoritesBox = await Hive.openBox<Movie>('test_favorites');
    metadataBox = await Hive.openBox('test_metadata');
    
    repository = MovieRepository(
      favoritesBox: favoritesBox,
      metadataBox: metadataBox,
    );
  });

  tearDown(() async {
    await favoritesBox.clear();
    await metadataBox.clear();
  });

  tearDownAll(() async {
    await Hive.close();
  });

  group('Movie Model', () {
    test('fromJson creates Movie with correct values', () {
      final json = {
        'id': 'test_1',
        'title': 'Тестовый фильм',
        'original_title': 'Test Movie',
        'year': 2024,
        'description': 'Описание',
        'genres': ['drama', 'comedy'],
        'moods': ['funny', 'romantic'],
        'rating': 7.5,
        'duration': 120,
        'director': 'Режиссёр',
        'cast': ['Актёр 1', 'Актёр 2'],
        'poster': 'poster.jpg',
        'backdrop': 'backdrop.jpg',
        'language': 'ru',
        'tags': ['tag1'],
        'watch_status': 'unwatched',
        'is_favorite': false,
        'tmdb_id': 12345,
        'created_at': '2024-01-01T00:00:00Z',
      };

      final movie = Movie.fromJson(json);

      expect(movie.id, 'test_1');
      expect(movie.title, 'Тестовый фильм');
      expect(movie.originalTitle, 'Test Movie');
      expect(movie.year, 2024);
      expect(movie.description, 'Описание');
      expect(movie.genres, ['drama', 'comedy']);
      expect(movie.moods, ['funny', 'romantic']);
      expect(movie.rating, 7.5);
      expect(movie.duration, 120);
      expect(movie.director, 'Режиссёр');
      expect(movie.cast, ['Актёр 1', 'Актёр 2']);
      expect(movie.isFavorite, false);
    });

    test('toJson produces correct JSON', () {
      final movie = Movie(
        id: 'test_1',
        title: 'Тест',
        year: 2024,
        description: 'Описание',
        genres: ['drama'],
        moods: ['funny'],
        rating: 8.0,
        duration: 100,
        director: 'Director',
        cast: ['Actor'],
        poster: 'poster.jpg',
        language: 'ru',
        tags: [],
        createdAt: DateTime(2024, 1, 1),
      );

      final json = movie.toJson();

      expect(json['id'], 'test_1');
      expect(json['title'], 'Тест');
      expect(json['year'], 2024);
      expect(json['genres'], ['drama']);
    });

    test('copyWith creates modified copy', () {
      final movie = Movie(
        id: 'test_1',
        title: 'Тест',
        year: 2024,
        description: 'Описание',
        genres: ['drama'],
        moods: ['funny'],
        rating: 8.0,
        duration: 100,
        director: 'Director',
        cast: ['Actor'],
        poster: 'poster.jpg',
        language: 'ru',
        tags: [],
        isFavorite: false,
        createdAt: DateTime(2024, 1, 1),
      );

      final updated = movie.copyWith(isFavorite: true, title: 'Новый заголовок');

      expect(updated.isFavorite, true);
      expect(updated.title, 'Новый заголовок');
      expect(movie.isFavorite, false); // Original unchanged
      expect(movie.title, 'Тест'); // Original unchanged
    });
  });

  group('MovieRepository Filtering', () {
    late List<Movie> testMovies;

    setUp(() {
      testMovies = [
        Movie(
          id: '1',
          title: 'Комедия Фильм',
          year: 2020,
          description: 'Смешной фильм',
          genres: ['comedy'],
          moods: ['funny'],
          rating: 7.0,
          duration: 90,
          director: 'Director A',
          cast: ['Actor A'],
          poster: 'poster1.jpg',
          language: 'ru',
          tags: ['tag1'],
          createdAt: DateTime(2020, 1, 1),
        ),
        Movie(
          id: '2',
          title: 'Драма Фильм',
          year: 2021,
          description: 'Грустный фильм',
          genres: ['drama'],
          moods: ['sad', 'dramatic'],
          rating: 8.5,
          duration: 150,
          director: 'Director B',
          cast: ['Actor B'],
          poster: 'poster2.jpg',
          language: 'ru',
          tags: ['tag2'],
          createdAt: DateTime(2021, 1, 1),
        ),
        Movie(
          id: '3',
          title: 'Фантастика Фильм',
          year: 2022,
          description: 'Научная фантастика',
          genres: ['scifi', 'action'],
          moods: ['thrilling', 'adventurous'],
          rating: 6.5,
          duration: 120,
          director: 'Director C',
          cast: ['Actor C'],
          poster: 'poster3.jpg',
          language: 'ru',
          tags: ['tag3'],
          createdAt: DateTime(2022, 1, 1),
        ),
      ];
    });

    test('filter by title query', () {
      final results = testMovies.where((movie) {
        return movie.title.toLowerCase().contains('комедия');
      }).toList();

      expect(results.length, 1);
      expect(results.first.id, '1');
    });

    test('filter by genre', () {
      final results = testMovies.where((movie) {
        return movie.genres.contains('drama');
      }).toList();

      expect(results.length, 1);
      expect(results.first.id, '2');
    });

    test('filter by minimum rating', () {
      final results = testMovies.where((movie) {
        return movie.rating >= 7.0;
      }).toList();

      expect(results.length, 2);
    });

    test('filter by maximum duration', () {
      final results = testMovies.where((movie) {
        return movie.duration <= 100;
      }).toList();

      expect(results.length, 1);
      expect(results.first.id, '1');
    });

    test('filter by mood', () {
      final results = testMovies.where((movie) {
        return movie.moods.contains('funny');
      }).toList();

      expect(results.length, 1);
      expect(results.first.id, '1');
    });

    test('filter by multiple moods', () {
      final selectedMoods = ['sad', 'thrilling'];
      final results = testMovies.where((movie) {
        return selectedMoods.any((mood) => movie.moods.contains(mood));
      }).toList();

      expect(results.length, 2);
      expect(results.map((m) => m.id), containsAll(['2', '3']));
    });

    test('combined filter with query and genres', () {
      var results = testMovies.where((movie) {
        return movie.title.toLowerCase().contains('фильм');
      }).toList();

      results = results.where((movie) {
        return movie.genres.contains('scifi') || movie.genres.contains('drama');
      }).toList();

      expect(results.length, 2);
    });
  });

  group('Hive Box Operations', () {
    test('save and retrieve movie from Hive box', () async {
      final testMovie = Movie(
        id: 'hive_test',
        title: 'Hive Test',
        year: 2024,
        description: 'Test description',
        genres: ['drama'],
        moods: ['funny'],
        rating: 7.0,
        duration: 100,
        director: 'Director',
        cast: ['Actor'],
        poster: 'poster.jpg',
        language: 'ru',
        tags: [],
        isFavorite: false,
        createdAt: DateTime(2024, 1, 1),
      );

      await favoritesBox.put(testMovie.id, testMovie.copyWith(isFavorite: true));
      
      final saved = favoritesBox.get(testMovie.id);
      expect(saved?.isFavorite, true);
      expect(saved?.id, testMovie.id);
    });
  });

  group('Get All Moods and Genres', () {
    test('extract unique moods from movies', () {
      final movies = [
        Movie(
          id: '1',
          title: 'Movie 1',
          year: 2024,
          description: 'Desc',
          genres: [],
          moods: ['funny', 'romantic'],
          rating: 7.0,
          duration: 100,
          director: 'D',
          cast: [],
          poster: 'p.jpg',
          language: 'ru',
          tags: [],
          createdAt: DateTime(2024, 1, 1),
        ),
        Movie(
          id: '2',
          title: 'Movie 2',
          year: 2024,
          description: 'Desc',
          genres: [],
          moods: ['sad', 'funny'],
          rating: 7.0,
          duration: 100,
          director: 'D',
          cast: [],
          poster: 'p.jpg',
          language: 'ru',
          tags: [],
          createdAt: DateTime(2024, 1, 1),
        ),
      ];

      final moodSet = <String>{};
      for (var movie in movies) {
        moodSet.addAll(movie.moods);
      }

      expect(moodSet.length, 3);
      expect(moodSet, containsAll(['funny', 'romantic', 'sad']));
    });

    test('extract unique genres from movies', () {
      final movies = [
        Movie(
          id: '1',
          title: 'Movie 1',
          year: 2024,
          description: 'Desc',
          genres: ['comedy', 'drama'],
          moods: [],
          rating: 7.0,
          duration: 100,
          director: 'D',
          cast: [],
          poster: 'p.jpg',
          language: 'ru',
          tags: [],
          createdAt: DateTime(2024, 1, 1),
        ),
        Movie(
          id: '2',
          title: 'Movie 2',
          year: 2024,
          description: 'Desc',
          genres: ['action'],
          moods: [],
          rating: 7.0,
          duration: 100,
          director: 'D',
          cast: [],
          poster: 'p.jpg',
          language: 'ru',
          tags: [],
          createdAt: DateTime(2024, 1, 1),
        ),
      ];

      final genreSet = <String>{};
      for (var movie in movies) {
        genreSet.addAll(movie.genres);
      }

      expect(genreSet.length, 3);
      expect(genreSet, containsAll(['comedy', 'drama', 'action']));
    });
  });
}
