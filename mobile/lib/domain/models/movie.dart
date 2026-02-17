import 'package:hive/hive.dart';

part 'movie.g.dart';

@HiveType(typeId: 0)
class Movie {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String title;

  @HiveField(2)
  final String? originalTitle;

  @HiveField(3)
  final int year;

  @HiveField(4)
  final String description;

  @HiveField(5)
  final List<String> genres;

  @HiveField(6)
  final List<String> moods;

  @HiveField(7)
  final double rating;

  @HiveField(8)
  final int duration;

  @HiveField(9)
  final String director;

  @HiveField(10)
  final List<String> cast;

  @HiveField(11)
  final String poster;

  @HiveField(12)
  final String? backdrop;

  @HiveField(13)
  final String language;

  @HiveField(14)
  final List<String> tags;

  @HiveField(15)
  String watchStatus;

  @HiveField(16)
  bool isFavorite;

  @HiveField(17)
  final int? tmdbId;

  @HiveField(18)
  final DateTime createdAt;

  Movie({
    required this.id,
    required this.title,
    this.originalTitle,
    required this.year,
    required this.description,
    required this.genres,
    required this.moods,
    required this.rating,
    required this.duration,
    required this.director,
    required this.cast,
    required this.poster,
    this.backdrop,
    required this.language,
    required this.tags,
    this.watchStatus = 'unwatched',
    this.isFavorite = false,
    this.tmdbId,
    required this.createdAt,
  });

  factory Movie.fromJson(Map<String, dynamic> json) {
    return Movie(
      id: json['id'] as String,
      title: json['title'] as String,
      originalTitle: json['original_title'] as String?,
      year: json['year'] as int,
      description: json['description'] as String,
      genres: (json['genres'] as List).cast<String>(),
      moods: (json['moods'] as List).cast<String>(),
      rating: (json['rating'] as num).toDouble(),
      duration: json['duration'] as int,
      director: json['director'] as String,
      cast: (json['cast'] as List).cast<String>(),
      poster: json['poster'] as String,
      backdrop: json['backdrop'] as String?,
      language: json['language'] as String,
      tags: (json['tags'] as List).cast<String>(),
      watchStatus: json['watch_status'] as String? ?? 'unwatched',
      isFavorite: json['is_favorite'] as bool? ?? false,
      tmdbId: json['tmdb_id'] as int?,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'original_title': originalTitle,
      'year': year,
      'description': description,
      'genres': genres,
      'moods': moods,
      'rating': rating,
      'duration': duration,
      'director': director,
      'cast': cast,
      'poster': poster,
      'backdrop': backdrop,
      'language': language,
      'tags': tags,
      'watch_status': watchStatus,
      'is_favorite': isFavorite,
      'tmdb_id': tmdbId,
      'created_at': createdAt.toIso8601String(),
    };
  }

  Movie copyWith({
    String? id,
    String? title,
    String? originalTitle,
    int? year,
    String? description,
    List<String>? genres,
    List<String>? moods,
    double? rating,
    int? duration,
    String? director,
    List<String>? cast,
    String? poster,
    String? backdrop,
    String? language,
    List<String>? tags,
    String? watchStatus,
    bool? isFavorite,
    int? tmdbId,
    DateTime? createdAt,
  }) {
    return Movie(
      id: id ?? this.id,
      title: title ?? this.title,
      originalTitle: originalTitle ?? this.originalTitle,
      year: year ?? this.year,
      description: description ?? this.description,
      genres: genres ?? this.genres,
      moods: moods ?? this.moods,
      rating: rating ?? this.rating,
      duration: duration ?? this.duration,
      director: director ?? this.director,
      cast: cast ?? this.cast,
      poster: poster ?? this.poster,
      backdrop: backdrop ?? this.backdrop,
      language: language ?? this.language,
      tags: tags ?? this.tags,
      watchStatus: watchStatus ?? this.watchStatus,
      isFavorite: isFavorite ?? this.isFavorite,
      tmdbId: tmdbId ?? this.tmdbId,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  String toString() => 'Movie(id: $id, title: $title, year: $year)';

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Movie && runtimeType == other.runtimeType && id == other.id;

  @override
  int get hashCode => id.hashCode;
}
