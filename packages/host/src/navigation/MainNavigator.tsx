import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabsNavigator from './TabsNavigator';
import NewsScreen from '../screens/NewsScreen';
import BookingScreen from '../screens/BookingScreen';

export type MainStackParamList = {
  Tabs: undefined;
  News: undefined;
  Booking: undefined;
};

const Main = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  return (
    <Main.Navigator screenOptions={{headerShown: false}}>
      <Main.Screen name="Tabs" component={TabsNavigator} />
      <Main.Screen name="News" component={NewsScreen} />
      <Main.Screen name="Booking" component={BookingScreen} />
    </Main.Navigator>
  );
};

export default MainNavigator;
