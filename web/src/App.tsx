import React, {useEffect} from 'react'
import {Switch, Route, Link, useHistory, useLocation} from 'react-router-dom'

import {initListener, sendMessage} from './util/webview'

function App() {
  const location = useLocation(),
    history = useHistory()

  useEffect(() => {
    initListener((data: any) => {
      if (
        data.action === 'HISTORY_PUSH' &&
        data.path &&
        data.path !== location.pathname
      )
        history.push(data.path)
    })
  }, [history, location.pathname])

  useEffect(() => {
    sendMessage({
      action: 'HISTORY_PUSH',
      path: location.pathname,
    })
  }, [location])

  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route path="/about/more">
          <h1>More about</h1>
        </Route>
        <Route path="/about">
          <h1>About</h1>
          <Link to="/about/more">More about</Link>
        </Route>
        <Route path="/">
          <h1>Home</h1>
        </Route>
      </Switch>
    </>
  )
}

export default App
