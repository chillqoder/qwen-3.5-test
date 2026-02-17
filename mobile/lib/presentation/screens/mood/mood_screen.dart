import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../domain/models/movie.dart';
import '../../providers/movie_provider.dart';
import '../../theme/app_theme.dart';
import '../details/movie_details_screen.dart';

class MoodScreen extends ConsumerStatefulWidget {
  const MoodScreen({super.key});

  @override
  ConsumerState<MoodScreen> createState() => _MoodScreenState();
}

class _MoodScreenState extends ConsumerState<MoodScreen> {
  List<String> _selectedMoods = [];
  Movie? _selectedMovie;
  bool _isLoading = false;

  // Русские переводы для всех настроений из JSON
  static const Map<String, String> _moodTranslations = {
    'adventurous': 'Приключенческое',
    'contemplative': 'Созерцательное',
    'dark': 'Мрачное',
    'disturbing': 'Тревожное',
    'emotional': 'Эмоциональное',
    'epic': 'Эпическое',
    'exciting': 'Захватывающее',
    'fun': 'Весёлое',
    'funny': 'Смешное',
    'heartwarming': 'Душевное',
    'inspiring': 'Вдохновляющее',
    'intense': 'Интенсивное',
    'irreverent': 'Бунтарское',
    'magical': 'Волшебное',
    'mind-bending': 'Ошеломляющее',
    'mysterious': 'Таинственное',
    'nostalgic': 'Ностальгическое',
    'powerful': 'Мощное',
    'psychological': 'Психологическое',
    'reflective': 'Задумчивое',
    'romantic': 'Романтичное',
    'satirical': 'Сатирическое',
    'scary': 'Пугающее',
    'stylish': 'Стильное',
    'tense': 'Напряжённое',
    'thought-provoking': 'Заставляющее задуматься',
    'thrilling': 'Захватывающий триллер',
    'unsettling': 'Беспокойное',
    'visual': 'Визуальное',
    'wonderful': 'Чудесное',
  };

  static String translateMood(String mood) {
    return _moodTranslations[mood] ?? mood;
  }

  static List<String> getSortedMoods(List<String> moods) {
    return moods..sort((a, b) => translateMood(a).compareTo(translateMood(b)));
  }

  @override
  Widget build(BuildContext context) {
    final allMoods = ref.watch(allMoodsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('По настроению'),
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(16.0),
            color: AppTheme.surface,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Выберите настроение',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 4),
                Text(
                  'Мы подберём подходящий фильм',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
                if (_selectedMoods.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _selectedMoods.map((mood) {
                      return Chip(
                        label: Text(translateMood(mood)),
                        deleteIcon: const Icon(Icons.close, size: 18),
                        onDeleted: () => _toggleMood(mood),
                        backgroundColor: AppTheme.accent.withOpacity(0.2),
                        labelStyle: const TextStyle(color: AppTheme.accent),
                      );
                    }).toList(),
                  ),
                ],
              ],
            ),
          ),
          // Mood chips grid
          Expanded(
            child: allMoods.when(
              data: (moods) {
                final sortedMoods = getSortedMoods(List.from(moods));
                return SingleChildScrollView(
                  padding: const EdgeInsets.all(16.0),
                  child: Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: sortedMoods.map((mood) {
                      final isSelected = _selectedMoods.contains(mood);
                      return FilterChip(
                        label: Text(
                          translateMood(mood),
                          style: const TextStyle(fontSize: 14),
                        ),
                        selected: isSelected,
                        onSelected: (selected) => _toggleMood(mood),
                        selectedColor: AppTheme.accent.withOpacity(0.3),
                        checkmarkColor: AppTheme.accent,
                        backgroundColor: AppTheme.surface,
                        labelStyle: TextStyle(
                          color: isSelected ? AppTheme.accent : AppTheme.primaryText,
                          fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                        ),
                      );
                    }).toList(),
                  ),
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
          // Select button
          Container(
            padding: const EdgeInsets.all(16.0),
            decoration: BoxDecoration(
              color: AppTheme.surface,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.2),
                  blurRadius: 8,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: SafeArea(
              child: ElevatedButton(
                onPressed: _selectedMoods.isEmpty ? null : _selectMovie,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: _isLoading
                    ? const SizedBox(
                        height: 24,
                        width: 24,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.auto_awesome, size: 20),
                          const SizedBox(width: 8),
                          Text(
                            'Подобрать фильм',
                            style: const TextStyle(fontSize: 16),
                          ),
                        ],
                      ),
              ),
            ),
          ),
        ],
      ),
      // Bottom sheet for selected movie
      bottomSheet: _selectedMovie != null
          ? _buildSelectedMovieSheet(context, _selectedMovie!)
          : null,
    );
  }

  void _toggleMood(String mood) {
    setState(() {
      if (_selectedMoods.contains(mood)) {
        _selectedMoods.remove(mood);
      } else {
        _selectedMoods.add(mood);
      }
    });
  }

  Widget _buildSelectedMovieSheet(BuildContext context, Movie movie) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 16,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Handle bar
          Padding(
            padding: const EdgeInsets.only(top: 12.0),
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppTheme.secondaryText.withOpacity(0.3),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: AppTheme.accent.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(
                            Icons.check_circle,
                            size: 16,
                            color: AppTheme.accent,
                          ),
                          const SizedBox(width: 6),
                          const Text(
                            'Ваш фильм',
                            style: TextStyle(
                              color: AppTheme.accent,
                              fontWeight: FontWeight.w600,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const Spacer(),
                    IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () => setState(() => _selectedMovie = null),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                // Movie info
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Poster
                    ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: movie.poster.startsWith('http')
                          ? Image.network(
                              movie.poster,
                              width: 100,
                              height: 150,
                              fit: BoxFit.cover,
                              errorBuilder: (_, __, ___) => Container(
                                width: 100,
                                height: 150,
                                color: AppTheme.background,
                                child: const Icon(
                                  Icons.movie,
                                  size: 40,
                                  color: Colors.grey,
                                ),
                              ),
                            )
                          : Container(
                              width: 100,
                              height: 150,
                              color: AppTheme.background,
                              child: const Icon(
                                Icons.movie,
                                size: 40,
                                color: Colors.grey,
                              ),
                            ),
                    ),
                    const SizedBox(width: 16),
                    // Details
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            movie.title,
                            style: Theme.of(context).textTheme.titleLarge,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              _buildInfoChip(
                                Icons.calendar_today,
                                movie.year.toString(),
                              ),
                              const SizedBox(width: 8),
                              _buildInfoChip(
                                Icons.timer,
                                '${movie.duration} мин',
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              const Icon(
                                Icons.star,
                                size: 20,
                                color: Colors.amber,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                movie.rating.toStringAsFixed(1),
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Text(
                            movie.genres.take(3).map(_translateGenre).join(', '),
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                // Description
                Text(
                  movie.description,
                  style: Theme.of(context).textTheme.bodyMedium,
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 16),
                // Actions
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () async {
                          // Запрашиваем новый фильм
                          setState(() {
                            _selectedMovie = null;
                            _isLoading = true;
                          });
                          
                          try {
                            final repository = ref.read(movieRepositoryProvider);
                            final movie = await repository.getRandomByMood(_selectedMoods);
                            
                            if (mounted) {
                              setState(() {
                                _selectedMovie = movie;
                                _isLoading = false;
                              });
                              
                              if (movie == null) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Нет других фильмов с таким настроением.'),
                                    backgroundColor: Colors.orange,
                                  ),
                                );
                              }
                            }
                          } catch (e) {
                            if (mounted) {
                              setState(() => _isLoading = false);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Ошибка: $e')),
                              );
                            }
                          }
                        },
                        icon: const Icon(Icons.refresh),
                        label: const Text('Ещё вариант'),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () => _openDetails(movie),
                        icon: const Icon(Icons.info_outline),
                        label: const Text('Подробнее'),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoChip(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AppTheme.background,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: AppTheme.secondaryText),
          const SizedBox(width: 4),
          Text(
            label,
            style: const TextStyle(fontSize: 12, color: AppTheme.secondaryText),
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

  Future<void> _selectMovie() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final repository = ref.read(movieRepositoryProvider);
      final movie = await repository.getRandomByMood(_selectedMoods);

      if (!mounted) return;

      setState(() {
        _selectedMovie = movie;
        _isLoading = false;
      });

      if (movie == null && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Нет фильмов с выбранным настроением. Попробуйте другие варианты.'),
            backgroundColor: Colors.orange,
          ),
        );
      }
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Ошибка: $e')),
      );
    }
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
