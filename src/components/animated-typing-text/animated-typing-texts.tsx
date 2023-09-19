import React, {useState} from 'react';
import AnimatedTypingText from './animated-typing-text';
import {View} from 'react-native';

const texts = [
  'Unbeatable Prices, Unbelievable Deals!',
  'Shop Smart, Save Big! ',
  'Your Savings Destination!"',
  'Quality and Savings Combined!',
];

const AnimatedTypingTexts = () => {
  const [index, setIndex] = useState<number>(0);
  return (
    <View
      style={{
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        marginHorizontal: 10,
      }}>
      <AnimatedTypingText
        style={{color: 'white', fontSize: 15, fontStyle: 'normal'}}
        lineBreakMode="tail"
        numberOfLines={1}
        ms={80}
        text={texts[index]}
        onRenderFinal={() => {
          if (index < texts.length - 1) {
            setIndex(prevState => prevState + 1);
          } else {
            setIndex(0);
          }
        }}
      />
    </View>
  );
};

export default AnimatedTypingTexts;
