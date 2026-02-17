import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../theme/app_theme.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Профиль'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Profile header
          _buildProfileHeader(context),
          const SizedBox(height: 24),
          // Settings section
          _buildSectionTitle('Настройки'),
          _buildSettingsTile(
            icon: Icons.palette,
            title: 'Тема',
            subtitle: 'Тёмная',
            onTap: () => _showThemeDialog(context),
          ),
          _buildSettingsTile(
            icon: Icons.language,
            title: 'Язык',
            subtitle: 'Русский',
            onTap: () => _showLanguageDialog(context),
          ),
          const SizedBox(height: 16),
          // Data section
          _buildSectionTitle('Данные'),
          _buildSettingsTile(
            icon: Icons.storage,
            title: 'Хранилище',
            subtitle: 'Управление данными',
            onTap: () {},
          ),
          _buildSettingsTile(
            icon: Icons.download,
            title: 'Экспорт',
            subtitle: 'Сохранить избранное',
            onTap: () {},
          ),
          const SizedBox(height: 16),
          // About section
          _buildSectionTitle('О приложении'),
          _buildSettingsTile(
            icon: Icons.info_outline,
            title: 'Версия',
            subtitle: '1.0.0',
            onTap: () => _showAboutDialog(context),
          ),
          _buildSettingsTile(
            icon: Icons.description,
            title: 'Лицензии',
            subtitle: 'Открытые лицензии',
            onTap: () => _showLicensePage(context),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileHeader(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Row(
          children: [
            CircleAvatar(
              radius: 35,
              backgroundColor: AppTheme.accent.withOpacity(0.2),
              child: const Icon(
                Icons.person,
                size: 35,
                color: AppTheme.accent,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Гость',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Локальный профиль',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: AppTheme.secondaryText,
        ),
      ),
    );
  }

  Widget _buildSettingsTile({
    required IconData icon,
    required String title,
    required String subtitle,
    VoidCallback? onTap,
  }) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Icon(icon, color: AppTheme.accent),
        title: Text(title),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }

  void _showThemeDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Тема'),
        content: const Text('В данный момент доступна только тёмная тема.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  void _showLanguageDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Язык'),
        content: const Text('Интерфейс приложения уже на русском языке.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  void _showAboutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('О приложении'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('MovieSwipe v1.0.0'),
            const SizedBox(height: 12),
            Text(
              'Приложение для быстрого выбора фильмов по настроению.',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Закрыть'),
          ),
        ],
      ),
    );
  }

  void _showLicensePage(BuildContext context) {
    showLicensePage(
      context: context,
      applicationName: 'MovieSwipe',
      applicationVersion: '1.0.0',
      applicationLegalese: '© 2025 MovieSwipe',
    );
  }
}
