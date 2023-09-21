import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'mobx-react';
import {rootStore} from './src/store/root-store';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DemoScreen from './src/screens/demo-screen';
import TeamScreen from './src/screens/team-screen/team-screen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <Provider rootStore={rootStore}>
      <GestureHandlerRootView style={{flex: 1, backgroundColor: 'white'}}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="demo-screen"
            screenOptions={{headerShown: false}}>
            <Stack.Screen name={'demo-screen'} component={DemoScreen} />
            <Stack.Screen name={'team-screen'} component={TeamScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  );
}

export default App;
