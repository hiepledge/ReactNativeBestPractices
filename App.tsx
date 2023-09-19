import React, {useRef, useState} from 'react';
import {Button, SafeAreaView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AnimatedBottomSheet from './src/components/animated-bottom-sheet/animated-bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import RowCalendar from './src/components/row-calendar/row-calendar';

const generateDays = () => {
  const days = [];
  for (let i = 1; i <= 31; i++) {
    days.push(i.toString());
  }
  return days;
};

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const generateYears = () => {
  const years = [];
  const currentYear = new Date().getFullYear();
  const yearsRange = 20; // Change this number to adjust the range
  const startYear = currentYear - Math.floor(yearsRange / 2);

  for (let i = startYear; i <= currentYear + Math.ceil(yearsRange / 2); i++) {
    years.push(i.toString());
  }
  return years;
};

function App() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (__DEV__) {
    const ref = useRef(0);
    ref.current += 1;
    console.log('App', 'render: ', ref.current);
  }

  //
  // const datePickerRef = useRef<Animated.FlatList<any>>();
  // const monthPickerRef = useRef<Animated.FlatList<any>>();
  // const yearPickerRef = useRef<Animated.FlatList<any>>();
  //
  // const initYears = useMemo(() => generateYears(), []);
  // const initMonths = useMemo(() => months, []);
  // const initDays = useMemo(() => generateDays(), []);
  //
  // const currentYearIndex = useMemo(
  //   () =>
  //     initYears.findIndex(item => item === new Date().getFullYear().toString()),
  //   [initYears],
  // );
  //
  // const currentMonthIndex = useMemo(
  //   () => initMonths.findIndex((_, index) => index === new Date().getMonth()),
  //   [initMonths],
  // );
  // const currentDayIndex = useMemo(
  //   () => initDays.findIndex(item => item === new Date().getDate().toString()),
  //   [initDays],
  // );
  //
  // function datePickerGoToIndex(index: number, isAnimated: boolean): void {
  //   if (datePickerRef.current === undefined || index === -1) {
  //     return;
  //   }
  //   datePickerRef.current.scrollToIndex({index, animated: isAnimated});
  // }
  //
  // function monthPickerGoToIndex(index: number, isAnimated: boolean): void {
  //   if (monthPickerRef.current === undefined || index === -1) {
  //     return;
  //   }
  //   monthPickerRef.current.scrollToIndex({index, animated: isAnimated});
  // }
  //
  // function yearPickerGoToIndex(index: number, isAnimated: boolean): void {
  //   if (yearPickerRef.current === undefined || index === -1) {
  //     return;
  //   }
  //   yearPickerRef.current.scrollToIndex({index, animated: isAnimated});
  // }
  //
  // function wait(): Promise<void> {
  //   return new Promise(resolve => {
  //     setTimeout(() => {
  //       resolve();
  //     }, 100);
  //   });
  // }
  //
  // async function onSetInitDMY() {
  //   await wait();
  //   yearPickerGoToIndex(currentYearIndex, true);
  //   monthPickerGoToIndex(currentMonthIndex, true);
  //   datePickerGoToIndex(currentDayIndex, true);
  // }
  //
  // useEffect(() => {
  //   onSetInitDMY();
  // }, []);

  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: 'white'}}>
      <NavigationContainer>
        <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
          {/*<LayoutAnimation />*/}
          {/*<RowCalendar />*/}
          {/*<OTPInput*/}
          {/*  otpCodeChanged={otpCode => {*/}
          {/*    // console.log(otpCode);*/}
          {/*  }}*/}
          {/*/>*/}
          {/*<View*/}
          {/*  style={{*/}
          {/*    flexDirection: 'row',*/}
          {/*    width: '100%',*/}
          {/*    justifyContent: 'space-around',*/}
          {/*    backgroundColor: '#f3f3f3',*/}
          {/*  }}>*/}
          {/*<Picker*/}
          {/*  // ref={datePickerRef}*/}
          {/*  itemHeight={50}*/}
          {/*  items={generateDays()}*/}
          {/*  onIndexChange={() => {}}*/}
          {/*/>*/}
          {/*<Picker*/}
          {/*  // ref={monthPickerRef}*/}
          {/*  itemHeight={50}*/}
          {/*  items={months}*/}
          {/*  onIndexChange={() => {}}*/}
          {/*/>*/}
          {/*  <Picker*/}
          {/*    ref={yearPickerRef}*/}
          {/*    itemHeight={50}*/}
          {/*    items={generateYears()}*/}
          {/*    onIndexChange={() => {}}*/}
          {/*  />*/}
          {/*</View>*/}
          {/*<AnimatedTypingTexts />*/}
          <Button
            title="open"
            onPress={() => setIsOpen(prevState => !prevState)}
          />
          <AnimatedBottomSheet
            isOpen={isOpen}
            backdropOnPress={() => setIsOpen(prevState => !prevState)}>
            <RowCalendar />
          </AnimatedBottomSheet>
        </SafeAreaView>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
