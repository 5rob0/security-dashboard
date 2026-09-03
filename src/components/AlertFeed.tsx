// src/components/AlertFeed.tsx
// Scrollable AI motion alert feed — newest alerts appear at the top.

import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  type ListRenderItem,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext, type Alert } from '../context/AppContext';
import { COLORS, FONTS } from '../theme';

// ─── Single alert card ────────────────────────────────────────────────────────

const SEVERITY_CONFIG = {
  high: {
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    icon: 'alert-circle' as const,
    label: 'HIGH',
  },
  medium: {
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    icon: 'warning' as const,
    label: 'MED',
  },
  low: {
    color: '#6b7280',
    bg: 'rgba(107,114,128,0.10)',
    icon: 'information-circle' as const,
    label: 'LOW',
  },
} as const;

function AlertCard({ alert }: { alert: Alert }) {
  const cfg = SEVERITY_CONFIG[alert.severity];
  return (
    <View style={[styles.card, { backgroundColor: cfg.bg, borderLeftColor: cfg.color }]}>
      <View style={styles.cardLeft}>
        <Ionicons name={cfg.icon} size={18} color={cfg.color} />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardDescription}>{alert.description}</Text>
        <Text style={styles.cardTimestamp}>{alert.timestamp}</Text>
      </View>
      <View style={[styles.severityBadge, { borderColor: cfg.color }]}>
        <Text style={[styles.severityText, { color: cfg.color }]}>{cfg.label}</Text>
      </View>
    </View>
  );
}

// ─── Feed ─────────────────────────────────────────────────────────────────────

export function AlertFeed() {
  const { alerts, clearAlerts } = useAppContext();

  const renderItem: ListRenderItem<Alert> = useCallback(
    ({ item }) => <AlertCard alert={item} />,
    []
  );

  const keyExtractor = useCallback((item: Alert) => item.id, []);

  const ListHeader = (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Ionicons name="pulse" size={16} color={COLORS.accent} />
        <Text style={styles.headerTitle}>AI Alert Feed</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{alerts.length}</Text>
        </View>
      </View>
      {alerts.length > 0 && (
        <TouchableOpacity onPress={clearAlerts} style={styles.clearButton}>
          <Text style={styles.clearText}>Clear all</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const ListEmpty = (
    <View style={styles.empty}>
      <Ionicons name="checkmark-circle" size={40} color={COLORS.textMuted} />
      <Text style={styles.emptyTitle}>All Clear</Text>
      <Text style={styles.emptySubtitle}>No motion events detected yet.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={alerts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.semiBold,
    fontSize: 15,
  },
  countBadge: {
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countText: {
    color: '#fff',
    fontFamily: FONTS.semiBold,
    fontSize: 11,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: COLORS.surface,
  },
  clearText: {
    color: COLORS.textMuted,
    fontFamily: FONTS.regular,
    fontSize: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderLeftWidth: 3,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  cardLeft: {
    width: 22,
    alignItems: 'center',
  },
  cardBody: {
    flex: 1,
    gap: 3,
  },
  cardDescription: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  cardTimestamp: {
    color: COLORS.textMuted,
    fontFamily: FONTS.regular,
    fontSize: 11,
  },
  severityBadge: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  severityText: {
    fontSize: 9,
    fontFamily: FONTS.semiBold,
    letterSpacing: 0.8,
  },
  separator: {
    height: 8,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.semiBold,
    fontSize: 16,
  },
  emptySubtitle: {
    color: COLORS.textMuted,
    fontFamily: FONTS.regular,
    fontSize: 13,
  },
});
