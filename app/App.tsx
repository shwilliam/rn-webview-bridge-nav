import React from 'react'
import {SafeAreaView, StatusBar} from 'react-native'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

import webViewScreens, {MasterWebView} from './src/screens/webview'
import {WebViewContextProvider} from './src/context/webview'

const Stack = createStackNavigator(),
  Tab = createBottomTabNavigator()

const AboutStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="About" component={webViewScreens.About} />
    <Stack.Screen name="AboutMore" component={webViewScreens.AboutMore} />
  </Stack.Navigator>
)

const Router = () => (
  <SafeAreaView style={{flex: 1}}>
    <Tab.Navigator>
      <Tab.Screen name="Home" component={webViewScreens.Home} />
      <Tab.Screen name="About" component={AboutStack} />
    </Tab.Navigator>
  </SafeAreaView>
)

const App = () => (
  <NavigationContainer>
    <WebViewContextProvider>
      <StatusBar barStyle="dark-content" />
      <Router />
      <MasterWebView />
    </WebViewContextProvider>
  </NavigationContainer>
)

export default App
