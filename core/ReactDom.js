import React from './react.js'
const ReactDom = {
  createRoot: function (container) {
    return {
      render: function (el) {
        React.render(el, container)
      },
    }
  },
}

export default ReactDom
