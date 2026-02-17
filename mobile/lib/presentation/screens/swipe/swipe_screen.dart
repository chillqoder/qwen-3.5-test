import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../domain/models/movie.dart';
import '../../providers/movie_provider.dart';
import '../../widgets/movie_card.dart';
import '../details/movie_details_screen.dart';

class SwipeScreen extends ConsumerStatefulWidget {
  const SwipeScreen({super.key});

  @override
  ConsumerState<SwipeScreen> createState() => _SwipeScreenState();
}

class _SwipeScreenState extends ConsumerState<SwipeScreen> {
  List<Movie> _movies = [];
  int _currentIndex = 0;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadMovies();
  }

  Future<void> _loadMovies() async {
    setState(() => _isLoading = true);
    try {
      final stack = await ref.read(randomStackProvider.future);
      setState(() {
        _movies = stack;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Ошибка загрузки: $e')),
        );
      }
    }
  }

  void _swipeRight() {
    if (_currentIndex >= _movies.length) return;
    
    final movie = _movies[_currentIndex];
    ref.read(movieRepositoryProvider).toggleFavorite(movie.id);
    setState(() => _currentIndex++);
  }

  void _swipeLeft() {
    if (_currentIndex >= _movies.length) return;
    setState(() => _currentIndex++);
  }

  void _undo() {
    if (_currentIndex <= 0) return;
    setState(() => _currentIndex--);
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_movies.isEmpty || _currentIndex >= _movies.length) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.movie_filter_outlined, size: 64, color: Colors.grey),
            const SizedBox(height: 16),
            const Text(
              'Фильмы закончились',
              style: TextStyle(fontSize: 18, color: Colors.grey),
            ),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: _loadMovies,
              child: const Text('Загрузить ещё'),
            ),
          ],
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('MovieSwipe'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () => Navigator.pushNamed(context, '/catalog'),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Stack(
                children: [
                  // Show stack of cards (up to 3)
                  ...List.generate(
                    (_movies.length - _currentIndex).clamp(0, 3),
                    (index) {
                      final actualIndex = _currentIndex + index;
                      if (actualIndex >= _movies.length) return const SizedBox.shrink();
                      
                      final movie = _movies[actualIndex];
                      final isTopCard = index == 0;
                      
                      return Positioned.fill(
                        child: Transform.scale(
                          scale: 1 - (index * 0.05),
                          child: Transform.translate(
                            offset: Offset(0, -index * 5),
                            child: isTopCard
                                ? _buildSwipeableCard(movie)
                                : MovieCard(movie: movie),
                          ),
                        ),
                      );
                    },
                  ).reversed.toList(),
                ],
              ),
            ),
          ),
          _buildControls(),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  Widget _buildSwipeableCard(Movie movie) {
    return GestureDetector(
      onHorizontalDragEnd: (details) {
        if (details.velocity.pixelsPerSecond.dx > 100) {
          _swipeRight();
        } else if (details.velocity.pixelsPerSecond.dx < -100) {
          _swipeLeft();
        }
      },
      onTap: () => _openDetails(movie),
      child: MovieCard(movie: movie),
    );
  }

  Widget _buildControls() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          // Dislike button
          _buildControlButton(
            icon: Icons.close,
            color: Colors.red,
            onPressed: _swipeLeft,
          ),
          // Undo button
          _buildControlButton(
            icon: Icons.undo,
            color: Colors.orange,
            size: 50,
            onPressed: _currentIndex > 0 ? _undo : null,
          ),
          // Like button
          _buildControlButton(
            icon: Icons.favorite,
            color: Colors.green,
            onPressed: _swipeRight,
          ),
        ],
      ),
    );
  }

  Widget _buildControlButton({
    required IconData icon,
    required Color color,
    double size = 60,
    VoidCallback? onPressed,
  }) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: color.withOpacity(0.2),
          border: Border.all(color: color, width: 2),
        ),
        child: Icon(icon, color: color, size: size * 0.5),
      ),
    );
  }

  void _openDetails(Movie movie) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => MovieDetailsScreen(movie: movie),
      ),
    );
  }
}
