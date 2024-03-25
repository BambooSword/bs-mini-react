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
  root = nextUnitOfWork
}
let root = null
let nextUnitOfWork = null
function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  if (!nextUnitOfWork && root) {
    commitRoot(root)
  }
  requestIdleCallback(workLoop)
}
function commitRoot(root) {
  commitWork(root.child)
  root = null
}
function commitWork(fiber) {
  if (!fiber) {
    return
  }
  let parentFiber = fiber.parent
  // while (!parentFiber.dom) {
  //   parentFiber = parentFiber.parent
  // }
  parentFiber.dom.append(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
requestIdleCallback(workLoop)
function createDom(type) {
  return type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(type)
}

function updateProps(dom, props) {
  Object.keys(props).forEach(key => {
    if (key !== 'children') dom[key] = props[key]
  })
}

function initChildren(fiber) {
  const children = fiber.props.children
  let prevSibling = null
  children.forEach((child, index) => {
    const newWork = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    }
    if (index === 0) {
      fiber.child = newWork
    } else {
      prevSibling.sibling = newWork
    }
    prevSibling = newWork
  })
}
function performUnitOfWork(fiber) {
  // 1. 处理dom
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type))

    // fiber.parent.dom.append(dom)
    // 2. 处理 props
    updateProps(dom, fiber.props)
  }

  // 3. 转换链表，设置好指针
  initChildren(fiber)
  // 4. 返回下一个工作单元
  if (fiber.child) {
    return fiber.child
  }
  let fiberParent = fiber
  while (fiberParent) {
    if (fiberParent.sibling) {
      return fiberParent.sibling
    }
    fiberParent = fiberParent.parent
  }
}

const React = {
  render,
  createElement,
}
export default React
