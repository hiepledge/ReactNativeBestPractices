import React, {forwardRef} from 'react';
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import PickerItem from './picker-item';

interface PickerProps {
  items: string[];
  onIndexChange: (index: number) => void;
  itemHeight: number;
}

const Picker = forwardRef<Animated.FlatList, PickerProps>(function Picker(
  props,
  ref,
) {
  const {items, onIndexChange, itemHeight} = props;

  const scrollY = useSharedValue(0);

  const modifiedItems = ['', ...items, ''];

  const momentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    onIndexChange(index);
  };

  return (
    <View style={{height: itemHeight * 3}}>
      <View style={[styles.indicatorHolder, {top: itemHeight}]}>
        <View style={[styles.indicator]} />
        <View style={[styles.indicator, {marginTop: itemHeight}]} />
      </View>
      <Animated.FlatList
        ref={ref}
        data={modifiedItems}
        onScroll={event => {
          scrollY.value = event.nativeEvent.contentOffset.y;
        }}
        renderItem={({item, index}) => (
          <PickerItem
            scrollY={scrollY}
            item={item}
            itemHeight={itemHeight}
            index={index}
          />
        )}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        onMomentumScrollEnd={momentumScrollEnd}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
        keyExtractor={(_, index) => index}
        decelerationRate="fast"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  indicatorHolder: {
    position: 'absolute',
    alignSelf: 'center',
  },
  indicator: {
    width: 120,
    height: 1,
    backgroundColor: '#ccc',
  },
});

export default Picker;
