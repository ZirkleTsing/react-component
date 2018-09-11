import "babel-polyfill"
import React from 'react'
import ReactDOM from 'react-dom'
import App from './lib/tab'
// import { BrowserRouter } from 'react-router-dom'

const root = document.getElementById('root')

const render = (Component) => {
  ReactDOM.render(
    <div><Component /></div>,
    root
  )
}

render(App)
if(module.hot) {
  module.hot.accept('./index.js', function() {
    const NextApp = require('./lib/tab/index.js').default
    render(NextApp)
  })
}