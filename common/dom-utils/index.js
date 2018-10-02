export function getElementAbsoluteLeft (element) {
  // doc: https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/offsetLeft
  if (!element) {
    return 0
  }
  let currentElementActualLeft = element.offsetLeft
  return currentElementActualLeft + getElementAbsoluteLeft(element.offsetParent)
}

export function getElementAbsoluteTop (element) {
  if (!element) {
    return 0
  }
  let currentElementActualTop = element.offsetTop
  return currentElementActualTop + getElementAbsoluteTop(element.offsetParent)
}

export function getElementRelativeLeft (element) {
  return getElementAbsoluteLeft(element) - document.documentElement.scrollLeft
}

export function getElementRelativeTop (element) {
  return getElementAbsoluteTop(element) - document.documentElement.scrollTop
}

export function getElementRelativeBottom (element) {
  return getElementRelativeTop(element) + element.clientHeight
}

export function getElementRelativeRight (element) {
  return getElementRelativeLeft(element) + element.clientWidth
}
