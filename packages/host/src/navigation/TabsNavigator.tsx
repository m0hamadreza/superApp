import React from 'react';
import {createNativeBottomTabNavigator} from '@bottom-tabs/react-navigation';
import {MD3Colors} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeNavigator from './HomeNavigator';
import ServicesNavigator from './ServicesNavigator';

export type TabsParamList = {
  HomeNavigator: undefined;
  ServicesNavigator: undefined;
};

const homeIcon = Icon.getImageSourceSync('home', 24);
const compassIcon = Icon.getImageSourceSync('compass', 24);

const Tabs = createNativeBottomTabNavigator<TabsParamList>();

const TabsNavigator = () => {
  return (
    <Tabs.Navigator
      translucent={false}
      tabBarActiveTintColor={MD3Colors.primary50}
      tabBarInactiveTintColor={MD3Colors.primary20}>
      <Tabs.Screen
        name="HomeNavigator"
        component={HomeNavigator}
        options={{
          title: 'Home',
          tabBarIcon: () => homeIcon,
        }}
      />
      <Tabs.Screen
        name="ServicesNavigator"
        component={ServicesNavigator}
        options={{
          title: 'Services',
          tabBarIcon: () => compassIcon,
        }}
      />
    </Tabs.Navigator>
  );
};

export default TabsNavigator;
