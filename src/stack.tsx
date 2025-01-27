import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  type SelectionRefProps,
  type StackSwiperRef,
  SWIPE_POSITION,
  type SwipeCardProps,
} from './types';
import StackEach from './stack-each';
import Animated from 'react-native-reanimated';
import { BACK_BUTTON_DELAY } from './constants';

const StackSwiper = <T,>(
  props: SwipeCardProps<T>,
  ref: React.ForwardedRef<StackSwiperRef>
) => {
  const {
    layouts,
    data,
    onSwipe,
    renderItem,
    numberOfRender = 5,
    endOpacity = 1,
    cardHeight = 500,
  } = props;

  const [index, setIndex] = useState<number>(0);

  const renderedData = data.slice(index, index + numberOfRender);

  const backDatetime = useRef<number>(0);

  const selectionRef = useRef<SelectionRefProps[]>([]);

  const findSelection = (searchIndex: number) => {
    const found = selectionRef.current.find(
      (item) => item.index === searchIndex
    );

    return found;
  };

  const addOrReplaceSelection = (
    replaceIndex: number,
    position: SWIPE_POSITION
  ) => {
    const found = findSelection(index);

    if (found) {
      found.position = position;
    } else {
      selectionRef.current.push({ index: replaceIndex, position });
    }
  };

  const removeAfterIndexSelection = (findIndex: number) => {
    selectionRef.current = selectionRef.current.filter(
      (item) => item.index <= findIndex
    );
  };

  const handleSwipe = (position: SWIPE_POSITION, swipeData: T) => {
    setTimeout(() => {
      removeAfterIndexSelection(index);
      setIndex((current) => current + 1);
    }, 250);

    addOrReplaceSelection(index, position);

    onSwipe?.(position, swipeData);
  };

  const handleBack = () => {
    if (Date.now() - backDatetime.current < BACK_BUTTON_DELAY) {
      return;
    }

    backDatetime.current = Date.now();

    setIndex((current) => {
      const newIndex = current > 0 ? current - 1 : 0;

      removeAfterIndexSelection(newIndex);

      return newIndex;
    });
  };

  useImperativeHandle(
    ref,
    () => ({
      back: handleBack,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Animated.View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        width: '100%',
        height: cardHeight,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
      }}
    >
      {renderedData.map((item, itemIndex) => {
        const actualIndex = index + itemIndex;

        return (
          <StackEach
            isActivated={actualIndex === index}
            selection={findSelection(actualIndex)}
            onSwipe={handleSwipe}
            key={actualIndex}
            itemIndex={itemIndex}
            zIndex={data.length - actualIndex}
            data={item}
            layouts={layouts}
            renderItem={renderItem}
            endOpacity={endOpacity}
          />
        );
      })}
    </Animated.View>
  );
};

export default forwardRef<StackSwiperRef, SwipeCardProps<any>>(StackSwiper);
