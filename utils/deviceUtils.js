import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Base sizes are calibrated for iPhone 13 (390x844)
const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;

// Detect if device is a tablet
export const isTablet = () => {
  const pixelDensity = Dimensions.get('screen').scale;
  const adjustedWidth = width * pixelDensity;
  const adjustedHeight = height * pixelDensity;
  return (Math.sqrt(Math.pow(adjustedWidth, 2) + Math.pow(adjustedHeight, 2))) >= 1000;
};

// Scale factors
export const getScaleFactor = () => {
  return isTablet() ? 1.5 : 1;
};

export const getFontScale = () => {
  return isTablet() ? 1.3 : 1;
};

// Responsive scaling functions
export const scale = size => (width / guidelineBaseWidth) * size;
export const verticalScale = size => (height / guidelineBaseHeight) * size;
export const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

// Layout specific scaling
export const getHeaderHeight = () => {
  if (isTablet()) {
    return Platform.OS === 'ios' ? 90 : 80;
  }
  return Platform.OS === 'ios' ? 56 : 64;
};

export const getTabBarHeight = () => {
  return isTablet() ? 85 : 65;
};

// Grid layout helper
export const getColumnCount = () => {
  if (width >= 1024) return 3; // Large tablets
  if (width >= 768) return 2;  // Small tablets
  return 1; // Phones
};

// Safe area padding for notches and home indicators
export const getSafeAreaPadding = () => {
  return isTablet() ? 24 : 16;
};