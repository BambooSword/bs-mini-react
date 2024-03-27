import React from './core/React.js'
function Counter({ num }) {
  function handleClick() {
    console.log('hello world')
  }
  return (
    <div>
      counter: {num}
      <button onClick={() => console.log('hello world')}> button</button>
    </div>
  )
}

function App() {
  return (
    <div id="app">
      hello world
      <Counter num={1} />
      <Counter num={2} />
      <Counter num={3} />
    </div>
  )
}
console.log('====================================')
console.log(App, '==========')
console.log('====================================')
export default App
