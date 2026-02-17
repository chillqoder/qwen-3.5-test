import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

import '../../../domain/models/movie.dart';
import '../theme/app_theme.dart';

class MovieCard extends StatelessWidget {
  final Movie movie;

  const MovieCard({super.key, required this.movie});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 8,
      shadowColor: Colors.black.withOpacity(0.4),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Poster
          Expanded(
            flex: 3,
            child: ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
              child: _buildPoster(),
            ),
          ),
          // Info
          Expanded(
            flex: 2,
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title and rating
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Text(
                          movie.title,
                          style: Theme.of(context).textTheme.titleLarge,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: 8),
                      _buildRatingChip(),
                    ],
                  ),
                  const SizedBox(height: 8),
                  // Year, duration, genres
                  Text(
                    _buildMetaInfo(),
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 12),
                  // Description
                  Expanded(
                    child: Text(
                      movie.description,
                      style: Theme.of(context).textTheme.bodyMedium,
                      maxLines: 4,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPoster() {
    if (movie.poster.startsWith('http')) {
      return CachedNetworkImage(
        imageUrl: movie.poster,
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
    } else {
      // Local image
      return Image.asset(
        movie.poster,
        fit: BoxFit.cover,
        width: double.infinity,
        errorBuilder: (context, error, stackTrace) {
          return Container(
            color: AppTheme.surface,
            child: const Icon(Icons.movie, size: 64, color: Colors.grey),
          );
        },
      );
    }
  }

  Widget _buildRatingChip() {
    final rating = movie.rating;
    Color chipColor;

    if (rating >= 7.5) {
      chipColor = Colors.green;
    } else if (rating >= 5) {
      chipColor = Colors.orange;
    } else {
      chipColor = Colors.red;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: chipColor,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.star, size: 14, color: Colors.white),
          const SizedBox(width: 4),
          Text(
            rating.toStringAsFixed(1),
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  String _buildMetaInfo() {
    final parts = [
      movie.year.toString(),
      '${movie.duration} мин',
    ];
    if (movie.genres.isNotEmpty) {
      parts.add(movie.genres.take(2).join(', '));
    }
    return parts.join(' • ');
  }
}
