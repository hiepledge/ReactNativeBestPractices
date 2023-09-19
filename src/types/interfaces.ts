import {type DateTime} from 'luxon';
import {type ViewToken} from 'react-native';
import {type feelingEnum, type perceivedExertionEnum} from './enum';

export type Token = string | undefined;

export interface AxsCallError {
  message: string;
  inError: boolean;
}

export interface FormError {
  formError: string;
}

export interface InputState {
  value: string;
  onError: boolean;
  errorMessage?: string;
}

export interface LoginForm extends FormError {
  email: InputState;
  password: InputState;
}

export interface AuthCtx {
  signIn: (token: string, callbackError: () => void) => void;
  signOut: (callbackError: () => void) => void;
}

export interface dayData {
  date: DateTime;
  isToday: boolean;
  isPressed: boolean; // only for certain case, when the day is a button or a pressable
  trainingData?: undefined; // todo
}

export type weekData = dayData[];

export type calendarData = weekData[];

export interface onViewableItemsChangedInfo {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

export interface pressedDayCoordinate {
  weekIndex: number;
  dayIndex: number;
}

export interface RowCalendarProps {
  readUserPressedDate: (dayData: dayData) => void;
}

export interface tabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}

export interface workoutListProps {
  dayData: dayData;
}

export interface workout {
  owner: number;
  trainingType: number;
  name: string;
  date: string;
  plannedDistance?: number;
  plannedDuration?: number;
  plannedPace?: number;
  plannedCalorie?: number;
  distance?: number;
  duration?: number;
  pace?: number;
  calorie?: number;
  note?: string;
  postActivityNote?: string;
  perceivedExertion?: perceivedExertionEnum;
  feeling?: feelingEnum;
}

export interface ErrorMessageProps {
  condition: boolean;
  text: string;
}
