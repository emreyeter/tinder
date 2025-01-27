import React, { useEffect } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { snapPoint } from 'react-native-redash';
import {
  ANGLE_THRESHOLD,
  CLAMPED_DISTANCE,
  SNAP_EACH,
  SPRING_CONFIG,
} from './constants';
import { findSegmentIndex } from './helper';
import {
  type StackEachProps,
  SWIPE_POSITION,
  SWIPE_POSITION_KEY_INDEX,
} from './types';
import Layouts from './layouts';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const StackEach = (props: StackEachProps) => {
  const {
    layouts,
    onSwipe,
    data,
    zIndex,
    renderItem,
    itemIndex,
    endOpacity,
    selection,
    isActivated,
  } = props;

  const indexTransition = useSharedValue(itemIndex);

  const [transitionX, transitionY] = [useSharedValue(0), useSharedValue(0)];

  const snapSelector = (layout?: React.ReactNode, snapValue?: number) => {
    return layout ? (snapValue ?? 0) : 0;
  };

  const snapPointsX = [
    snapSelector(layouts.left, -SNAP_EACH),
    0,
    snapSelector(layouts.right, SNAP_EACH),
  ];
  const snapPointsY = [
    snapSelector(layouts.top, -height),
    0,
    snapSelector(layouts.bottom, height),
  ];

  const handleChange = (segment: SWIPE_POSITION) => {
    onSwipe?.(segment, data);
  };

  const gesture = Gesture.Pan()
    .onEnd((event) => {
      const snapX = snapPoint(event.translationX, event.velocityX, snapPointsX);
      const snapY = snapPoint(event.translationY, event.velocityY, snapPointsY);

      const segment = findSegmentIndex(event.translationX, event.translationY);

      const snapSegment = [SWIPE_POSITION.RIGHT, SWIPE_POSITION.LEFT].includes(
        segment
      )
        ? snapX
        : snapY;

      switch (segment) {
        case SWIPE_POSITION.RIGHT:
        case SWIPE_POSITION.LEFT:
          transitionX.value = withSpring(snapX, SPRING_CONFIG);
          transitionY.value =
            snapY === 0
              ? withSpring(0, SPRING_CONFIG)
              : withDecay({ velocity: event.velocityY });

          break;
        case SWIPE_POSITION.BOTTOM:
        case SWIPE_POSITION.TOP:
          transitionX.value =
            snapX === 0
              ? withSpring(0, SPRING_CONFIG)
              : withDecay({ velocity: event.velocityX });
          transitionY.value = withSpring(snapY, SPRING_CONFIG);
          break;

        default:
          break;
      }

      if (layouts[SWIPE_POSITION_KEY_INDEX[segment] as keyof typeof layouts]) {
        snapSegment !== 0 && runOnJS(handleChange)(segment);
      } else {
        transitionX.value = withSpring(0, SPRING_CONFIG);
        transitionY.value = withSpring(0, SPRING_CONFIG);
      }
    })
    .onChange((event) => {
      transitionX.value = event.translationX;
      transitionY.value = event.translationY;
    })
    .enabled(itemIndex === 0);

  const segment = useDerivedValue(() => {
    'worklet';

    return findSegmentIndex(transitionX.value, transitionY.value);
  });

  const distance = useDerivedValue(() => {
    'worklet';

    const calculated = Math.sqrt(
      transitionX.value ** 2 + transitionY.value ** 2
    );

    return interpolate(
      calculated,
      [0, ...CLAMPED_DISTANCE, SNAP_EACH],
      [0, 0, endOpacity!, endOpacity!]
    );
  });

  const style = useAnimatedStyle(() => {
    const rotate = interpolate(
      transitionX.value,
      [-width, width],
      [-ANGLE_THRESHOLD, ANGLE_THRESHOLD]
    );

    return {
      transform: [
        { translateX: transitionX.value },
        { translateY: transitionY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  useEffect(() => {
    if (isActivated) {
      switch (selection?.position) {
        case SWIPE_POSITION.RIGHT:
          transitionX.value = snapPointsX[2]!;
          break;
        case SWIPE_POSITION.LEFT:
          transitionX.value = snapPointsX[0]!;
          break;
        case SWIPE_POSITION.TOP:
          transitionY.value = snapPointsY[0]!;
          break;
        case SWIPE_POSITION.BOTTOM:
          transitionY.value = snapPointsY[2]!;
          break;
        default:
          break;
      }
    }

    transitionX.value = withSpring(0, SPRING_CONFIG);
    transitionY.value = withSpring(0, SPRING_CONFIG);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    indexTransition.value = withTiming(itemIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemIndex]);

  useEffect(() => {
    indexTransition.value = withTiming(itemIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const indexStyle = useAnimatedStyle(() => {
    const scale = interpolate(indexTransition.value, [0, 1], [1, 0.97]);
    const translateY = interpolate(indexTransition.value, [0, 1], [0, -20]);

    return {
      transform: [{ scale }, { translateY }],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        entering={FadeIn}
        style={[
          // eslint-disable-next-line react-native/no-inline-styles
          {
            position: 'absolute',
            overflow: 'hidden',
            zIndex,
          },
          style,
          indexStyle,
        ]}
      >
        {renderItem(data)}
        <Layouts distance={distance} segment={segment} layouts={layouts} />
      </Animated.View>
    </GestureDetector>
  );
};

export default StackEach;
