import 'dart:convert';
import 'dart:math';
import 'package:flutter/services.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../domain/models/movie.dart';
import '../domain/repositories/movie_repository_interface.dart';

class MovieRepository implements MovieRepositoryInterface {
  final Box<Movie> _favoritesBox;
  
  List<Movie> _allMovies = [];
  bool _isInitialized = false;

  MovieRepository({
    required Box<Movie> favoritesBox,
    required Box metadataBox,
  })  : _favoritesBox = favoritesBox;

  @override
  Future<void> init() async {
    if (_isInitialized) return;

    try {
      // Load movies from JSON asset
      final jsonString = await rootBundle.loadString('assets/movies.json');
      final jsonData = json.decode(jsonString) as List;
      _allMovies = jsonData.map((item) => Movie.fromJson(item)).toList();

      // Load user-specific data (favorites, watch status) from Hive
      await _loadUserData();
      
      _isInitialized = true;
    } catch (e) {
      throw Exception('Failed to initialize repository: $e');
    }
  }

  Future<void> _loadUserData() async {
    for (var movie in _allMovies) {
      final savedMovie = _favoritesBox.get(movie.id);
      if (savedMovie != null) {
        movie.isFavorite = savedMovie.isFavorite;
        movie.watchStatus = savedMovie.watchStatus;
      }
    }
  }

  @override
  Future<List<Movie>> loadAll() async {
    if (!_isInitialized) await init();
    return _allMovies;
  }

  @override
  Future<Movie?> getById(String id) async {
    if (!_isInitialized) await init();
    try {
      return _allMovies.firstWhere((m) => m.id == id);
    } catch (e) {
      return null;
    }
  }

  @override
  Future<List<Movie>> getRandomStack({int count = 20}) async {
    if (!_isInitialized) await init();
    
    final random = Random();
    final shuffled = List<Movie>.from(_allMovies)..shuffle(random);
    return shuffled.take(count).toList();
  }

  @override
  Future<Movie?> getRandomByMood(List<String> moods) async {
    if (!_isInitialized) await init();
    
    final filtered = _allMovies.where((movie) {
      return moods.any((mood) => movie.moods.contains(mood.toLowerCase()));
    }).toList();

    if (filtered.isEmpty) return null;

    final random = Random();
    return filtered[random.nextInt(filtered.length)];
  }

  @override
  Future<List<Movie>> search(
    String query, {
    List<String>? genres,
    double? minRating,
    int? maxDuration,
  }) async {
    if (!_isInitialized) await init();

    var results = _allMovies;

    // Filter by search query
    if (query.isNotEmpty) {
      final lowerQuery = query.toLowerCase();
      results = results.where((movie) {
        return movie.title.toLowerCase().contains(lowerQuery) ||
            (movie.originalTitle?.toLowerCase().contains(lowerQuery) ?? false) ||
            movie.director.toLowerCase().contains(lowerQuery) ||
            movie.cast.any((actor) => actor.toLowerCase().contains(lowerQuery)) ||
            movie.tags.any((tag) => tag.toLowerCase().contains(lowerQuery));
      }).toList();
    }

    // Filter by genres
    if (genres != null && genres.isNotEmpty) {
      results = results.where((movie) {
        return genres.any((genre) => movie.genres.contains(genre.toLowerCase()));
      }).toList();
    }

    // Filter by minimum rating
    if (minRating != null) {
      results = results.where((movie) => movie.rating >= minRating).toList();
    }

    // Filter by maximum duration
    if (maxDuration != null) {
      results = results.where((movie) => movie.duration <= maxDuration).toList();
    }

    return results;
  }

  @override
  Future<void> toggleFavorite(String id) async {
    if (!_isInitialized) await init();

    final movieIndex = _allMovies.indexWhere((m) => m.id == id);
    if (movieIndex == -1) return;

    final movie = _allMovies[movieIndex];
    final updatedMovie = movie.copyWith(isFavorite: !movie.isFavorite);
    _allMovies[movieIndex] = updatedMovie;

    // Save to Hive
    await _favoritesBox.put(id, updatedMovie);
  }

  @override
  Future<List<Movie>> getFavorites() async {
    if (!_isInitialized) await init();
    return _allMovies.where((m) => m.isFavorite).toList();
  }

  @override
  Future<void> updateMovie(Movie movie) async {
    if (!_isInitialized) await init();

    final movieIndex = _allMovies.indexWhere((m) => m.id == movie.id);
    if (movieIndex == -1) return;

    _allMovies[movieIndex] = movie;
    await _favoritesBox.put(movie.id, movie);
  }

  @override
  Future<List<String>> getAllMoods() async {
    if (!_isInitialized) await init();
    
    final moodSet = <String>{};
    for (var movie in _allMovies) {
      moodSet.addAll(movie.moods);
    }
    return moodSet.toList()..sort();
  }

  @override
  Future<List<String>> getAllGenres() async {
    if (!_isInitialized) await init();
    
    final genreSet = <String>{};
    for (var movie in _allMovies) {
      genreSet.addAll(movie.genres);
    }
    return genreSet.toList()..sort();
  }

  // Get all unique moods for the UI
  static const List<String> defaultMoods = [
    'romantic',
    'funny',
    'thrilling',
    'calm',
    'sad',
    'nostalgic',
    'adventurous',
    'intellectual',
    'scifi',
    'horror',
    'tense',
    'dark',
    'intense',
    'dramatic',
    'inspiring',
    'mysterious',
    'action',
    'relaxing',
  ];
}
