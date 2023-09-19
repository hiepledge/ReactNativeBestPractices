import {DateTime, type PossibleDaysInMonth} from 'luxon';
import type {calendarData, weekData} from '../types/interfaces';

export default class DateServ {
  private static instance: DateServ;

  /**
   * singleton handler
   * @returns {DateServ} the single instance of `DateServ`
   */
  public static getInstance(): DateServ {
    if (typeof DateServ.instance === 'undefined') {
      DateServ.instance = new DateServ();
    }
    return DateServ.instance;
  }

  /**
   * generate an array containing all the day for a given month and year
   * @param {number} month the month number, 0 based
   * @param {number} year the year, not zero based, required to account for leap years
   * @returns {Date[]} list with date objects for each day of the month
   */
  public getDaysInMonth(month: number, year: number): DateTime[] {
    const date: DateTime = DateTime.local(year, month);
    const daysInMonth: PossibleDaysInMonth | undefined = date.daysInMonth; // e.g 30 in number format

    // return an array containing dateTime object
    return Array.from(Array(daysInMonth), (_, x: number) => {
      return DateTime.local(year, month, x + 1);
    });
  }

  /**
   * complete an array of date with the missing date of the previous month
   * e.g. : you have the first week of a month but the week, start on wednesday, the function add monday and tuesday
   * @param {weekData} data the array you want to clean-up
   * @param {number} currentYear the current year
   * @param {number} currentMonth the current month
   * @returns {weekData} the update arrays, if needed
   */
  public prependMissingDay(
    data: weekData,
    currentYear: number,
    currentMonth: number,
  ): weekData {
    if (data.length === 7) {
      return data;
    } // if the week is full, no needs

    const numberOfMissingDay: number = 7 - data.length;
    let m = currentMonth - 1; // in most case we want the previous month
    let y = currentYear; // for the current year
    if (currentMonth === 1) {
      // if the current month is january
      m = 12;
      y = currentYear - 1;
    }

    const numberOfDayInThePreviousMonth = DateTime.local(y, m).daysInMonth;
    // add the missing day
    if (numberOfDayInThePreviousMonth !== undefined) {
      for (let i: number = 0; i < numberOfMissingDay; i++) {
        data = [
          {
            date: DateTime.local(y, m, numberOfDayInThePreviousMonth - i),
            isToday: false,
            isPressed: false,
          },
          ...data,
        ];
      }
    }

    return data;
  }

  /**
   * complete an array of date with the missing date of the next month
   * e.g. : you have the last week of a month but the week, end on friday, the function add saturday and sunday
   * @param {weekData} data the array you want to clean-up
   * @param {number} currentYear the current year
   * @param {number} currentMonth the current month
   * @returns {weekData} the update arrays, if needed
   */
  public appendMissingDay(
    data: weekData,
    currentYear: number,
    currentMonth: number,
  ): weekData {
    if (data.length === 7) {
      return data;
    } // if the week is full, no needs

    const numberOfMissingDay: number = 7 - data.length;
    let m = currentMonth + 1; // in most case we want the next month
    let y = currentYear; // for the current year
    if (currentMonth === 12) {
      //  if the current month is december
      m = 1;
      y = currentYear + 1;
    }

    // add the missing day
    for (let i: number = 0; i < numberOfMissingDay; i++) {
      data = [
        ...data,
        {
          date: DateTime.local(y, m, 1 + i),
          isToday: false,
          isPressed: false,
        },
      ];
    }

    return data;
  }

  /**
   * generate an array containing all the day for a given month and year split by week
   * SET `isToday` FOR THE RIGHT DATE
   * @param {number} month the month number, 0 based
   * @param {number} year the year, not zero based, required to account for leap years
   * @param {boolean} complete default to true, if you want to complete the first and last week, for having seven days in each week
   * @returns {calendarData} list with date objects for each day of the month
   */
  public getDaysInMonthSplitByWeek(
    month: number,
    year: number,
    complete: boolean = true,
  ): calendarData {
    const dayInMonth: DateTime[] = this.getDaysInMonth(month, year);
    const result: calendarData = [];
    let tempArray: weekData = [];
    // create the data for the current month
    dayInMonth.reduce(
      (
        previousValue: DateTime,
        currentValue: DateTime,
        currentIndex: number,
      ) => {
        // compare two string without the hours
        const isToday: boolean =
          currentValue.toLocaleString(DateTime.DATE_SHORT) ===
          DateTime.local().toLocaleString(DateTime.DATE_SHORT);
        tempArray.push({date: currentValue, isToday, isPressed: isToday});
        if (
          currentValue.weekday === 7 ||
          currentIndex === dayInMonth.length - 1
        ) {
          // sunday or end of the current month
          result.push(tempArray);
          tempArray = [];
        }
        return currentValue;
      },
      dayInMonth[0],
    );

    if (complete) {
      // if the first week is less than 7 day add the previous month days
      result[0] = this.prependMissingDay(result[0], year, month);
      // if the last week is less than 7 day add the next month days
      const lastElem = result.length - 1;
      result[lastElem] = this.appendMissingDay(result[lastElem], year, month);
    }

    return result;
  }
}
