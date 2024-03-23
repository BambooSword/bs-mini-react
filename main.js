import ReactDom from './core/ReactDom.js'
import React from './core/react.js'
const textEl = {
  children: [],
  nodeValue: 'Hello, World!!!',
}

const el = {
  type: 'div',
  props: {
    id: 'app',
  },
  children: [textEl],
}

// const dom = document.createElement(App.type)
// dom.id = App.props.id
// document.getElementById('root').appendChild(dom)

// const textDom = document.createTextNode('')
// textDom.nodeValue = App.children[0].nodeValue
// dom.appendChild(textDom)

const App = React.createElement(
  'div',
  { id: 'root' },
  'Hello, World!!!',
  '你好，世界'
)
console.log('🚀 ~ App:', App)
// render(App, document.querySelector('#root'))

ReactDom.createRoot(document.querySelector('#root')).render(App)
