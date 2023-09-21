import React, {FC, Fragment, useEffect} from 'react';
import Animated, {
  interpolateColor,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type AnimatedBottomToast = {
  showToast: boolean;
  status: string | 'done';
};

const AnimatedBottomToast: FC<AnimatedBottomToast> = ({showToast, status}) => {
  const value = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(value.value, [0, 1], ['grey', 'green']),
    };
  }, []);

  useEffect(() => {
    value.value = withTiming(status === 'done' ? 1 : 0);
  }, [status]);

  return (
    <Fragment>
      {showToast && (
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={[
            {
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              width: '90%',
              position: 'absolute',
              bottom: 0,
              height: 40,
              marginBottom: 30,
              borderRadius: 3,
            },
            animatedStyle,
          ]}>
          <Animated.Text
            style={{
              color: 'white',
              fontSize: 15,
            }}>
            {status.toUpperCase()}
          </Animated.Text>
        </Animated.View>
      )}
    </Fragment>
  );
};

AnimatedBottomToast.defaultProps = {
  showToast: false,
  status: '',
};

export default AnimatedBottomToast;
