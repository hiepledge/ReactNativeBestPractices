// react
import React, {useRef, useState} from 'react';

// modules
import {Dimensions, StyleSheet, TextInput, View} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

// hooks
import {useTimeout} from '../../hooks/use-timeout';

export interface IOTPInputProps {
  otpCodeChanged: (otpCode: string) => void;
}

const NUMBER_OF_INPUTS = 6;

const inputWidth = Dimensions.get('screen').width / NUMBER_OF_INPUTS;

export function OTPInput(props: IOTPInputProps) {
  const {otpCodeChanged} = props;

  const isFocused = useIsFocused();

  const [values, setValues] = useState<string[]>(['', '', '', '', '', '']);
  const inputsRef = useRef<Array<TextInput | null>>([]);

  const focusedIndex = useSharedValue(0);

  const applyOTPCodeToInputs = (code: string) => {
    // split up code and apply it to all inputs
    const codeArray = code.split('');
    codeArray.forEach((char, index) => {
      const input = inputsRef.current[index];
      if (input) {
        input.setNativeProps({
          text: char,
        });
      }
    });
    // focus on last input as a cherry on top
    const lastInput = inputsRef.current[inputsRef.current.length - 1];
    if (lastInput) {
      lastInput.focus();
      otpCodeChanged(code);
    }
  };

  useTimeout(
    () => {
      // focus on the first input
      const firstInput = inputsRef.current[0];
      if (firstInput) {
        firstInput.focus();
      }
    },
    isFocused ? 1000 : null,
  );

  const derivedValue = useDerivedValue(() => {
    return withTiming(focusedIndex.value);
  }, []);

  const translateX = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(focusedIndex.value * inputWidth),
        },
        {
          scale: interpolate(
            derivedValue.value,
            [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
          ),
        },
      ],
    };
  }, []);

  return (
    <View style={styles.container}>
      {Array.from({length: NUMBER_OF_INPUTS}, (_, index) => {
        return (
          <TextInput
            key={index}
            ref={el => (inputsRef.current[index] = el)}
            keyboardType={'numeric'}
            placeholder=""
            selectionColor="transparent"
            defaultValue=""
            textContentType="oneTimeCode"
            maxLength={6} // a length of 6 because they paste their code into it
            style={styles.textInput}
            value={values[index]}
            onChange={event => {
              const {text} = event.nativeEvent;
              const newValues = [...values];
              const level1 = values[index]
                ? text.split('').filter(item => item !== values[index])
                : text;
              if (Array.isArray(level1) && level1.length > 0) {
                newValues[index] = level1[0];
              } else {
                const level2 = text.split('').filter(item => item !== text);
                if (Array.isArray(level2) && level2.length > 0) {
                  newValues[index] = level2[0];
                } else {
                  newValues[index] = text;
                }
              }

              setValues(newValues);
              otpCodeChanged(newValues.join(''));

              if (text.length === 0 || text.length >= 1 || text.length === 6) {
                if (text.length === 6) {
                  applyOTPCodeToInputs(text);
                  return;
                }
                if (text.length >= 1 && index !== NUMBER_OF_INPUTS - 1) {
                  const nextInput = inputsRef.current[index + 1];
                  if (nextInput) {
                    nextInput.focus();
                  }
                }
              }
            }}
            onKeyPress={event => {
              if (event.nativeEvent.key === 'Backspace') {
                if (values[index]) {
                  const newValues = [...values];
                  newValues[index] = '';
                  setValues(newValues);
                }
                // backward:
                if (index !== 0) {
                  const previousInput = inputsRef.current[index - 1];
                  if (previousInput) {
                    previousInput.focus();
                    return;
                  }
                }
              }
            }}
            onFocus={_ => {
              focusedIndex.value = index;
            }}
          />
        );
      })}
      <Animated.View style={[styles.bottomLine, translateX]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  textInput: {
    width: inputWidth - 20,
    aspectRatio: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#f3f3f3',
  },
  bottomLine: {
    width: inputWidth - 20,
    height: 2,
    backgroundColor: '#446DF2',
    position: 'absolute',
    bottom: 0,
    opacity: 0.5,
  },
});
