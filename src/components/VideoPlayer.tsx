// src/components/VideoPlayer.tsx
// Responsive live-stream video player using expo-av.
// Reads streamUrl from global context — swap it in Settings, this updates instantly.

import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Video, ResizeMode, type AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { COLORS, FONTS } from '../theme';

export function VideoPlayer() {
  const { streamUrl } = useAppContext();
  const videoRef = useRef<Video>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleLoad = useCallback((_status: AVPlaybackStatus) => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    videoRef.current?.replayAsync();
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return (
    <View style={styles.container}>
      {/* Live badge */}
      <View style={styles.liveBadge}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>LIVE</Text>
      </View>

      {/* Mute toggle */}
      <TouchableOpacity style={styles.muteButton} onPress={toggleMute}>
        <Ionicons
          name={isMuted ? 'volume-mute' : 'volume-high'}
          size={20}
          color={COLORS.textPrimary}
        />
      </TouchableOpacity>

      {/* Video */}
      {!hasError ? (
        <Video
          ref={videoRef}
          style={StyleSheet.absoluteFill}
          source={{ uri: streamUrl }}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted={isMuted}
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : (
        <View style={styles.errorOverlay}>
          <Ionicons name="videocam-off" size={48} color={COLORS.textMuted} />
          <Text style={styles.errorTitle}>Stream Unavailable</Text>
          <Text style={styles.errorSubtitle}>{streamUrl}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading spinner */}
      {isLoading && !hasError && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.loadingText}>Connecting to stream…</Text>
        </View>
      )}

      {/* Gradient-style bottom label */}
      <View style={styles.bottomBar}>
        <Ionicons name="shield-checkmark" size={14} color={COLORS.accent} />
        <Text style={styles.bottomLabel} numberOfLines={1}>
          {streamUrl}
        </Text>
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  liveBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    zIndex: 10,
    gap: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  liveText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  muteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.65)',
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    gap: 12,
  },
  loadingText: {
    color: COLORS.textMuted,
    fontFamily: FONTS.regular,
    fontSize: 13,
  },
  errorOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 24,
  },
  errorTitle: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    marginTop: 8,
  },
  errorSubtitle: {
    color: COLORS.textMuted,
    fontFamily: FONTS.regular,
    fontSize: 11,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontFamily: FONTS.semiBold,
    fontSize: 14,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  bottomLabel: {
    color: COLORS.textMuted,
    fontFamily: FONTS.regular,
    fontSize: 10,
    flex: 1,
  },
});
