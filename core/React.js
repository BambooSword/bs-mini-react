function createTextEl(text) {
  return {
    type: 'TEXT_ELEMENT',
    children: [],
    props: {
      nodeValue: text,
    },
  }
}
function createElement(el, props, ...children) {
  return {
    type: el,
    props: {
      ...props,
    },
    children: children.map(child => {
      return typeof child === 'string' ? createTextEl(child) : child
    }),
  }
}
function render(el, container) {
  const dom =
    el.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(el.type)
  el.props &&
    Object.keys(el.props).forEach(key => {
      if (key !== 'children') dom[key] = el.props[key]
    })
  el.children.forEach(child => {
    typeof child === 'string'
      ? dom.appendChild(document.createTextNode(child))
      : render(child, dom)
  })
  container.appendChild(dom)
}

const React = {
  render,
  createElement,
}
export default React
