import React, { useCallback, useState } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Icon from "phosphor-react-native";

import Typos from "@/components/typos";
import {
  colors,
  gradientTheme,
  radius,
  spacingX,
  spacingY,
} from "@/constants/theme";
import { VerticalScale } from "@/utils/styling";
import { API_URL } from "@/constants/config";

/*
 * ============================================================
 * AppSettings — the "App Settings" hub (modal screen)
 * ============================================================
 *
 * Opened from the App Settings card on the profile dashboard.
 *
 * Preferences persist to AsyncStorage under ONE namespaced key
 * ("nexachat.settings.v1") as a single JSON object owned by this
 * screen — no other module writes that key. Future settings
 * (language, theme picker, blocked users...) add a field to
 * AppSettingsState and a row below.
 * ============================================================
 */

const SETTINGS_KEY = "nexachat.settings.v1";

export interface AppSettingsState {
  notificationsEnabled: boolean;
  messageSounds: boolean;
  hapticFeedback: boolean;
  autoDownloadImages: boolean;
  readReceipts: boolean;
  darkMode: boolean;
}

const DEFAULT_SETTINGS: AppSettingsState = {
  notificationsEnabled: true,
  messageSounds: true,
  hapticFeedback: true,
  autoDownloadImages: true,
  readReceipts: true,
  darkMode: false,
};

const loadSettings = async (): Promise<AppSettingsState> => {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);

    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

/* ============================================================
   SETTING ROW
============================================================ */

type SettingRowProps = {
  icon: React.ReactNode;
  label: string;
  description?: string;
  value?: boolean;
  onToggle?: (next: boolean) => void;
  onPress?: () => void;
};

const SettingRow = ({
  icon,
  label,
  description,
  value,
  onToggle,
  onPress,
}: SettingRowProps) => (
  <TouchableOpacity
    activeOpacity={onPress ? 0.7 : 1}
    onPress={onPress}
    disabled={!onPress}
    style={styles.row}
  >
    <View style={styles.rowIcon}>{icon}</View>

    <View style={styles.rowText}>
      <Typos style={styles.rowLabel}>{label}</Typos>

      {description && (
        <Typos style={styles.rowDescription}>{description}</Typos>
      )}
    </View>

    {onToggle && (
      <Switch
        value={value ?? false}
        onValueChange={onToggle}
        trackColor={{ false: colors.light3, true: gradientTheme.ctaMid2 }}
        thumbColor="#FFFFFF"
      />
    )}
  </TouchableOpacity>
);

/* ============================================================
   SECTION
============================================================ */

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIndicator} />
      <Typos style={styles.sectionTitle}>{title}</Typos>
    </View>

    <View style={styles.sectionCard}>{children}</View>
  </View>
);

/* ============================================================
   SCREEN
============================================================ */

const AppSettings = () => {
  const router = useRouter();

  const [settings, setSettings] = useState<AppSettingsState>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  // Reload every time the modal gains focus (cheap, always fresh).
  useFocusEffect(
    useCallback(() => {
      loadSettings().then((loadedSettings) => {
        setSettings(loadedSettings);
        setLoaded(true);
      });
    }, []),
  );

  const persist = async (patch: Partial<AppSettingsState>) => {
    const next = { ...settings, ...patch };

    setSettings(next);
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  };

  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />

      <StatusBar barStyle="light-content" />

      {/* HERO */}
      <LinearGradient
        colors={[
          gradientTheme.stop1,
          gradientTheme.stop2,
          gradientTheme.stop3,
          gradientTheme.stop4,
          gradientTheme.stop5,
        ]}
        locations={[0, 0.24, 0.48, 0.74, 1]}
        start={{ x: 0.05, y: 0 }}
        end={{ x: 0.95, y: 1 }}
        style={styles.hero}
      >
        <View style={[styles.heroCircle, styles.circleOne]} />
        <View style={[styles.heroCircle, styles.circleTwo]} />

        <View style={styles.topBar}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={styles.closeButton}
          >
            <Icon.XIcon size={21} color={colors.light1} weight="bold" />
          </TouchableOpacity>

          <View style={styles.pageTitleBox}>
            <Typos style={styles.pageTitle}>App Settings</Typos>
          </View>

          <View style={styles.closeButton} />
        </View>

        <Typos style={styles.heroTitle}>Make it yours.</Typos>
      </LinearGradient>

      {/* MAIN AREA */}
      <View style={styles.mainArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* NOTIFICATIONS */}
          <Section title="Notifications">
            <SettingRow
              icon={<Icon.Bell size={17} color={colors.gray2} weight="fill" />}
              label="Push notifications"
              description="New message alerts"
              value={loaded && settings.notificationsEnabled}
              onToggle={(next) => persist({ notificationsEnabled: next })}
            />

            <SettingRow
              icon={<Icon.MusicNote size={17} color={colors.gray2} weight="fill" />}
              label="Message sounds"
              description="Play a sound for incoming messages"
              value={loaded && settings.messageSounds}
              onToggle={(next) => persist({ messageSounds: next })}
            />

            <SettingRow
              icon={<Icon.Vibrate size={17} color={colors.gray2} weight="fill" />}
              label="Haptic feedback"
              description="Vibrate on interactions"
              value={loaded && settings.hapticFeedback}
              onToggle={(next) => persist({ hapticFeedback: next })}
            />
          </Section>

          {/* CHAT */}
          <Section title="Chat">
            <SettingRow
              icon={<Icon.Images size={17} color={colors.gray2} weight="fill" />}
              label="Auto-download media"
              description="Save received images automatically"
              value={loaded && settings.autoDownloadImages}
              onToggle={(next) => persist({ autoDownloadImages: next })}
            />

            <SettingRow
              icon={<Icon.Eye size={17} color={colors.gray2} weight="fill" />}
              label="Read receipts"
              description="Let others see when you've read messages"
              value={loaded && settings.readReceipts}
              onToggle={(next) => persist({ readReceipts: next })}
            />
          </Section>

          {/* APPEARANCE */}
          <Section title="Appearance">
            <SettingRow
              icon={<Icon.Moon size={17} color={colors.gray2} weight="fill" />}
              label="Dark mode"
              description="Reduce glare in low light"
              value={loaded && settings.darkMode}
              onToggle={(next) => persist({ darkMode: next })}
            />
          </Section>

          {/* DATA & CONNECTION */}
          <Section title="Data & Connection">
            <SettingRow
              icon={<Icon.Globe size={17} color={colors.gray2} weight="fill" />}
              label="Server"
              description={API_URL}
            />

          </Section>

          <Typos style={styles.versionText}>Nexachat v1.0.0</Typos>
        </ScrollView>
      </View>
    </View>
  );
};

export default AppSettings;

/* ==============================================================
   STYLES
============================================================== */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.ivoryWhite,
  },

  /* HERO */

  hero: {
    height: VerticalScale(170),
    paddingHorizontal: spacingX._25,
    paddingTop: heroTopPadding(),
    justifyContent: "flex-end",
    paddingBottom: spacingY._20,
    overflow: "hidden",
  },

  heroCircle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 999,
  },

  circleOne: {
    top: -90,
    right: -70,
    backgroundColor: "rgba(255,255,255,0.10)",
  },

  circleTwo: {
    bottom: -110,
    left: -80,
    backgroundColor: "rgba(255,209,102,0.10)",
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacingY._10,
  },

  pageTitleBox: {
    flex: 1,
    alignItems: "center",
  },

  pageTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.light1,
  },

  closeButton: {
    width: 42,
    height: 42,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.light1,
  },

  /* MAIN AREA */

  mainArea: {
    flex: 1,
    marginTop: -24,
    borderTopLeftRadius: radius._40,
    borderTopRightRadius: radius._40,
    backgroundColor: colors.ivoryWhite,
    overflow: "hidden",
  },

  scrollContent: {
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._20,
    paddingBottom: spacingY._40,
  },

  /* SECTIONS */

  section: {
    marginBottom: spacingY._20,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
    marginBottom: spacingY._10,
  },

  sectionIndicator: {
    width: 4,
    height: 20,
    backgroundColor: gradientTheme.ctaMid2,
    borderTopLeftRadius: 7,
    borderBottomRightRadius: 7,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.black,
  },

  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: radius._20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacingX._15,
  },

  /* ROWS */

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._12,
    paddingVertical: spacingY._12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light2,
  },

  rowIcon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.light1,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 3,
    borderBottomLeftRadius: 3,
  },

  rowText: {
    flex: 1,
  },

  rowLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.black,
  },

  rowDescription: {
    fontSize: 11,
    color: colors.gray1,
    marginTop: 1,
  },

  versionText: {
    textAlign: "center",
    fontSize: 11,
    color: colors.textGray,
    marginTop: spacingY._10,
  },
});

/** Hero top padding: status-bar height on Android, more on iOS. */
function heroTopPadding(): number {
  return Platform.OS === "ios" ? VerticalScale(50) : VerticalScale(60);
}
