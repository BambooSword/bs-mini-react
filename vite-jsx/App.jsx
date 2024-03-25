import React from './core/React.js'
function Counter() {
  return <div> counter: text</div>
}

const App = (
  <div id="app">
    hello world
    <Counter />
    <Counter />
    <Counter />
  </div>
)
console.log('====================================')
console.log(App, '==========')
console.log('====================================')
export default App
