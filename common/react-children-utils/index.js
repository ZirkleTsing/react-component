import React from 'react'

export function mapChildrenToArray(children) {
  // If children is a keyed fragment or array it will be traversed
  // If children is null or undefined, returns null or undefined rather than an array.
  let ret = []
  React.Children.forEach(children, child => {
    ret.push(child)
  })
  return ret
}

export function findShownChildInChildrenByKey(children, key, showProp) {
  let ret = null
  if (children) {
    children.forEach(child => {
      if (child && child.key === key && child.props[showProp]) {
        if (ret) {
          throw new Error('two child same key in <rc-Animate>, please checkout to make sure unique key!')
        }
        ret = child
      }
    })
  }
  return ret
}

export function findChildInChildrenByKey(children, key) {
  let ret = null
  if (children) {
    children.forEach(child => {
      if (child && child.key === key) {
        if (ret) {
          throw new Error('two child same key in <rc-Animate>, please checkout to make sure unique key!')
        }
      }
      ret = child
    })
  }
  return ret
}
