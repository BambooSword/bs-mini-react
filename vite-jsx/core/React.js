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
        const isTextNode =
          typeof child === 'string' || typeof child === 'number'
        return isTextNode ? createTextEl(child) : child
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
function update(el, container) {
  console.log('🚀 ~ render ~ el, container):', el, container)
  nextUnitOfWork = {
    dom: currentRoot.dom || container,
    props: currentRoot.props || { children: [el] },
    alternate: currentRoot,
  }
  root = nextUnitOfWork
}
let root = null
let currentRoot = null
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
function commitRoot() {
  commitWork(root.child)
  currentRoot = root
  root = null
}
function commitWork(fiber) {
  if (!fiber) {
    return
  }
  let parentFiber = fiber.parent
  while (!parentFiber.dom) {
    parentFiber = parentFiber.parent
  }
  if (fiber.effectTag === 'update' && fiber.dom) {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
  } else if (fiber.effectTag === 'placement' && fiber.dom) {
    parentFiber.dom.append(fiber.dom)
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
requestIdleCallback(workLoop)
function createDom(type) {
  return type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(type)
}

function updateProps(dom, nextProps, prevProps = {}) {
  // Object.keys(props).forEach(key => {
  //   if (key.startsWith('on')) {
  //     const eventName = key.toLowerCase().substring(2)
  //     dom.addEventListener(eventName, props[key])
  //   } else {
  //     if (key !== 'children') dom[key] = props[key]
  //   }
  // })
  // 1. old 有， 新的没有，删除
  Object.keys(prevProps).forEach(key => {
    if (key === 'children') return
    if (!(key in nextProps)) {
      dom.removeAttribute(key)
    }
  })
  // 2. 新的有，old没有, 添加
  // 3. 新的有，old有，更新
  Object.keys(nextProps).forEach(key => {
    if (key === 'children') return
    if (prevProps[key] !== nextProps[key]) {
      if (key.startsWith('on')) {
        const eventName = key.toLowerCase().substring(2)
        dom.removeEventListener(eventName, prevProps[key])
        dom.addEventListener(eventName, nextProps[key])
      } else {
        dom[key] = nextProps[key]
      }
    }
  })
}

function initChildren(fiber, children) {
  let oldFiber = fiber.alternate?.child
  let prevSibling = null
  children.forEach((child, index) => {
    const isSameType = child && oldFiber && child.type === oldFiber.type
    let newFiber
    if (isSameType) {
      // UPDATE
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: oldFiber.dom,
        effectTag: 'update',
        alternate: oldFiber,
      }
    } else {
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: null,
        effectTag: 'placement',
      }
    }
    if (oldFiber) {
      // 移动指针,处理多个child的情况
      oldFiber = oldFiber.sibling
    }
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
    prevSibling = newFiber
  })
}
function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)]
  // 3. 转换链表，设置好指针
  initChildren(fiber, children)
}

function updateHostComponent(fiber) {
  // 1. 处理dom
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type))

    // fiber.parent.dom.append(dom)
    // 2. 处理 props
    updateProps(dom, fiber.props)
  }
  initChildren(fiber, fiber.props.children)
}

function performUnitOfWork(fiber) {
  const isFunctionComponent = typeof fiber.type === 'function'
  isFunctionComponent
    ? updateFunctionComponent(fiber)
    : updateHostComponent(fiber)

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
  update,
  render,
  createElement,
}
export default React
