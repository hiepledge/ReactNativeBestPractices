// react
import React, {Fragment, ReactNode, useEffect} from 'react';

// modules
import {Pressable, StyleSheet} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

type AnimatedBottomSheetProps = {
  isOpen: boolean;
  backdropOnPress: () => void;
  children: ReactNode;
};

const PressAnimated = Animated.createAnimatedComponent(Pressable);
const HEIGHT = 300;
const CLAMP = 20;

const AnimatedBottomSheet = (props: AnimatedBottomSheetProps) => {
  const offset = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onChange(event => {
      const offsetDelta = event.changeY + offset.value;
      const clamp = Math.max(-CLAMP, offsetDelta);
      offset.value = offsetDelta > 0 ? offsetDelta : withSpring(clamp);
    })
    .onFinalize(() => {
      if (offset.value < HEIGHT / 3) {
        offset.value = withSpring(0);
      } else {
        offset.value = withTiming(HEIGHT, {}, () => {
          runOnJS(props.backdropOnPress)();
        });
      }
    });

  const translateY = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: offset.value,
        },
      ],
    };
  }, []);

  useEffect(() => {
    function onOpen() {
      if (props.isOpen) {
        offset.value = 0;
      }
    }

    onOpen();
  }, [props.isOpen]);

  if (!props.isOpen) {
    return <Fragment />;
  }
  return (
    <Fragment>
      <PressAnimated
        onPress={props.backdropOnPress}
        entering={FadeIn}
        exiting={FadeOut}
        style={[styles.backdrop]}
      />
      <GestureDetector gesture={panGesture}>
        <Animated.View
          entering={SlideInDown.springify().damping(15)}
          exiting={SlideOutDown}
          style={[styles.view, translateY]}>
          {props.children}
        </Animated.View>
      </GestureDetector>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 1,
  },
  view: {
    backgroundColor: 'white',
    height: HEIGHT,
    width: '100%',
    position: 'absolute',
    bottom: -CLAMP * 1.1,
    zIndex: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});

export default AnimatedBottomSheet;
