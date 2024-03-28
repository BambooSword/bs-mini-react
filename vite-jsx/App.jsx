import React from './core/React.js'
let count = 10
let props = { id: '2222' }
let showBar = false
function Counter({ num }) {
  const foo = (
    <div>
      foo
      <div>child1</div>
      <div>child2</div>
    </div>
  )
  const bar = <div>bar</div>
  function handleShowBar() {
    showBar = !showBar
    React.update()
  }
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
      {showBar && bar}
      <button onClick={handleShowBar}> showBar</button>
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
