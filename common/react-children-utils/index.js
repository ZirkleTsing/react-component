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
