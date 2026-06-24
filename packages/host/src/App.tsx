import React from 'react';
import {StyleSheet, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import RNBootSplash from 'react-native-bootsplash';
import {NavigationContainer} from '@react-navigation/native';
import {vars} from 'nativewind';
import MainNavigator from './navigation/MainNavigator';

// host's brand color — set at the host root. Mini-apps override --color-brand*
// within their own subtree, so this only applies to host-owned screens.
// Every shade is set so the whole `brand-50`..`brand-900` ramp resolves here.
const hostTheme = vars({
  '--color-brand-50': '#e6f2ff',
  '--color-brand-100': '#cee6ff',
  '--color-brand-200': '#9dceff',
  '--color-brand-300': '#6cb5ff',
  '--color-brand-400': '#3b9dff',
  '--color-brand-500': '#0a84ff',
  '--color-brand-600': '#086acc',
  '--color-brand-700': '#064f99',
  '--color-brand-800': '#043566',
  '--color-brand-900': '#021a33',
});

const App = () => {
  return (
    <GestureHandlerRootView style={styles.root}>
      {/* vars() must sit on a core RN component (View) — NativeWind does NOT
          instrument GestureHandlerRootView, so a CSS var set there is dropped. */}
      <View style={[styles.root, hostTheme]}>
        <BottomSheetModalProvider>
          <NavigationContainer onReady={() => RNBootSplash.hide({fade: true})}>
            <MainNavigator />
          </NavigationContainer>
        </BottomSheetModalProvider>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
