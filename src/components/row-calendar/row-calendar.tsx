import React, {
  Fragment,
  type ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import DateServ from '../../services/date';
import {DateTime, type PossibleDaysInMonth} from 'luxon';
import {
  Dimensions,
  FlatList,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeScrollPoint,
  type NativeSyntheticEvent,
  Pressable,
  type ScaledSize,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type {
  calendarData,
  dayData,
  onViewableItemsChangedInfo,
  weekData,
} from '../../types/interfaces';

const RowCalendar = (): ReactElement => {
  const windowDimensions: ScaledSize = Dimensions.get('window');
  const dayItemWidth = useRef<number>(0);
  const dateFlatList = useRef<FlatList>();
  const onViewableItemsChanged = useRef(
    (info: onViewableItemsChangedInfo): void => {
      setCurrentObjectInfo(info);
    },
  );
  const [dateData, setDateData] = useState<calendarData | undefined>(undefined);
  const [todayIndex, setTodayIndex] = useState<number>(0);
  const [currentObjectInfo, setCurrentObjectInfo] = useState<
    onViewableItemsChangedInfo | undefined
  >(undefined);
  const [flatListRefreshing, setFlatListRefreshing] = useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<DateTime>(null);

  /**
   * calculate the item dimension for one day, we want the total width split by seven day
   * load up the data for the date when the user arrived to this screen
   */
  useEffect((): void => {
    dayItemWidth.current = windowDimensions.width / 7;
    setDateData(getCurrentMonth());
  }, []);

  /**
   * calculate today index and set it up
   */
  useEffect((): void => {
    if (dateData !== undefined) {
      setTodayIndex(getTodayIndex(dateData));
    }
  }, [dateData]);

  /**
   * find the current date sub array into `calendarData`
   * @param {calendarData} dateArray date array
   * @returns {number} the index of the current week
   */
  function getTodayIndex(dateArray: calendarData): number {
    return dateArray.findIndex((item: weekData): boolean => {
      // if the checked sub object doesn't return -1 the object contain the today date
      if (item) {
        return (
          item.findIndex((subItem: dayData): boolean => {
            return subItem.isToday;
          }) !== -1
        );
      }
      return false;
    });
  }

  /**
   * render the week day
   * @returns {ReactElement} the Element itself
   */
  function generateCurrentWeek(): ReactElement[] {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
      (value: string, index: number) => {
        return (
          <View
            key={index}
            style={{
              width: dayItemWidth.current,
              borderColor: 'lightgrey',
              alignItems: 'center',
              paddingVertical: 10,
              borderBottomWidth: 0.5,
              paddingHorizontal: 5,
            }}>
            <Text lineBreakMode="middle" numberOfLines={1}>
              {value}
            </Text>
          </View>
        );
      },
    );
  }

  /**
   * get an array of date for the current month split by week
   * @returns {calendarData} array of array of luxon DateTime, each sub array is a week
   */
  function getCurrentMonth(): calendarData {
    setFlatListRefreshing(true);
    const now: DateTime = DateTime.now();
    const data = DateServ.getInstance().getDaysInMonthSplitByWeek(
      now.month,
      now.year,
    );
    setFlatListRefreshing(false);
    return data;
  }

  /**
   * get an array of date representing the month for the given date
   * @param {DateTime} date luxon date object for the month you want -- day is doesn't used
   * @returns {calendarData} array of array of luxon DateTime, each sub array is a week
   */
  function getAMonth(date: DateTime): calendarData {
    return DateServ.getInstance().getDaysInMonthSplitByWeek(
      date.month,
      date.year,
    );
  }

  /**
   * render the component for the day row for the `flatlist`
   * @param {weekData} week array luxon DateTime
   * @returns {ReactElement[]}  the Element itself
   */
  function dayComponent(week: weekData): ReactElement[] {
    return week.map((value: dayData, index: number) => {
      const isSelected = selectedDate === value.date;
      return (
        <Pressable
          onPress={() => {
            setSelectedDate(value.date);
          }}
          key={value?.date?.toString()}
          style={{
            width: dayItemWidth.current,
            backgroundColor: isSelected
              ? 'rgba(177,227,255,0.2)'
              : value.isToday
              ? 'rgba(198,199,199,0.2)'
              : 'white',
            borderColor: 'lightgrey',
            borderLeftWidth: 0.5,
          }}>
          <Text style={{textAlign: 'center', marginTop: 10}}>
            {value?.date?.day}
          </Text>
        </Pressable>
      );
    });
  }

  /**
   * check if the user is at the start of the scroll list and fetch data if so
   * @param {NativeSyntheticEvent<NativeScrollEvent>} event scroll event
   * @returns {void}
   */
  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>): void {
    // if distanceFromStart.x === 0 we reach the start of the list
    const distanceFromStart: NativeScrollPoint =
      event.nativeEvent.contentOffset;
    if (distanceFromStart.x === 0) {
      prependData();
    }
  }

  /**
   * set the given index for the flatlist
   * @param {number} index the index you want the flatlist to be
   * @param {boolean} isAnimated if you want an animated transition
   */
  function gotToIndex(index: number, isAnimated: boolean): void {
    if (dateFlatList.current !== undefined) {
      //  todo what type is used for the flatList ??
      dateFlatList.current.scrollToIndex({index, animated: isAnimated});
    }
  }

  /**
   * prepend data to `dateData`
   * @returns {void}
   */
  function prependData(): void {
    // in this function I assume that the first week is (maybe) completed (see `getDaysInMonthSplitByWeek` function)
    setFlatListRefreshing(true);
    // get the first date show to the user
    // the first [0] represent the first week, the last [0] represent monday
    if (dateData === undefined) {
      return;
    }
    const firstDate: dayData = dateData[0][0];
    // if the first date show to the user is equal to 1 we need the previous month
    // (if 1 mean that monday is the first day of the current month, so we have a no completed week)
    // otherwise we need the same month
    let previousDateData;
    if (firstDate.date.day === 1) {
      // use a new object for working (luxon date are immutable, so I use a `let` for avoiding working with a lot of unuseful `const`)
      let d: DateTime = DateTime.local(
        firstDate.date.year,
        firstDate.date.month,
        firstDate.date.day,
      );
      d = d.minus({month: 1});
      // if the date is also the first of the year we need to remove one year
      if (d.month === 1 && d.day === 1) {
        // set the date to 1 december d.year-1
        d = d.minus({year: 1});
        d = d.set({month: 12, day: 1});
      }
      previousDateData = getAMonth(d);
    } else {
      previousDateData = getAMonth(firstDate.date);
      // because `getDaysInMonthSplitByWeek` function add days into the first and last week for having a full first and last week (with 7 days)
      // we need to remove the last week of the new data because the data is already present into `dateData`
      previousDateData.pop();
    }
    // save the current index before adding any data
    // and add the new array length for having the new index
    let indexToMove: number = 0;
    if (typeof currentObjectInfo?.viewableItems[0].index === 'number') {
      indexToMove = currentObjectInfo?.viewableItems[0].index;
      indexToMove = indexToMove + previousDateData.length;
    }
    setDateData([...previousDateData, ...dateData]);
    gotToIndex(indexToMove, false);
    setFlatListRefreshing(false);
  }

  /**
   * append data to `dateData`
   * @returns {void}
   */
  function appendData(): void {
    // in this function I assume that the last week is (maybe) completed (see `getDaysInMonthSplitByWeek` function)
    setFlatListRefreshing(true);
    // get the last date show to the user, the [6] represent sunday
    if (dateData === undefined) {
      return;
    }
    const lastDate: dayData = dateData[dateData?.length - 1][6];
    // get the size of the last date month
    const lastDateMonthSize: PossibleDaysInMonth | undefined =
      lastDate.date.daysInMonth;
    // if the last date show to the user is equal to the length of the month we need the next month
    // (that mean the date is the last date of the month) otherwise we need the same month
    let nextDateData;
    if (lastDateMonthSize === lastDate.date.day) {
      // use a new object for working (luxon date are immutable, so I use a `let` for avoiding working with a lot of unuseful `const`)
      let d: DateTime = DateTime.local(
        lastDate.date.year,
        lastDate.date.month,
        lastDate.date.day,
      );
      d = d.plus({month: 1});
      // if the date is also the last of the year we need to add one year
      if (d.month === 12 && d.day === 31) {
        // set the date to 1 january d.year+1
        d = d.plus({year: 1});
        d = d.set({month: 1, day: 1});
      }
      nextDateData = getAMonth(d);
    } else {
      nextDateData = getAMonth(lastDate.date);
      // because `getDaysInMonthSplitByWeek` function add days into the first and last week for having a full first and last week (with 7 days)
      // we need to remove the first week of the new data because the data is already present into `dateData`
      nextDateData.shift();
    }
    setDateData([...dateData, ...nextDateData]);
    setFlatListRefreshing(false);
  }

  function getCurrentIndex(): number | undefined {
    if (currentObjectInfo?.viewableItems) {
      return currentObjectInfo?.viewableItems[0]?.index as number;
    }
    return undefined;
  }

  const handlePreviousOnPress = () => {
    const indexToMove = getCurrentIndex();
    if (typeof indexToMove === 'number' && indexToMove !== 0) {
      gotToIndex(indexToMove - 1, true);
    }
  };

  const handleNextOnPress = () => {
    const indexToMove = getCurrentIndex();
    if (typeof indexToMove === 'number') {
      gotToIndex(indexToMove + 1, true);
    }
  };
  return (
    <View style={{flex: 1}}>
      <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
        <TouchableOpacity
          style={{
            width: dayItemWidth.current,
            borderRightWidth: 0.5,
            borderColor: 'lightgrey',
          }}
          onPress={handlePreviousOnPress}>
          <Text style={{fontSize: 12, textAlign: 'center'}}>Previous</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              borderWidth: 1,
              margin: 10,
              borderRadius: 3,
              borderColor: 'lightgrey',
              backgroundColor: 'rgba(177,227,255,0.73)',
            }}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                padding: 10,
                borderRadius: 3,
                backgroundColor: '#ffffff',
                borderWidth: 1,
                borderColor: '#ffffff',
              }}
              onPress={() => {
                gotToIndex(todayIndex, true);
              }}>
              <Text>Today</Text>
            </TouchableOpacity>
          </View>
          {currentObjectInfo !== undefined && (
            <Text>
              {currentObjectInfo.viewableItems[0]?.item[0].date.month} -{' '}
              {currentObjectInfo.viewableItems[0]?.item[0].date.year}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={{
            width: dayItemWidth.current,
            borderLeftWidth: 0.5,
            borderColor: 'lightgrey',
          }}
          onPress={handleNextOnPress}>
          <Text style={{fontSize: 12, textAlign: 'center'}}>Next</Text>
        </TouchableOpacity>
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        {generateCurrentWeek()}
      </View>
      {dateData !== undefined ? (
        <FlatList
          ref={dateFlatList}
          refreshing={flatListRefreshing}
          horizontal={true}
          snapToAlignment={'start'}
          snapToInterval={windowDimensions.width} // set the swap on the whole elem, like so the user switch week by week
          decelerationRate={'fast'} // better feedback for the user, the ui stop on the next/previous week and not later
          data={dateData}
          initialScrollIndex={todayIndex}
          // `getItemLayout` is needed by `initialScrollIndex` to work
          getItemLayout={(
            data: calendarData | null | undefined,
            index: number,
          ): {
            length: number;
            offset: number;
            index: number;
          } => ({
            length: windowDimensions.width,
            offset: windowDimensions.width * index,
            index,
          })}
          keyExtractor={(item: weekData, index: number): string =>
            index.toString()
          }
          // for some reason the type accept only ReactElement and not ReactElement[] so I put the return into this ugly `Fragment`
          renderItem={(week: ListRenderItemInfo<weekData>): ReactElement => (
            <Fragment>{dayComponent(week.item)}</Fragment>
          )}
          // use `onScroll` to handle the data when the user reach the start
          onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>): void => {
            handleScroll(event);
          }}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            appendData();
          }}
          // 50 means that item is considered visible if it's visible for more than 50 percents
          viewabilityConfig={{itemVisiblePercentThreshold: 50}}
          onViewableItemsChanged={onViewableItemsChanged.current}
        />
      ) : (
        <></>
      )}
    </View>
  );
};

export default RowCalendar;
