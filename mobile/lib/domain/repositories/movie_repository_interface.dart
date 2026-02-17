import '../models/movie.dart';

abstract class MovieRepositoryInterface {
  Future<void> init();
  Future<List<Movie>> loadAll();
  Future<Movie?> getById(String id);
  Future<List<Movie>> getRandomStack({int count = 20});
  Future<Movie?> getRandomByMood(List<String> moods);
  Future<List<Movie>> search(String query, {List<String>? genres, double? minRating, int? maxDuration});
  Future<void> toggleFavorite(String id);
  Future<List<Movie>> getFavorites();
  Future<void> updateMovie(Movie movie);
  Future<List<String>> getAllMoods();
  Future<List<String>> getAllGenres();
}
