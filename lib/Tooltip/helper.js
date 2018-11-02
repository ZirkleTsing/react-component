/**
 * 一个单例模式，所有Tooltip拿到helper后管理5个dom的分配
 * 使用之前申请Dom，使用完毕后注销Dom
 */
let instance

export function init () {
  if (!instance) {
    instance = new Helper()
  }
  return instance
}

class Helper {
  constructor () {
    // 构造5个dom节点备用
    this.domNum = 5
    this.doms = Array(this.domNum).fill({
      el: null,
      isUsed: false
    })
    this.doms.forEach(i => {
      // i.el = react.cloneDom
      // i.el = React.cloneElement(Animate, {
      //   appendChild: 
      // })
    })
    this.lastUseIndex = 0
  }

  getDom () {
    // 获取一个闲置的dom节点，如果没有闲置则返回null
    let i = 0
    while (i <= this.domNum) {
      const dom = this.getNextDom()
      if (dom.isUsed) {
        i++
        continue
      } else {
        dom.isUsed = true
        return dom.el
      }
    }
    return null
  }

  getNextDom () {
    this.lastUseIndex = this.lastUseIndex + 1 < this.domNum ? this.lastUseIndex : 0
    return this.doms[this.lastUseIndex]
  }

  getBackDom (dom) {
    // 放回节点，设置该节点为闲置
    this.doms.find(i => i.el === dom).isUsed = false
  }
}
