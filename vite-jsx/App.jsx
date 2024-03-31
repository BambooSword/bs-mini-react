import React, { useState, useEffect } from './core/React.js'

import List from './component/list.jsx'
import ListHead from './component/listHead.jsx'
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
  useEffect(() => {
    console.log('hi, useEffect only once')
    return () => {
      console.log('cleanup 0')
    }
  }, [])
  useEffect(() => {
    console.log('hi, useEffect')
    return () => {
      console.log('cleanup 1')
    }
  }, [count])
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
  const [listItems, setListItems] = useState([])
  const update = React.update()
  function handleClick() {
    console.log('hello world')
    update()
  }
  function handleAdd(itemText) {
    setListItems([...listItems, { id: listItems.length, text: itemText }])
  }
  function removeItem(id) {
    setListItems(listItems.filter(item => item.id !== id))
  }
  return (
    <div id="app">
      <h1>to do list</h1>
      <ListHead setItem={handleAdd} />
      <List items={listItems} removeItem={removeItem} />

      {/* <Counter num={1} /> */}
    </div>
  )
}
console.log('====================================')
console.log(App, '==========')
console.log('====================================')
export default App
