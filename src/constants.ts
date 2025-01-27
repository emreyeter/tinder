import { Dimensions } from 'react-native';
import { type SpringConfig } from 'react-native-reanimated/lib/typescript/animation/springUtils';

const { width: screenWidth } = Dimensions.get('window');

export const ANGLE_THRESHOLD = 30;
export const PIE_COUNT = 4;

export const SNAP_EACH = screenWidth * 1.5;

export const CLAMPED_DISTANCE = [80, screenWidth / 2];

export const ROTATION_OFFSET = Math.PI / 4;

export const SPRING_CONFIG: SpringConfig = {
  stiffness: 100,
  damping: 16,
};

export const BACK_BUTTON_DELAY = 100;
