import { PIE_COUNT, ROTATION_OFFSET } from './constants';
import { SWIPE_POSITION } from './types';

export function findSegmentIndex(x: number, y: number): SWIPE_POSITION {
  'worklet';

  let theta = Math.atan2(y, x);

  if (theta < 0) {
    theta += 2 * Math.PI;
  }

  theta = (theta + ROTATION_OFFSET) % (2 * Math.PI);

  const segmentAngle = (2 * Math.PI) / PIE_COUNT;

  const segmentIndex = Math.floor(theta / segmentAngle) % PIE_COUNT;

  return segmentIndex;
}
