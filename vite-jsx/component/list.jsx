import React from '../core/React.js'

export default function list({ items, removeItem }) {
  console.log('🚀 ~ list ~ items:', items)
  console.log(items)
  function remove(id) {
    console.log('removeItem')
    removeItem(id)
  }
  return (
    <div>
      list - - - items
      {...items.map((item, index) => (
        <div key={index}>
          {item.text}
          <button type="button" onClick={() => remove(item.id)}>
            removeItem
          </button>
        </div>
      ))}
    </div>
  )
}
