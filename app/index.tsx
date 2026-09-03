// app/index.tsx
// Main dashboard screen: top half = live video, bottom half = AI alert feed.

import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { VideoPlayer } from '../src/components/VideoPlayer';
import { AlertFeed } from '../src/components/AlertFeed';
import { useAlertPoller } from '../src/hooks/useAlertPoller';
import { COLORS, SPACING } from '../src/theme';

export default function DashboardScreen() {
  const router = useRouter();

  // Start polling the Python backend for new alerts
  useAlertPoller();

  const openSettings = useCallback(() => {
    router.push('/settings');
  }, [router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Top Bar ───────────────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>System Online</Text>
        </View>
        <TouchableOpacity onPress={openSettings} style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={22} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* ── Video Player (top 45%) ─────────────────────────────────── */}
      <View style={styles.videoSection}>
        <VideoPlayer />
      </View>

      {/* ── Divider ───────────────────────────────────────────────────── */}
      <View style={styles.divider} />

      {/* ── Alert Feed (bottom 55%) ───────────────────────────────── */}
      <View style={styles.feedSection}>
        <AlertFeed />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  statusText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  settingsButton: {
    padding: 6,
  },
  videoSection: {
    height: '42%',
    marginHorizontal: SPACING.md,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
    marginHorizontal: SPACING.md,
  },
  feedSection: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
});
