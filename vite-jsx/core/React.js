function createTextEl(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      children: [],
      nodeValue: text,
    },
  }
}
function createElement(el, props, ...children) {
  return {
    type: el,
    props: {
      ...props,
      children: children.map(child => {
        return typeof child === 'string' ? createTextEl(child) : child
      }),
    },
  }
}
function render(el, container) {
  console.log('🚀 ~ render ~ el, container):', el, container)
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [el],
    },
  }
}
let nextUnitOfWork = null
function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)
function performUnitOfWork(work) {
  // 1. 处理dom
  if (!work.dom) {
    const dom = (work.dom =
      work.type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(work.type))

    work.parent.dom.append(dom)
    // 2. 处理 props
    work.props &&
      Object.keys(work.props).forEach(key => {
        if (key !== 'children') dom[key] = work.props[key]
      })
  }

  // 3. 转换链表，设置好指针
  const children = work.props.children
  children.forEach((child, index) => {
    const newWork = {
      type: child.type,
      props: child.props,
      child: null,
      parent: work,
      sibling: null,
      dom: null,
    }
    if (index === 0) {
      work.child = newWork
    } else {
      children[index - 1].sibling = newWork
    }
  })

  // 4. 返回下一个工作单元
  if (work.child) {
    return work.child
  }

  if (work.sibling) {
    return work.sibling
  }
  return work.parent?.sibling
}

const React = {
  render,
  createElement,
}
export default React
