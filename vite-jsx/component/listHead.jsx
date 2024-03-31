import React from '../core/React.js'

export default function listHead({ setItem }) {
  const [listItem, setListItem] = React.useState([])
  function handleInput(e) {
    console.log('====================================')
    console.log(e)
    console.log('====================================')
    e.preventDefault()
    const thing = e.target.value
    console.log('🚀 ~ handleSubmit ~ thing:', thing)
    setListItem(thing)
  }
  function handleSubmit() {
    setItem(listItem)
    setListItem('')
  }
  return (
    <div>
      <input
        type="text"
        value={listItem}
        name="thing"
        id="thing"
        onBlur={handleInput}
      />
      <button type="button" onClick={handleSubmit}>
        Add
      </button>
    </div>
  )
}
