import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';

import '../../domain/models/movie.dart';
import '../../data/movie_repository.dart';

// Hive boxes providers
final favoritesBoxProvider = Provider<Box<Movie>>((ref) {
  return Hive.box<Movie>('favorites');
});

final metadataBoxProvider = Provider<Box>((ref) {
  return Hive.box('movie_metadata');
});

// Repository provider
final movieRepositoryProvider = Provider<MovieRepository>((ref) {
  final favoritesBox = ref.watch(favoritesBoxProvider);
  final metadataBox = ref.watch(metadataBoxProvider);
  return MovieRepository(
    favoritesBox: favoritesBox,
    metadataBox: metadataBox,
  );
});

// Provider for initialization state
final initProvider = FutureProvider<void>((ref) async {
  final repository = ref.watch(movieRepositoryProvider);
  await repository.init();
});

// All movies provider
final allMoviesProvider = FutureProvider<List<Movie>>((ref) async {
  final repository = ref.watch(movieRepositoryProvider);
  return repository.loadAll();
});

// Random stack provider (for swipe screen)
final randomStackProvider = FutureProvider<List<Movie>>((ref) async {
  final repository = ref.watch(movieRepositoryProvider);
  return repository.getRandomStack(count: 20);
});

// Favorites provider
final favoritesProvider = FutureProvider<List<Movie>>((ref) async {
  final repository = ref.watch(movieRepositoryProvider);
  return repository.getFavorites();
});

// All moods provider
final allMoodsProvider = FutureProvider<List<String>>((ref) async {
  final repository = ref.watch(movieRepositoryProvider);
  final moods = await repository.getAllMoods();
  if (moods.isEmpty) {
    return MovieRepository.defaultMoods;
  }
  return moods;
});

// All genres provider
final allGenresProvider = FutureProvider<List<String>>((ref) async {
  final repository = ref.watch(movieRepositoryProvider);
  return repository.getAllGenres();
});

// Search provider
final searchMoviesProvider = FutureProvider<List<Movie>>((ref) async {
  final query = ref.watch(searchQueryProvider);
  final selectedGenres = ref.watch(searchGenresProvider);
  final repository = ref.watch(movieRepositoryProvider);
  
  if (query.isEmpty && selectedGenres.isEmpty) {
    return repository.loadAll();
  }
  
  return repository.search(
    query,
    genres: selectedGenres.isNotEmpty ? selectedGenres : null,
  );
});

// Search query state provider
final searchQueryProvider = StateProvider<String>((ref) => '');

// Selected genres for search
final searchGenresProvider = StateProvider<List<String>>((ref) => []);

// Selected moods for mood filter
final selectedMoodsProvider = StateProvider<List<String>>((ref) => []);

// Swipe state provider
class SwipeState {
  final List<Movie> stack;
  final List<Movie> swipedMovies;
  final int currentIndex;

  SwipeState({
    required this.stack,
    required this.swipedMovies,
    required this.currentIndex,
  });

  SwipeState copyWith({
    List<Movie>? stack,
    List<Movie>? swipedMovies,
    int? currentIndex,
  }) {
    return SwipeState(
      stack: stack ?? this.stack,
      swipedMovies: swipedMovies ?? this.swipedMovies,
      currentIndex: currentIndex ?? this.currentIndex,
    );
  }
}

final swipeStateProvider = StateNotifierProvider<SwipeNotifier, SwipeState>((ref) {
  return SwipeNotifier();
});

class SwipeNotifier extends StateNotifier<SwipeState> {
  SwipeNotifier() : super(SwipeState(stack: [], swipedMovies: [], currentIndex: 0));

  void initialize(List<Movie> movies) {
    state = SwipeState(stack: movies, swipedMovies: [], currentIndex: 0);
  }

  void swipeRight() {
    if (state.currentIndex >= state.stack.length) return;
    
    final movie = state.stack[state.currentIndex];
    state = state.copyWith(
      swipedMovies: [...state.swipedMovies, movie],
      currentIndex: state.currentIndex + 1,
    );
  }

  void swipeLeft() {
    if (state.currentIndex >= state.stack.length) return;
    
    state = state.copyWith(
      currentIndex: state.currentIndex + 1,
    );
  }

  void undo() {
    if (state.currentIndex <= 0 || state.swipedMovies.isEmpty) return;

    state = state.copyWith(
      swipedMovies: state.swipedMovies.sublist(0, state.swipedMovies.length - 1),
      currentIndex: state.currentIndex - 1,
    );
  }

  bool get canUndo => state.currentIndex > 0 && state.swipedMovies.isNotEmpty;
  
  Movie? get currentMovie {
    if (state.currentIndex >= state.stack.length) return null;
    return state.stack[state.currentIndex];
  }
}
