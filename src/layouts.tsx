import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  type LayoutEachProps,
  type LayoutProps,
  SWIPE_POSITIONS_INDEX,
} from './types';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';

const Layout = (props: LayoutEachProps) => {
  const { children, distance, position, segment } = props;

  const derivedOpacity = useDerivedValue(() => {
    return segment.value === position ? distance.value : 0;
  }, [segment.value]);

  const layoutStyle = useAnimatedStyle(() => {
    return {
      opacity: derivedOpacity.value,
    };
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFill, layoutStyle]}>
      {children}
    </Animated.View>
  );
};

const Layouts = (props: LayoutProps) => {
  const keys = Object.keys(props.layouts ?? {});

  const opacity = keys.reduce(
    (acc, key) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      acc[key] = useSharedValue(0);
      return acc;
    },
    {} as Record<string, SharedValue<number>>
  );

  useEffect(() => {
    keys.forEach((key) => {
      const position = SWIPE_POSITIONS_INDEX[key as keyof typeof props.layouts];

      const opacitySelf = opacity[key];

      opacitySelf!.value = withSpring(
        props.segment.value === position ? props.distance.value : 0
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      {keys.map((key) => {
        const opacitySelf = opacity[key];

        const position =
          SWIPE_POSITIONS_INDEX[key as keyof typeof props.layouts];

        return (
          <Layout
            segment={props.segment}
            distance={props.distance}
            position={position}
            opacity={opacitySelf!}
            key={key}
          >
            {props.layouts[key as keyof typeof props.layouts]}
          </Layout>
        );
      })}
    </React.Fragment>
  );
};

export default Layouts;
