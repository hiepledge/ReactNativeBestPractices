// react
import React, {
  FC,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

// modules
import {FlatList, Pressable, Text} from 'react-native';
import Animated, {
  Layout,
  SlideInRight,
  SlideOutRight,
} from 'react-native-reanimated';

// styles
import styles from './layout-animation.styles';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<number>);

const LayoutAnimation: FC = () => {
  const isInit = useRef<boolean>(true);
  const [data, setData] = useState<Array<number>>([1, 2, 3]);

  const handleAddOnPress = useCallback(() => {
    setData(prev => [...prev, (prev[prev.length - 1] || 0) + 1]);
  }, []);

  const renderCell = useCallback((props: any) => {
    return (
      <Animated.View
        {...props}
        entering={
          isInit.current ? SlideInRight.delay(props.index * 200) : SlideInRight
        }
        exiting={SlideOutRight}
        layout={Layout.springify()}
      />
    );
  }, []);

  useEffect(() => {
    isInit.current = false;
  }, []);

  return (
    <Fragment>
      <AnimatedFlatList
        data={data}
        keyExtractor={item => item.toString()}
        renderItem={({item}) => (
          <Animated.View
            onTouchEnd={() => {
              setData(prevState => prevState.filter(fItem => fItem !== item));
            }}
            key={item}
            style={styles.itemList}>
            <Text>{item}</Text>
          </Animated.View>
        )}
        CellRendererComponent={renderCell}
      />

      <Pressable style={styles.button} onPress={handleAddOnPress}>
        <Text style={styles.buttonText}>+</Text>
      </Pressable>
    </Fragment>
  );
};

export default LayoutAnimation;
