import React from 'react';
import RNBootSplash from 'react-native-bootsplash';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigator from './navigation/MainNavigator';

const App = () => {
  return (
    <NavigationContainer onReady={() => RNBootSplash.hide({fade: true})}>
      <MainNavigator />
    </NavigationContainer>
  );
};

export default App;
