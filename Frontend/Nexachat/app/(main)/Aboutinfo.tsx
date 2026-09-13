import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function AboutScreen({ navigation }: { navigation: any }) {
  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#090909", "#0D0D0D", "#11100F"]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={23} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>About</Text>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* HERO */}
          <View style={styles.hero}>
            {/* Glow */}
            <View style={styles.logoGlow} />

            <View style={styles.logoWrapper}>
              <LinearGradient
                colors={["#FFFFFF", "#E8E2D8"]}
                style={styles.logoBackground}
              >
                <Image
                  source={require("../../assets/images/Applogo.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </LinearGradient>
            </View>

            <Text style={styles.appName}>NexaChat</Text>

            <Text style={styles.tagline}>
              Connect. Communicate. Stay closer.
            </Text>

            <View style={styles.versionBadge}>
              <View style={styles.versionDot} />
              <Text style={styles.versionText}>Version 2.0.0</Text>
            </View>
          </View>

          {/* INTRODUCTION */}
          <View style={styles.introCard}>
            <LinearGradient
              colors={[
                "rgba(255,255,255,0.075)",
                "rgba(255,255,255,0.025)",
              ]}
              style={styles.cardGradient}
            >
              <View style={styles.introIcon}>
                <Ionicons
                  name="chatbubble-ellipses"
                  size={21}
                  color="#D7B77A"
                />
              </View>

              <View style={styles.introContent}>
                <Text style={styles.cardTitle}>Your conversations,</Text>
                <Text style={styles.cardTitleAccent}>your space.</Text>

                <Text style={styles.description}>
                  NexaChat is designed to make communication feel effortless.
                  Chat with the people who matter, share moments instantly,
                  and stay connected through a beautifully simple experience.
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* SECTION TITLE */}
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionLabel}>WHAT YOU CAN DO</Text>
            <View style={styles.headingLine} />
          </View>

          {/* FEATURES */}
          <View style={styles.featureGrid}>
            <FeatureCard
              icon="chatbubble-outline"
              title="Instant Chat"
              description="Send messages instantly with real-time communication."
            />

            <FeatureCard
              icon="person-outline"
              title="Your Profile"
              description="Customize your profile, avatar and personal details."
            />

            <FeatureCard
              icon="shield-checkmark-outline"
              title="Secure"
              description="Protected authentication keeps your account safe."
            />

            <FeatureCard
              icon="notifications-outline"
              title="Stay Updated"
              description="Never miss important messages and conversations."
            />
          </View>

          {/* COMING SOON */}
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionLabel}>COMING SOON</Text>
            <View style={styles.headingLine} />
          </View>

          <View style={styles.futureCard}>
            <LinearGradient
              colors={[
                "rgba(215,183,122,0.12)",
                "rgba(215,183,122,0.025)",
              ]}
              style={styles.futureGradient}
            >
              <View style={styles.futureHeader}>
                <View style={styles.futureIcon}>
                  <Ionicons name="sparkles" size={19} color="#D7B77A" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.futureTitle}>
                    More is on the way
                  </Text>
                  <Text style={styles.futureSubtitle}>
                    We're building the next generation of communication.
                  </Text>
                </View>
              </View>

              <FutureFeature
                icon="videocam-outline"
                title="Voice & Video Calls"
                description="Connect face-to-face with high-quality audio and video."
              />

              <FutureFeature
                icon="color-palette-outline"
                title="Themes & Wallpapers"
                description="Make every conversation feel uniquely yours."
              />

              <FutureFeature
                icon="options-outline"
                title="Advanced Controls"
                description="More privacy, notification and customization options."
              />
            </LinearGradient>
          </View>

          {/* SUPPORT */}
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionLabel}>HELP & SUPPORT</Text>
            <View style={styles.headingLine} />
          </View>

          <View style={styles.linksCard}>
            <SettingsRow
              icon="shield-checkmark-outline"
              title="Privacy Policy"
              subtitle="Learn how your information is protected"
              onPress={() =>
                handleOpenLink("https://example.com/privacy")
              }
            />

            <SettingsRow
              icon="document-text-outline"
              title="Terms of Service"
              subtitle="Review the rules and conditions"
              onPress={() =>
                handleOpenLink("https://example.com/terms")
              }
            />

            <SettingsRow
              icon="headset-outline"
              title="Contact Support"
              subtitle="Need help? We're here for you"
              onPress={() =>
                handleOpenLink("https://example.com/support")
              }
              last
            />
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <View style={styles.footerLogo}>
              <Image
                source={require("../../assets/images/Applogo.png")}
                style={styles.footerLogoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.footerBrand}>NexaChat</Text>

            <Text style={styles.footerText}>
              Built with care for better conversations.
            </Text>

            <Text style={styles.copyright}>
              © 2026 NexaChat. All rights reserved.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/* ------------------------------------------------ */
/* FEATURE CARD */
/* ------------------------------------------------ */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.featureCard}>
      <View style={styles.featureIcon}>
        <Ionicons name={icon} size={20} color="#D7B77A" />
      </View>

      <Text style={styles.featureTitle}>{title}</Text>

      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  );
}

/* ------------------------------------------------ */
/* FUTURE FEATURE */
/* ------------------------------------------------ */

function FutureFeature({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.futureFeature}>
      <View style={styles.futureFeatureIcon}>
        <Ionicons name={icon} size={18} color="#D7B77A" />
      </View>

      <View style={styles.futureFeatureContent}>
        <Text style={styles.futureFeatureTitle}>{title}</Text>
        <Text style={styles.futureFeatureDescription}>
          {description}
        </Text>
      </View>
    </View>
  );
}

/* ------------------------------------------------ */
/* SETTINGS ROW */
/* ------------------------------------------------ */

function SettingsRow({
  icon,
  title,
  subtitle,
  onPress,
  last,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.settingsRow, last && styles.lastRow]}
      onPress={onPress}
    >
      <View style={styles.settingsIcon}>
        <Ionicons name={icon} size={19} color="#D7B77A" />
      </View>

      <View style={styles.settingsContent}>
        <Text style={styles.settingsTitle}>{title}</Text>
        <Text style={styles.settingsSubtitle}>{subtitle}</Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color="rgba(255,255,255,0.3)"
      />
    </TouchableOpacity>
  );
}

/* ------------------------------------------------ */
/* STYLES */
/* ------------------------------------------------ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090909",
  },

  safeArea: {
    flex: 1,
  },

  /* HEADER */

  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  headerSpacer: {
    width: 40,
  },

  /* SCROLL */

  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },

  /* HERO */

  hero: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 30,
  },

  logoGlow: {
    position: "absolute",
    top: 30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(215,183,122,0.08)",
  },

  logoWrapper: {
    width: 104,
    height: 104,
    borderRadius: 30,
    padding: 1,
    backgroundColor: "rgba(215,183,122,0.65)",
    marginBottom: 18,
  },

  logoBackground: {
    flex: 1,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 72,
    height: 72,
  },

  appName: {
    color: "#FFFFFF",
    fontSize: 29,
    fontWeight: "800",
    letterSpacing: -0.7,
  },

  tagline: {
    color: "rgba(255,255,255,0.52)",
    fontSize: 14,
    marginTop: 6,
    letterSpacing: 0.2,
  },

  versionBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(215,183,122,0.09)",
    borderWidth: 1,
    borderColor: "rgba(215,183,122,0.18)",
  },

  versionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D7B77A",
    marginRight: 7,
  },

  versionText: {
    color: "#D7B77A",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  /* INTRO */

  introCard: {
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 28,
  },

  cardGradient: {
    padding: 20,
    flexDirection: "row",
  },

  introIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(215,183,122,0.1)",
    marginRight: 14,
  },

  introContent: {
    flex: 1,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 23,
  },

  cardTitleAccent: {
    color: "#D7B77A",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 23,
  },

  description: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 9,
  },

  /* SECTION HEADING */

  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
  },

  sectionLabel: {
    color: "rgba(255,255,255,0.42)",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
  },

  headingLine: {
    height: 1,
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
    marginLeft: 12,
  },

  /* FEATURE GRID */

  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  featureCard: {
    width: "48.2%",
    minHeight: 156,
    padding: 16,
    marginBottom: 12,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },

  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(215,183,122,0.09)",
    marginBottom: 14,
  },

  featureTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },

  featureDescription: {
    color: "rgba(255,255,255,0.43)",
    fontSize: 11.5,
    lineHeight: 17,
  },

  /* FUTURE */

  futureCard: {
    overflow: "hidden",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(215,183,122,0.2)",
    marginBottom: 28,
  },

  futureGradient: {
    padding: 18,
  },

  futureHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  futureIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(215,183,122,0.1)",
    marginRight: 13,
  },

  futureTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  futureSubtitle: {
    color: "rgba(255,255,255,0.42)",
    fontSize: 11,
    marginTop: 4,
    lineHeight: 16,
  },

  futureFeature: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },

  futureFeatureIcon: {
    width: 35,
    height: 35,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(215,183,122,0.08)",
    marginRight: 12,
  },

  futureFeatureContent: {
    flex: 1,
  },

  futureFeatureTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  futureFeatureDescription: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },

  /* LINKS */

  linksCard: {
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    overflow: "hidden",
  },

  settingsRow: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  settingsIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(215,183,122,0.08)",
    marginRight: 12,
  },

  settingsContent: {
    flex: 1,
  },

  settingsTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },

  settingsSubtitle: {
    color: "rgba(255,255,255,0.38)",
    fontSize: 10.5,
    marginTop: 4,
  },

  /* FOOTER */

  footer: {
    alignItems: "center",
    paddingTop: 38,
    paddingBottom: 10,
  },

  footerLogo: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
  },

  footerLogoImage: {
    width: 26,
    height: 26,
  },

  footerBrand: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  footerText: {
    color: "rgba(255,255,255,0.32)",
    fontSize: 10.5,
    marginTop: 5,
  },

  copyright: {
    color: "rgba(255,255,255,0.2)",
    fontSize: 9.5,
    marginTop: 10,
  },
});