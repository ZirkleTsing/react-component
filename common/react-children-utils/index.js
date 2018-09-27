import React from 'react'

export function mapChildrenToArray (children) {
  // docs: React.Children.forEach:
  // If children is a keyed fragment or array it will be traversed
  // If children is null or undefined, returns null or undefined rather than an array.
  let ret = []
  React.Children.forEach(children, child => {
    ret.push(child)
  })
  return ret
}

export function findShownChildInChildrenByKey (children, key, showProp) {
  let ret = null
  if (children) {
    children.forEach(child => {
      if (child && child.key === key && child.props[showProp]) {
        if (ret) {
          throw new Error('two child same key in <target-component>, please checkout to make sure unique key!')
        }
        ret = child
      }
    })
  }
  return ret
}

export function findChildInChildrenByKey (children, key) {
  let ret = null
  if (children) {
    children.forEach(child => {
      if (child && child.key === key) {
        if (ret) {
          throw new Error('two child same key in <target-component>, please checkout to make sure unique key!')
        }
        ret = child
      }
    })
  }
  return ret
}

export function isSameChildren (c1, c2, showProp) {
  let same = c1.length === c2.length
  if (same) {
    c1.forEach((child, index) => {
      const comparedChildren = c2[index]
      if (child && !comparedChildren) {
        same = false
      } else if (child.key !== comparedChildren.key) {
        same = false
      } else if (showProp && child.props[showProp] !== comparedChildren.props[showProp]) {
        same = false
      }
    })
  }
  return same
}

export function mergeChildren (prev, next) {
  let ret = [];

  // For each key of `next`, the list of keys to insert before that key in
  // the combined list
  const nextChildrenPending = {};
  let pendingChildren = [];
  prev.forEach((child) => {
    if (child && findChildInChildrenByKey(next, child.key)) {
      if (pendingChildren.length) {
        nextChildrenPending[child.key] = pendingChildren;
        pendingChildren = [];
      }
    } else {
      pendingChildren.push(child);
    }
  });

  next.forEach((child) => {
    if (child && nextChildrenPending.hasOwnProperty(child.key)) {
      ret = ret.concat(nextChildrenPending[child.key]);
    }
    ret.push(child);
  });

  ret = ret.concat(pendingChildren);

  return ret;
}
