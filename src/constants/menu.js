import React from 'react';

export function createTree(dataList) {

}


export function removeChildren(tree) {
  for (let i = 0; i < tree.length; i++) {
    // console.log(tree[i]);
    if (tree[i].children && tree[i].children.length === 0) {
      tree[i].children = undefined;
    } else if(tree[i].children && tree[i].children instanceof Array) {
      removeChildren(tree[i].children)
    }
  }
  return tree;
}
