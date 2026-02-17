import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../providers/movie_provider.dart';
import '../../widgets/movie_grid_item.dart';
import '../details/movie_details_screen.dart';

class FavoritesScreen extends ConsumerWidget {
  const FavoritesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final favoritesAsync = ref.watch(favoritesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Избранное'),
        actions: [
          if (favoritesAsync.value?.isNotEmpty ?? false)
            IconButton(
              icon: const Icon(Icons.grid_view),
              onPressed: () => _toggleView(context),
            ),
        ],
      ),
      body: favoritesAsync.when(
        data: (movies) {
          if (movies.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.favorite_border,
                    size: 64,
                    color: Colors.grey,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Нет избранных фильмов',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Свайпните вправо на фильме,\nчтобы добавить его в избранное',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.bodyMedium,
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
            itemCount: movies.length,
            itemBuilder: (context, index) {
              final movie = movies[index];
              return MovieGridItem(
                movie: movie,
                onTap: () => _openDetails(context, movie),
                onFavoriteTap: () => _toggleFavorite(ref, movie.id),
                isFavorite: true,
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
    );
  }

  void _openDetails(BuildContext context, dynamic movie) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => MovieDetailsScreen(movie: movie),
      ),
    );
  }

  void _toggleFavorite(WidgetRef ref, String id) {
    ref.read(movieRepositoryProvider).toggleFavorite(id);
  }

  void _toggleView(BuildContext context) {
    // Could switch between grid and list view
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Переключение вида')),
    );
  }
}
