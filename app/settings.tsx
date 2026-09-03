// app/settings.tsx
// Settings modal — update Video Stream URL and AI Backend URL.
// Changes propagate instantly via context — no restart needed.

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../src/context/AppContext';
import { COLORS, SPACING, RADIUS } from '../src/theme';

// ─── Reusable Input Section ───────────────────────────────────────────────────

interface InputSectionProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  hint: string;
}

function InputSection({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  hint,
}: InputSectionProps) {
  return (
    <View style={inputStyles.section}>
      <View style={inputStyles.labelRow}>
        <Ionicons name={icon} size={15} color={COLORS.accent} />
        <Text style={inputStyles.label}>{label}</Text>
      </View>
      <TextInput
        style={inputStyles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        selectTextOnFocus
      />
      <Text style={inputStyles.hint}>{hint}</Text>
    </View>
  );
}

const inputStyles = StyleSheet.create({
  section: { gap: 8 },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.surfaceElevated,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  hint: {
    color: COLORS.textMuted,
    fontSize: 11,
    lineHeight: 16,
  },
});

// ─── Settings Screen ──────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const router = useRouter();
  const { streamUrl, backendUrl, setStreamUrl, setBackendUrl } = useAppContext();

  // Local state — only commit on Save
  const [localStreamUrl, setLocalStreamUrl] = useState(streamUrl);
  const [localBackendUrl, setLocalBackendUrl] = useState(backendUrl);

  const handleSave = useCallback(() => {
    if (!localStreamUrl.trim() || !localBackendUrl.trim()) {
      Alert.alert('Validation Error', 'Both URL fields are required.');
      return;
    }
    setStreamUrl(localStreamUrl);
    setBackendUrl(localBackendUrl);
    router.back();
  }, [localStreamUrl, localBackendUrl, setStreamUrl, setBackendUrl, router]);

  const handleReset = useCallback(() => {
    Alert.alert(
      'Reset to Defaults',
      'This will restore the original local IP addresses.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setLocalStreamUrl('http://192.168.1.100:8080/video_feed');
            setLocalBackendUrl('http://192.168.1.100:5000');
          },
        },
      ]
    );
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Info Banner ──────────────────────────────────────────── */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={18} color={COLORS.accent} />
          <Text style={styles.infoText}>
            Swap your local IP for an{' '}
            <Text style={styles.infoHighlight}>ngrok</Text> or{' '}
            <Text style={styles.infoHighlight}>Cloudflare</Text> tunnel URL to
            access your camera from anywhere in the world.
          </Text>
        </View>

        {/* ── URL Inputs ───────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Network Configuration</Text>

          <InputSection
            label="Video Stream URL"
            icon="videocam"
            value={localStreamUrl}
            onChangeText={setLocalStreamUrl}
            placeholder="http://192.168.1.x:8080/video_feed"
            hint="The MJPEG or MP4 stream endpoint from your camera server. Replace with your ngrok URL when accessing remotely."
          />

          <View style={styles.ruleDivider} />

          <InputSection
            label="AI Backend URL"
            icon="server"
            value={localBackendUrl}
            onChangeText={setLocalBackendUrl}
            placeholder="http://192.168.1.x:5000"
            hint="Base URL of your Python Gemini alert server. The app will poll {url}/alerts every 5 seconds."
          />
        </View>

        {/* ── Quick-fill Buttons ──────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Shortcuts</Text>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => {
              setLocalStreamUrl('https://YOUR-TUNNEL.ngrok.io/video_feed');
              setLocalBackendUrl('https://YOUR-TUNNEL.ngrok.io');
            }}
          >
            <Ionicons name="globe-outline" size={16} color={COLORS.accent} />
            <Text style={styles.quickButtonText}>Fill ngrok template</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => {
              setLocalStreamUrl('https://YOUR-SUBDOMAIN.trycloudflare.com/video_feed');
              setLocalBackendUrl('https://YOUR-SUBDOMAIN.trycloudflare.com');
            }}
          >
            <Ionicons name="cloud-outline" size={16} color={COLORS.accent} />
            <Text style={styles.quickButtonText}>Fill Cloudflare template</Text>
          </TouchableOpacity>
        </View>

        {/* ── Actions ──────────────────────────────────────────────── */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="checkmark-circle" size={18} color="#fff" />
          <Text style={styles.saveText}>Save & Apply</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetText}>Reset to defaults</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  content: {
    padding: SPACING.md,
    gap: 16,
    paddingBottom: 40,
  },
  infoBanner: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'rgba(59,130,246,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.3)',
    borderRadius: RADIUS.md,
    padding: 14,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  infoHighlight: {
    color: COLORS.accent,
    fontWeight: '600',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 16,
  },
  cardTitle: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  ruleDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  quickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  quickButtonText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: 15,
  },
  saveText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  resetButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  resetText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
});
