import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:path_provider/path_provider.dart';

import 'domain/models/movie.dart';
import 'presentation/screens/home_screen.dart';
import 'presentation/screens/catalog/catalog_screen.dart';
import 'presentation/theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Set status bar style
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarBrightness: Brightness.dark,
      statusBarIconBrightness: Brightness.light,
    ),
  );

  // Initialize Hive
  final appDir = await getApplicationDocumentsDirectory();
  Hive.init(appDir.path);

  // Register Hive adapters
  Hive.registerAdapter(MovieAdapter());

  // Open Hive boxes
  await Hive.openBox<Movie>('favorites');
  await Hive.openBox('movie_metadata');

  runApp(
    const ProviderScope(
      child: MovieSwipeApp(),
    ),
  );
}

class MovieSwipeApp extends StatelessWidget {
  const MovieSwipeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MovieSwipe',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const HomeScreen(),
      routes: {
        '/catalog': (context) => const CatalogScreen(),
      },
    );
  }
}
