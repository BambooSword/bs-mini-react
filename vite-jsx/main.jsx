import ReactDom from './core/ReactDom.js'
import React from './core/React.js'
import App from './App.jsx'

ReactDom.createRoot(document.querySelector('#root')).render(<App></App>)
