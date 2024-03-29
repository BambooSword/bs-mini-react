import React, { useState } from './core/React.js'
let props = { id: '2222' }
function Counter({ num }) {
  const [count, setCount] = useState(0)
  const [showBar, setShowBar] = useState(false)
  const foo = (
    <div>
      foo
      <div>child1</div>
      <div>child2</div>
    </div>
  )
  const bar = <div>bar</div>
  function handleShowBar() {
    setShowBar(false)
  }
  function handleClick() {
    props = {}
    setCount(() => count + 1)
    setShowBar(true)
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
