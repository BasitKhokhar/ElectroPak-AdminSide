// 🔹 SoftWhite Theme (Updated Secondary Color)
const softWhite = {
  bodybackground: "#F8F9FB",      // Very soft light gray background
  cardsbackground: "#FFFFFF",     // Clean white for product cards
  primary: "#1A73E8",             // Elegant professional blue (buttons + highlights)
  accent: "#0F5AD1",              // Darker blue variant for active elements
  secondary: "#E3EEFF",           // Light, soft blue matching primary for subtle sections
  text: "#0B0B0B",                // Dark rich black text
  mutedText: "#6B7280",           // Soft gray for labels, small text
  border: "#D8DFEA",              // Smooth light border like in your screens
  error: "#E63946",                // Soft error red

  
  gradients: {
    blueSky: ["#56CCF2", "#2F80ED"],   // Hero banners (like the sale banner)
    softWhite: ["#FFFFFF", "#F2F4F7"],
    cardGlow: ["#FFFFFF", "#F7F9FC"],
    bluePulse: ["#1A73E8", "#0F5AD1"],
  },
};

// 🔹 PremiumBlue Theme (High-end commerce style)
const premiumBlue = {
  bodybackground: "#F6F7FB",
  cardsbackground: "#FFFFFF",
  primary: "#176BFF",
  accent: "#144CC8",
  secondary: "#D6E4FF",           // Slightly lighter blue matching primary
  text: "#1A1A1A",
  mutedText: "#6E6E6E",
  border: "#D5D9E2",
  error: "#D32F2F",
  gradients: {
    blueGlow: ["#4FACFE", "#00F2FE"],
    cleanWhite: ["#FFFFFF", "#EBEDF1"],
    cyanBurst: ["#00C6FF", "#0072FF"],
  },
};

// 🔹 TechMinimal Theme (For modern electronics look)
const techMinimal = {
  bodybackground: "#F4F6FA",
  cardsbackground: "#FFFFFF",
  primary: "#007BFF",
  accent: "#005FCC",
  secondary: "#D0E4FF",           // Matching soft blue for primary
  text: "#0A0A0A",
  mutedText: "#7A828C",
  border: "#D0D6E1",
  error: "#FF3B30",
  gradients: {
    blueSoft: ["#2F80ED", "#56CCF2"],
    whiteClean: ["#FFFFFF", "#F2F4F6"],
  },
};

// 🔹 Choose active theme
const activeTheme = "softWhite";  
const themes = { softWhite, premiumBlue, techMinimal };
export const colors = themes[activeTheme];
export default colors;
