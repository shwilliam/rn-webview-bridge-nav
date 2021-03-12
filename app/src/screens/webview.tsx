import React, {ComponentType, useEffect, useLayoutEffect, useRef} from 'react'
import {View, LayoutChangeEvent} from 'react-native'
import {useFocusEffect, useNavigation} from '@react-navigation/native'
import {WebView} from 'react-native-webview'

import {useWebViewContext} from '../context/webview'
import {generateOnMessageFunction, injectedJavaScript} from '../util/webview'

const webViewPaths = {
  Home: '/',
  About: '/about',
  AboutMore: '/about/more',
}

const webViewPathNames: {
  [path: string]: string
} = Object.entries(webViewPaths).reduce(
  (acc, [name, path]) => ({
    ...acc,
    [path]: name,
  }),
  {},
)

const createWebViewScreen = (path: string) => () => {
  const ref = useRef<View | null>(null),
    {
      consumerState,
      updateConsumerState,
      setActiveView,
      activeView,
    } = useWebViewContext(),
    viewName = webViewPathNames[path],
    viewConsumerState = consumerState[webViewPathNames[path]],
    navigation = useNavigation(),
    focused = viewName === activeView,
    handleLayout = (event: LayoutChangeEvent) => {
      if (!ref.current || !focused) return

      const {
        nativeEvent: {
          layout: {width, height},
        },
      } = event

      ref.current.measureInWindow((x, y) => {
        updateConsumerState(viewName, {
          x,
          y,
          width,
          height,
        })
      })
    }

  useLayoutEffect(() => {
    if (!ref.current || !focused) return
    ref.current.measureInWindow((x, y) => {
      if (viewConsumerState?.x === x && viewConsumerState.y === y) return
      setTimeout(() => {
        updateConsumerState(viewName, {y, x})
      })
    })
  }, [viewConsumerState])

  useFocusEffect(() => {
    setActiveView(viewName)
  })

  useLayoutEffect(() => {
    console.log('layout effect: ', path)
    if (activeView) navigation.navigate(activeView)
  }, [activeView])

  if (!focused) return null
  return <View style={{flex: 1}} ref={ref} onLayout={handleLayout} />
}

const webViewScreens: {
  [screen: string]: ComponentType<any>
} = Object.entries(webViewPaths).reduce(
  (acc, [name, path]) => ({
    ...acc,
    [name]: createWebViewScreen(path),
  }),
  {},
)

export const MasterWebView = () => {
  const ref = useRef<WebView>(null),
    {activeView, setActiveView, consumerState} = useWebViewContext(),
    activeConsumerState = activeView ? consumerState[activeView] : undefined,
    activeViewPath = webViewPaths[activeView]

  useEffect(() => {
    if (!activeViewPath || !ref.current) return
    ref.current.injectJavaScript(
      generateOnMessageFunction({action: 'HISTORY_PUSH', path: activeViewPath}),
    )
  }, [activeViewPath])

  return (
    <WebView
      ref={ref}
      containerStyle={{
        position: 'absolute',
        top: activeConsumerState?.y,
        bottom: activeConsumerState?.y,
        width: activeConsumerState?.width,
        height: activeConsumerState?.height,
      }}
      injectedJavaScript={injectedJavaScript}
      source={{
        uri: 'http://localhost:3000/',
      }}
      onMessage={event => {
        const {data} = event.nativeEvent,
          dataObj = JSON.parse(data)
        if (dataObj.action === 'HISTORY_PUSH' && dataObj.path)
          setActiveView(webViewPathNames[dataObj.path])
      }}
      scrollEnabled={false}
    />
  )
}

export default webViewScreens
