import "babel-polyfill"
import React from 'react'
import ReactDOM from 'react-dom'
import App from './lib/App.js'
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
  module.hot.accept('./lib/App.js', function() {
    const NextApp = require('./lib/App.js').default
    render(NextApp)
  })
}