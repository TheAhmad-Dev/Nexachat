import { scale, VerticalScale } from "@/utils/styling";

export const colors = {
  // BRAND COLORS
  primary: "#facc15",
  primaryLight: "#fef08a",
  primaryDark: "#eab308",
sendButtonbg:"#eab308"  , 
  // TEXT COLORS
  text: "#292524",
  textSecondary: "#57534e",
  textInverse: "#ffffff",

  // BACKGROUNDS
  white: "#f3efef",
  cream: "#faf9de",
  black: "#000000",
  neutral50: "#fafaf9",
  neutral100: "#f5f5f4",
  neutral200: "#e7e5e4",
  neutral300: "#d6d3d1",
  neutral350: "#cccccc",
  neutral400: "#a8a29e",
  neutral500: "#78716c",
  neutral600: "#57534e",
  neutral700: "#44403c",
  neutral800: "#292524",
  neutral900: "#171717",

  // CHAT BUBBLES
  myBubble: "#ffcd05fa", // vibrant outgoing

  // ICONS & DIVIDERS
  divider: "#E0E0E0",
  iconDefault: "#424242",
  iconActive: "#FFB300", // luxurious amber


  // Golds / Luxury PALETTE
  luxuryGold: "#BF932A",
  deepGold: "#9E6200",
  softGold: "#DFC57B",
  ivoryWhite: "#FCFCF7",

  luxury50: "#FFF8D6", // very light cream
  luxury100: "#FFEB97", // soft gold
  luxury200: "#E8C977", // warm gold
  luxury300: "#D1A75A", // antique gold
  luxury400: "#B8863D", // rich bronze
  luxury500: "#9A6A2A", // medium brown-gold
  luxury600: "#7A4D1C", // deep caramel
  luxury700: "#583714", // dark luxury brown


  light1: "#f1f2f4",
  
  light2: "#e4e6e9",

  light3: "#c9cdd2",

  gray1: "#6b7278",

  gray2: "#3a3f44",

  purple1: "#6C6E85",

  purple2: "#78788E",


  purple3: "#84869B",

  black1: "#26292c",

  textGray: "#7a7f85",

  white1: "#d9dde1",

  teal: "#3fb8c9",

  bgStart: "#3a3f44",

  bgMid: "#5c5568",

  bgEnd: "#9c8fb0",

  btnStart: "#2e2b34",

  btnMid1: "#453a52",

  btnMid2: "#5c4a72",

  btnEnd: "#4a3f5a",

 placeholder: "#494b4de0",

  border: "#d7dee3",

  glassWhite: "rgba(255,255,255,0.22)",

glassBorder: "rgba(255,255,255,0.35)",

mint: "#D8FFF7",

sky: "#CFEFFF",

lavender: "#E9E2FF",

glowBlue: "#BCEFFF",

glowPink: "#FFD7F5",

background1: "#F4FCFF",

background2: "#EEF4FF",

background3: "#FDFBFF",
};
export const gradientTheme = {
  stop1: "#9D9EA3",
  stop2: "#8A9AB3",
  stop3: "#6B697F",
  stop4: "#575D69",
  stop5: "#7DA6AC",
  overlayViolet: "rgba(139,111,168,0.30)",
  overlayTeal: "rgba(63,180,140,0.28)",
  accentTeal: "#DACD91",
  accentViolet: "#B983FF",
  subtext: "rgba(255,255,255,0.78)",
  tanBrown: "#6B4226",
  ctaStart: "#E7DAD0",
  ctaMid1: "#C9C3C2",
  ctaMid2: "#5C3F7A",
  ctaMid3: "#7b5a9e",
  ctaMid4: "#74608a",
  ctaEnd: "#575D69",
  bgPureBlack: "#0A0A0B",
  searchBarFill: "rgba(255,255,255,0.18)",
  onlineDotGreen: "#3DDC84",
  typingGreenIOS: "#34C759",
  senderLabelGray: "#8E8E93",
  bubbleIncoming: "rgba(60,60,65,0.75)",
  bubbleOutgoing: "rgba(180,175,200,0.85)",
  bubbleIncomingAlt: "#F2F2F2",
  bubbleOutgoingAlt: "#1C1C1E",
};



export const dustlessDark = {
  headerTop: "#2B2B2E",
  headerBottom: "#1A1A1C",
};
export const spacingX = {
  _3: scale(3),
  _5: scale(5),
  _7: scale(7),
  _10: scale(10),
  _12: scale(12),
  _15: scale(15),
  _20: scale(20),
  _25: scale(25),
  _30: scale(30),
  _35: scale(35),
  _40: scale(40),
};

export const spacingY = {
  _5: VerticalScale(5),
  _7: VerticalScale(7),
  _10: VerticalScale(10),
  _12: VerticalScale(12),
  _15: VerticalScale(15),
  _17: VerticalScale(17),
  _20: VerticalScale(20),
  _25: VerticalScale(25),
  _30: VerticalScale(30),
  _35: VerticalScale(35),
  _40: VerticalScale(40),
  _50: VerticalScale(50),
  _60: VerticalScale(60),
};

export const radius = {
  _3: VerticalScale(3),
  _6: VerticalScale(6),
  _10: VerticalScale(10),
  _12: VerticalScale(12),
  _15: VerticalScale(15),
  _17: VerticalScale(17),
  _20: VerticalScale(20),
  _30: VerticalScale(30),
  _40: VerticalScale(40),
  _50: VerticalScale(50),
  _60: VerticalScale(60),
  _70: VerticalScale(70),
  _80: VerticalScale(80),
  _90: VerticalScale(90),
  _150: VerticalScale(150),
  half: 100,
  full: 200,
};
