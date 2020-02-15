import React from 'react';
import { Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import logo from './assets/instagram.png';

import Feed from './pages/Feed';

const Routes = createAppContainer(
  createStackNavigator({
    Feed: {
      screen: Feed,
      navigationOptions: {
        title: 'Feed'
      }
    }
  }, {
    defaultNavigationOptions: {
      headerTitleAlign: 'center',
      headerTitle: <Image source={logo}/>,
      // headerTintColor: '#222',
      headerBackTitleVisible: false,
      headerStyle: {
        backgroundColor: '#F5F5F5',
      }
    }
  })
);

export default Routes;
