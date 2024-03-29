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
  wipRoot = {
    dom: container,
    props: {
      children: [el],
    },
  }
  nextUnitOfWork = wipRoot
}
function update() {
  let currentFiber = wipFiber
  return () => {
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    }
    nextUnitOfWork = wipFiber
  }
}
// work in progress
let wipRoot = null
let currentRoot = null
let nextUnitOfWork = null
let deletions = []
let wipFiber = null
let hookIndex = 0

function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    if (wipRoot?.sibling?.type === nextUnitOfWork?.type) {
      nextUnitOfWork = null
    }
    shouldYield = deadline.timeRemaining() < 1
  }
  if (!nextUnitOfWork && wipRoot) {
    commitRoot(wipRoot)
  }
  requestIdleCallback(workLoop)
}
function commitRoot() {
  deletions.forEach(commitDeletion)
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
  deletions = []
}

function commitDeletion(fiber) {
  if (fiber.dom) {
    fiber.dom.remove()
  } else {
    commitDeletion(fiber.child)
  }
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

function reconcileChildren(fiber, children) {
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
      if (child) {
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
        oldFiber.effectTag = 'deletion'
        deletions.push(oldFiber)
      }
    }
    if (oldFiber) {
      // 移动指针,处理多个child的情况
      oldFiber = oldFiber.sibling
    }
    if (index === 0) {
      fiber.child = newFiber
    } else {
      console.log('🚀 ~ children.forEach ~ prevSibling:', prevSibling)
      prevSibling.sibling = newFiber
    }
    if (!newFiber) console.log('newFiber', newFiber)
    if (newFiber) prevSibling = newFiber
  })
  while (oldFiber) {
    deletions.push(oldFiber)
    oldFiber = oldFiber.sibling
  }
}
function updateFunctionComponent(fiber) {
  wipFiber = fiber
  wipFiber.hooks = []
  hookIndex = 0
  const children = [fiber.type(fiber.props)]
  // 3. 转换链表，设置好指针
  reconcileChildren(fiber, children)
}

function updateHostComponent(fiber) {
  // 1. 处理dom
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type))

    // fiber.parent.dom.append(dom)
    // 2. 处理 props
    updateProps(dom, fiber.props)
  }
  reconcileChildren(fiber, fiber.props.children)
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

function useState(initState) {
  let oldHook = wipFiber.alternate?.hooks?.[hookIndex]
  const hook = {
    state: oldHook ? oldHook.state : initState,
    queue: [],
  }
  const actions = oldHook ? oldHook.queue : []
  actions.forEach(action => {
    hook.state = action(hook.state)
  })
  const setState = action => {
    const eagerState =
      typeof action === 'function' ? action(hook.state) : action
    if (eagerState === hook.state) return
    hook.queue.push(typeof action === 'function' ? action : () => action)
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    }
    nextUnitOfWork = wipRoot
  }
  wipFiber.hooks.push(hook)
  hookIndex++
  return [hook.state, setState]
}
const React = {
  update,
  render,
  useState,
  createElement,
}
export default React
export { createElement, render, useState, update }
