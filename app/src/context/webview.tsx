import React, {createContext, ReactNode, useContext, useState} from 'react'

interface IWebViewContext {
  activeView: string | null
  setActiveView: (path: string) => void
  consumerState: ConsumerState
  updateConsumerState: (name: string, state: Config) => void
}

const WebViewContext = createContext<IWebViewContext>({
  activeView: null,
  setActiveView: () => {
    return
  },
  consumerState: {},
  updateConsumerState: () => {
    return
  },
})

interface Config {
  x?: number
  y?: number
  width?: number
  height?: number
}

interface ConsumerState {
  [name: string]: Config
}

export const WebViewContextProvider = ({children}: {children: ReactNode}) => {
  const [activeView, setActiveView] = useState<any>(),
    [consumerState, setConsumerState] = useState<ConsumerState>({}),
    updateConsumerState = (name: string, state: Config) =>
      setConsumerState(prev => ({
        ...prev,
        [name]: prev
          ? {
              ...prev[name],
              ...state,
            }
          : state,
      }))

  return (
    <WebViewContext.Provider
      value={{
        activeView,
        setActiveView,
        consumerState,
        updateConsumerState,
      }}
    >
      {children}
    </WebViewContext.Provider>
  )
}

export const useWebViewContext = () => useContext(WebViewContext)
