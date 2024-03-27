import React from './core/React.js'
let count = 10
let props = { id: '2222' }
function Counter({ num }) {
  function handleClick() {
    console.log('hello world')
    count++
    props = {}
    React.update()
  }
  return (
    <div {...props}>
      counter: {count} {num}
      <button onClick={handleClick}> button</button>
    </div>
  )
}

function App() {
  return (
    <div id="app">
      hello world
      <Counter num={1} />
    </div>
  )
}
console.log('====================================')
console.log(App, '==========')
console.log('====================================')
export default App
