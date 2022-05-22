class ReactiveEffect{
  private _fn: any;
  constructor(fn) {
    this._fn = fn
  }

  run() {
    // 收集effect执行时的实例
    activeEffect = this
    this._fn()
  }
}

// 定义全局map对象
const targetMap = new Map()

// 存储对象的层级关系
// all: {
//   target: {
//     key: []
//   }
// }
// 收集依赖
export const track = function(target, key) {
  // target -> key -> dep
  let depsMap = targetMap.get(target)
  // 判断是否为第一次创建
  if(!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if(!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  // 查找target中最底层的key的set，存储实例对象
  dep.add(activeEffect)
}

// 触发依赖
export const trigger = function(target, key) {
  // 查找第一层
  let depsMap = targetMap.get(target)
  // 查找第二层
  let dep = depsMap.get(key)

  // 循环遍历执行所有收集的实例
  for(const effect of dep) {
    effect.run()
  }
}

// 定义effect执行时的实例
let activeEffect;
export const effect = function(fn) {
  const _effect = new ReactiveEffect(fn)
  // 执行run方法来执行用户传入的函数
  _effect.run() 
}
