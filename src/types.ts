import { type DerivedValue, type SharedValue } from 'react-native-reanimated';

export interface SwipeCardProps<T> {
  layouts: {
    left?: React.ReactNode;
    right?: React.ReactNode;
    top?: React.ReactNode;
    bottom?: React.ReactNode;
  };
  onSwipe?: (position: SWIPE_POSITION, data: T) => void;
  renderItem: (data: T) => React.ReactNode;
  data: T[];
  numberOfRender?: number;
  endOpacity?: number;
  cardHeight?: number;
}

export interface StackEachProps extends SwipeCardProps<any> {
  data: any;
  zIndex: number;
  itemIndex: number;
  selection: SelectionRefProps | undefined;
  isActivated: boolean;
}

export enum SWIPE_POSITION {
  RIGHT = 0,
  BOTTOM = 1,
  LEFT = 2,
  TOP = 3,
}

export const SWIPE_POSITIONS_INDEX = {
  bottom: SWIPE_POSITION.BOTTOM,
  left: SWIPE_POSITION.LEFT,
  right: SWIPE_POSITION.RIGHT,
  top: SWIPE_POSITION.TOP,
} as Record<keyof SwipeCardProps<any>['layouts'], SWIPE_POSITION>;

export const SWIPE_POSITION_KEY_INDEX = {
  [SWIPE_POSITION.RIGHT]: 'right',
  [SWIPE_POSITION.BOTTOM]: 'bottom',
  [SWIPE_POSITION.LEFT]: 'left',
  [SWIPE_POSITION.TOP]: 'top',
};

export interface LayoutProps
  extends Omit<SwipeCardProps<any>, 'renderItem' | 'data'> {
  segment: DerivedValue<SWIPE_POSITION>;
  distance: DerivedValue<number>;
}

export interface LayoutEachProps
  extends Pick<LayoutProps, 'segment' | 'distance'> {
  children: React.ReactNode;
  opacity: SharedValue<number>;
  position: SWIPE_POSITION;
}

export interface SelectionRefProps {
  index: number;
  position: SWIPE_POSITION;
}

export interface StackSwiperRef {
  back: () => void;
}
