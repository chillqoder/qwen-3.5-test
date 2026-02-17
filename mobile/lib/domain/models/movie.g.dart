// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'movie.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class MovieAdapter extends TypeAdapter<Movie> {
  @override
  final int typeId = 0;

  @override
  Movie read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return Movie(
      id: fields[0] as String,
      title: fields[1] as String,
      originalTitle: fields[2] as String?,
      year: fields[3] as int,
      description: fields[4] as String,
      genres: (fields[5] as List).cast<String>(),
      moods: (fields[6] as List).cast<String>(),
      rating: fields[7] as double,
      duration: fields[8] as int,
      director: fields[9] as String,
      cast: (fields[10] as List).cast<String>(),
      poster: fields[11] as String,
      backdrop: fields[12] as String?,
      language: fields[13] as String,
      tags: (fields[14] as List).cast<String>(),
      watchStatus: fields[15] as String,
      isFavorite: fields[16] as bool,
      tmdbId: fields[17] as int?,
      createdAt: fields[18] as DateTime,
    );
  }

  @override
  void write(BinaryWriter writer, Movie obj) {
    writer
      ..writeByte(19)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.title)
      ..writeByte(2)
      ..write(obj.originalTitle)
      ..writeByte(3)
      ..write(obj.year)
      ..writeByte(4)
      ..write(obj.description)
      ..writeByte(5)
      ..write(obj.genres)
      ..writeByte(6)
      ..write(obj.moods)
      ..writeByte(7)
      ..write(obj.rating)
      ..writeByte(8)
      ..write(obj.duration)
      ..writeByte(9)
      ..write(obj.director)
      ..writeByte(10)
      ..write(obj.cast)
      ..writeByte(11)
      ..write(obj.poster)
      ..writeByte(12)
      ..write(obj.backdrop)
      ..writeByte(13)
      ..write(obj.language)
      ..writeByte(14)
      ..write(obj.tags)
      ..writeByte(15)
      ..write(obj.watchStatus)
      ..writeByte(16)
      ..write(obj.isFavorite)
      ..writeByte(17)
      ..write(obj.tmdbId)
      ..writeByte(18)
      ..write(obj.createdAt);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is MovieAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
