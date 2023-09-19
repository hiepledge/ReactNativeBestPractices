import React from 'react';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {StyleSheet, Text} from 'react-native';

type PickerItemProps = {
  itemHeight: number;
  index: number;
  item: string;
  scrollY: SharedValue<number>;
};

const PickerItem = ({itemHeight, index, scrollY, item}: PickerItemProps) => {
  const scaleStyle = useAnimatedStyle(() => {
    const input = [
      (index - 2) * itemHeight,
      (index - 1) * itemHeight,
      index * itemHeight,
    ];
    return {
      opacity: interpolate(scrollY.value, input, [0.2, 1, 0.2]),
      transform: [
        {
          rotateX: `${interpolate(scrollY.value, input, [45, 0, 45])}deg`,
        },
        {
          scale: interpolate(scrollY.value, input, [0.75, 1, 0.75]),
        },
      ],
    };
  }, []);

  return (
    <Animated.View
      style={[{height: itemHeight}, scaleStyle, styles.animatedContainer]}>
      <Text style={styles.pickerItem}>{item}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pickerItem: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#000',
  },
  animatedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PickerItem;
