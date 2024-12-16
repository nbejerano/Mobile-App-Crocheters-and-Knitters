import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" phone screen
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

export const scale = size => (width / guidelineBaseWidth) * size;
export const verticalScale = size => (height / guidelineBaseHeight) * size;
export const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export const isTablet = () => {
  const pixelDensity = Dimensions.get('screen').scale;
  const adjustedWidth = width * pixelDensity;
  const adjustedHeight = height * pixelDensity;
  return (Math.sqrt(Math.pow(adjustedWidth, 2) + Math.pow(adjustedHeight, 2))) >= 1000;
};

export const getColumnCount = () => {
  if (width >= 1024) return 3; // Large tablets
  if (width >= 768) return 2;  // Small tablets
  return 1; // Phones
}; 