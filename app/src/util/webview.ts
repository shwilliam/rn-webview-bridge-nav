export const injectedJavaScript = `(function() {
  if (!window.WebViewBridge) {
    window.WebViewBridge = {
      onMessage: function() {
        return null;
      },
      send: function(data) {
        window.ReactNativeWebView.postMessage(data);
      },
      ready: false
    };
    var event = new Event('WebViewBridge');
    window.dispatchEvent(event);
  }
})()`

export const generateOnMessageFunction = (data: any) =>
  `(function() {
    var sendMessage = function() {
      window.WebViewBridge.onMessage(${JSON.stringify(data)});
    };
    if (window.WebViewBridge && window.WebViewBridge.ready) {
      sendMessage();
    } else {
      window.addEventListener('WebViewBridgeReady', sendMessage, {once: true});
    }
  })()`
