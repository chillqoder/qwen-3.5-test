import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:movieswipe/domain/models/movie.dart';
import 'package:movieswipe/presentation/theme/app_theme.dart';

void main() {
  testWidgets('AppTheme dark theme has correct colors', (WidgetTester tester) async {
    expect(AppTheme.background, const Color(0xFF111219));
    expect(AppTheme.surface, const Color(0xFF15171A));
    expect(AppTheme.primaryText, const Color(0xFFE6E7EB));
    expect(AppTheme.accent, const Color(0xFF2ECC71));
  });

  test('Movie model fromJson and toJson', () {
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
    expect(movie.genres, ['drama', 'comedy']);
    expect(movie.moods, ['funny', 'romantic']);
    expect(movie.rating, 7.5);
    expect(movie.duration, 120);
    expect(movie.isFavorite, false);
  });

  test('Movie copyWith creates modified copy', () {
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
}
