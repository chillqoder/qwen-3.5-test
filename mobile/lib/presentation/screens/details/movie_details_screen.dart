import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';

import '../../../domain/models/movie.dart';
import '../../providers/movie_provider.dart';
import '../../theme/app_theme.dart';

class MovieDetailsScreen extends ConsumerStatefulWidget {
  final Movie movie;

  const MovieDetailsScreen({super.key, required this.movie});

  @override
  ConsumerState<MovieDetailsScreen> createState() => _MovieDetailsScreenState();
}

class _MovieDetailsScreenState extends ConsumerState<MovieDetailsScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // App bar with backdrop
          SliverAppBar(
            expandedHeight: 250,
            pinned: true,
            leading: IconButton(
              icon: Container(
                padding: const EdgeInsets.all(8),
                decoration: const BoxDecoration(
                  color: Colors.black54,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.arrow_back, color: Colors.white),
              ),
              onPressed: () => Navigator.pop(context),
            ),
            actions: [
              IconButton(
                icon: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: const BoxDecoration(
                    color: Colors.black54,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    widget.movie.isFavorite ? Icons.favorite : Icons.favorite_border,
                    color: widget.movie.isFavorite ? Colors.red : Colors.white,
                  ),
                ),
                onPressed: () => ref.read(movieRepositoryProvider).toggleFavorite(widget.movie.id),
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: _buildBackdrop(),
            ),
          ),
          // Content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title and rating
                  Text(
                    widget.movie.title,
                    style: Theme.of(context).textTheme.displaySmall,
                  ),
                  if (widget.movie.originalTitle != null &&
                      widget.movie.originalTitle != widget.movie.title) ...[
                    const SizedBox(height: 4),
                    Text(
                      widget.movie.originalTitle!,
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ],
                  const SizedBox(height: 12),
                  // Meta info
                  _buildMetaInfo(),
                  const SizedBox(height: 16),
                  // Rating chip
                  _buildRatingChip(),
                  const SizedBox(height: 20),
                  // Description
                  Text(
                    'Описание',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    widget.movie.description,
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                  const SizedBox(height: 20),
                  // Genres
                  if (widget.movie.genres.isNotEmpty) ...[
                    Text(
                      'Жанры',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: widget.movie.genres.map((genre) {
                        return Chip(
                          label: Text(_translateGenre(genre)),
                          backgroundColor: AppTheme.surface,
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 20),
                  ],
                  // Moods
                  if (widget.movie.moods.isNotEmpty) ...[
                    Text(
                      'Настроение',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: widget.movie.moods.map((mood) {
                        return Chip(
                          label: Text(_translateMood(mood)),
                          backgroundColor: AppTheme.accent.withOpacity(0.2),
                          labelStyle: const TextStyle(color: AppTheme.accent),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 20),
                  ],
                  // Director
                  Text(
                    'Режиссёр',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    widget.movie.director,
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                  const SizedBox(height: 20),
                  // Cast
                  if (widget.movie.cast.isNotEmpty) ...[
                    Text(
                      'В ролях',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 8),
                    ...widget.movie.cast.map((actor) => Padding(
                      padding: const EdgeInsets.only(bottom: 4),
                      child: Text(
                        '• $actor',
                        style: Theme.of(context).textTheme.bodyLarge,
                      ),
                    )),
                  ],
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBackdrop() {
    if (widget.movie.backdrop != null && widget.movie.backdrop!.isNotEmpty) {
      if (widget.movie.backdrop!.startsWith('http')) {
        return CachedNetworkImage(
          imageUrl: widget.movie.backdrop!,
          fit: BoxFit.cover,
          width: double.infinity,
          placeholder: (context, url) => Container(
            color: AppTheme.surface,
            child: const Center(child: CircularProgressIndicator()),
          ),
          errorWidget: (context, url, error) => Container(
            color: AppTheme.surface,
            child: const Icon(Icons.movie, size: 64, color: Colors.grey),
          ),
        );
      }
    }
    // Fallback to poster
    if (widget.movie.poster.startsWith('http')) {
      return CachedNetworkImage(
        imageUrl: widget.movie.poster,
        fit: BoxFit.cover,
        width: double.infinity,
        placeholder: (context, url) => Container(
          color: AppTheme.surface,
          child: const Center(child: CircularProgressIndicator()),
        ),
        errorWidget: (context, url, error) => Container(
          color: AppTheme.surface,
          child: const Icon(Icons.movie, size: 64, color: Colors.grey),
        ),
      );
    }
    return Container(
      color: AppTheme.surface,
      child: const Icon(Icons.movie, size: 64, color: Colors.grey),
    );
  }

  Widget _buildMetaInfo() {
    return Row(
      children: [
        Text(
          widget.movie.year.toString(),
          style: Theme.of(context).textTheme.bodyMedium,
        ),
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 8),
          child: Text('•', style: TextStyle(color: AppTheme.secondaryText)),
        ),
        Text(
          '${widget.movie.duration} мин',
          style: Theme.of(context).textTheme.bodyMedium,
        ),
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 8),
          child: Text('•', style: TextStyle(color: AppTheme.secondaryText)),
        ),
        Text(
          _translateStatus(widget.movie.watchStatus),
          style: Theme.of(context).textTheme.bodyMedium,
        ),
      ],
    );
  }

  Widget _buildRatingChip() {
    final rating = widget.movie.rating;
    Color chipColor;

    if (rating >= 7.5) {
      chipColor = Colors.green;
    } else if (rating >= 5) {
      chipColor = Colors.orange;
    } else {
      chipColor = Colors.red;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: chipColor,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.star, size: 18, color: Colors.white),
          const SizedBox(width: 6),
          Text(
            rating.toStringAsFixed(1),
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
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

  String _translateMood(String mood) {
    const translations = {
      'romantic': 'Романтичное',
      'funny': 'Смешное',
      'thrilling': 'Напряжённое',
      'calm': 'Спокойное',
      'sad': 'Грустное',
      'nostalgic': 'Ностальгическое',
      'adventurous': 'Приключенческое',
      'intellectual': 'Интеллектуальное',
      'scifi': 'Фантастика',
      'horror': 'Ужасы',
      'tense': 'Напряжённое',
      'dark': 'Мрачное',
      'intense': 'Интенсивное',
      'dramatic': 'Драматичное',
      'inspiring': 'Вдохновляющее',
      'mysterious': 'Таинственное',
      'action': 'Экшен',
      'relaxing': 'Расслабляющее',
    };
    return translations[mood] ?? mood;
  }

  String _translateStatus(String status) {
    const translations = {
      'unwatched': 'Не просмотрено',
      'watched': 'Просмотрено',
      'watching': 'Смотрю',
      'planned': 'Запланировано',
    };
    return translations[status] ?? status;
  }
}
