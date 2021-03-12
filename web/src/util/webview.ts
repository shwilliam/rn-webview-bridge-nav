declare global {
  interface Window {
    WebViewBridge?: {
      send: (message: string) => void
      onMessage: (data: JSON) => void
      ready: boolean
    }
  }
}

export const sendMessage = (message: any) => {
  if (window.WebViewBridge) window.WebViewBridge.send(JSON.stringify(message))
  else
    window.addEventListener(
      'WebViewBridge',
      () => window.WebViewBridge?.send(JSON.stringify(message)),
      { once: true },
    )
}

const initBridge = (onMessage?: (data: JSON) => void) => {
  if (!window.WebViewBridge) return
  if (onMessage) window.WebViewBridge.onMessage = onMessage
  window.WebViewBridge.ready = true
  const event = new Event('WebViewBridgeReady')
  window.dispatchEvent(event)
}

export const initListener = (onMessage?: (data: JSON) => void) => {
  if (window.WebViewBridge) initBridge(onMessage)
  else
    window.addEventListener('WebViewBridge', () => initBridge(onMessage), {
      once: true,
    })
}
