import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../domain/models/movie.dart';
import '../../providers/movie_provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/movie_grid_item.dart';
import '../details/movie_details_screen.dart';

class CatalogScreen extends ConsumerStatefulWidget {
  const CatalogScreen({super.key});

  @override
  ConsumerState<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends ConsumerState<CatalogScreen> {
  final TextEditingController _searchController = TextEditingController();
  bool _showFilters = false;
  List<String> _selectedGenres = [];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final allMoviesAsync = ref.watch(allMoviesProvider);
    final searchQuery = ref.watch(searchQueryProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Каталог'),
        actions: [
          IconButton(
            icon: Icon(_showFilters ? Icons.filter_alt : Icons.filter_list),
            onPressed: () => setState(() => _showFilters = !_showFilters),
          ),
        ],
      ),
      body: Column(
        children: [
          // Search bar
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Поиск фильмов...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          ref.read(searchQueryProvider.notifier).state = '';
                        },
                      )
                    : null,
              ),
              onChanged: (value) {
                ref.read(searchQueryProvider.notifier).state = value;
              },
            ),
          ),
          // Filters
          if (_showFilters) _buildFilters(),
          // Results
          Expanded(
            child: allMoviesAsync.when(
              data: (movies) {
                final filtered = _filterMovies(movies, searchQuery);
                if (filtered.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.movie_filter,
                          size: 64,
                          color: Colors.grey,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Ничего не найдено',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                      ],
                    ),
                  );
                }
                return GridView.builder(
                  padding: const EdgeInsets.all(12),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 0.65,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                  ),
                  itemCount: filtered.length,
                  itemBuilder: (context, index) {
                    final movie = filtered[index];
                    return MovieGridItem(
                      movie: movie,
                      onTap: () => _openDetails(movie),
                      onFavoriteTap: () => _toggleFavorite(movie.id),
                      isFavorite: movie.isFavorite,
                    );
                  },
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (error, stack) => Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.error_outline, size: 48, color: Colors.red),
                    const SizedBox(height: 16),
                    Text('Ошибка: $error'),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilters() {
    final allGenres = ref.watch(allGenresProvider);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Жанры:',
            style: Theme.of(context).textTheme.titleSmall,
          ),
          const SizedBox(height: 8),
          allGenres.when(
            data: (genres) => Wrap(
              spacing: 8,
              runSpacing: 8,
              children: genres.map((genre) {
                final isSelected = _selectedGenres.contains(genre);
                return FilterChip(
                  label: Text(_translateGenre(genre)),
                  selected: isSelected,
                  onSelected: (selected) {
                    setState(() {
                      if (selected) {
                        _selectedGenres.add(genre);
                      } else {
                        _selectedGenres.remove(genre);
                      }
                    });
                  },
                  selectedColor: AppTheme.accent.withOpacity(0.3),
                  checkmarkColor: AppTheme.accent,
                );
              }).toList(),
            ),
            loading: () => const CircularProgressIndicator(),
            error: (error, stack) => Text('Ошибка: $error'),
          ),
          if (_selectedGenres.isNotEmpty) ...[
            const SizedBox(height: 12),
            Row(
              children: [
                Text(
                  'Выбрано: ${_selectedGenres.length}',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                const Spacer(),
                TextButton(
                  onPressed: () => setState(() => _selectedGenres = []),
                  child: const Text('Сбросить'),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  List<Movie> _filterMovies(List<Movie> movies, String query) {
    var filtered = movies;

    // Filter by search query
    if (query.isNotEmpty) {
      final lowerQuery = query.toLowerCase();
      filtered = filtered.where((movie) {
        return movie.title.toLowerCase().contains(lowerQuery) ||
            (movie.originalTitle?.toLowerCase().contains(lowerQuery) ?? false) ||
            movie.director.toLowerCase().contains(lowerQuery) ||
            movie.cast.any((actor) => actor.toLowerCase().contains(lowerQuery));
      }).toList();
    }

    // Filter by selected genres
    if (_selectedGenres.isNotEmpty) {
      filtered = filtered.where((movie) {
        return _selectedGenres.any((genre) => 
          movie.genres.map((g) => g.toLowerCase()).contains(genre.toLowerCase())
        );
      }).toList();
    }

    return filtered;
  }

  String _translateGenre(String genre) {
    const translations = {
      'drama': 'Драма',
      'comedy': 'Комедия',
      'action': 'Боевик',
      'thriller': 'Триллер',
      'horror': 'Ужасы',
      'romance': 'Романтика',
      'scifi': 'Фантастика',
      'fantasy': 'Фэнтези',
      'adventure': 'Приключения',
      'crime': 'Криминал',
      'mystery': 'Детектив',
      'history': 'История',
      'biography': 'Биография',
      'animation': 'Анимация',
      'family': 'Семейный',
      'war': 'Военный',
      'western': 'Вестерн',
      'documentary': 'Документальный',
      'musical': 'Мюзикл',
    };
    return translations[genre.toLowerCase()] ?? genre;
  }

  void _openDetails(Movie movie) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => MovieDetailsScreen(movie: movie),
      ),
    );
  }

  void _toggleFavorite(String id) {
    ref.read(movieRepositoryProvider).toggleFavorite(id);
  }
}
