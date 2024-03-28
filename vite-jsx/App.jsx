import React from './core/React.js'
let count = 10
let props = { id: '2222' }
let showBar = false
function Counter({ num }) {
  console.log('counter run')
  const update = React.update()
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
    update()
  }
  function handleClick() {
    console.log('hello world')
    count++
    props = {}
    update()
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
  console.log('app run')
  const update = React.update()
  function handleClick() {
    console.log('hello world')
    update()
  }
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
