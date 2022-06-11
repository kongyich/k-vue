import { extend } from "../shared/index"
let activeEffect;
let shouldTrack


export class ReactiveEffect{
  private _fn: any;
  deps = [];
  active = true;
  onStop?: ()=>void;
  // shouldTrack = true
  constructor(fn, public scheduler?) {
    this._fn = fn
  }

  run() {

    if(!this.active) {
      return this._fn()
    }
    // 收集effect执行时的实例


    shouldTrack = true

    activeEffect = this
    let res = this._fn()
    shouldTrack = false

    // runner方法，处理接受函数返回值
    return res
  }

  stop() {
    // 防止重复执行
    if(this.active) {
      cleanupEffect(this)
      if(this.onStop) {
        this.onStop()
      }
      this.active = false
    }
    
  }
}

const cleanupEffect = function(effect) {
  effect.deps.forEach(dep => {
    dep.delete(effect)
  })
  effect.deps.length = 0
}

// 定义全局map对象
const targetMap = new Map()


export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}

// 存储对象的层级关系
// all: {
//   target: {
//     key: []
//   }
// }
// 收集依赖
export const track = function(target, key) {
   if(!isTracking()) return


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

  trackEffects(dep)
  
}

export const trackEffects = function(dep) {
  // 判断是否已经存在
  if(dep.has(activeEffect)) return
  // 查找target中最底层的key的set，存储实例对象
  dep.add(activeEffect)

  // 收集所有dep，准备删除
  activeEffect.deps.push(dep)
}




// 触发依赖
export const trigger = function(target, key) {
  // 查找第一层
  let depsMap = targetMap.get(target)
  // 查找第二层
  let dep = depsMap.get(key)

  triggerEffects(dep)
}

export const triggerEffects = function(dep) {
  // 循环遍历执行所有收集的实例
  for(const effect of dep) {
    // 处理scheduler
    if(effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
    
  }
};



// 定义effect执行时的实例

export const effect = function(fn, options = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)

  // Object.assign(_effect, options)
  // onStop方法，执行stop时执行
  extend(_effect, options)
  // 执行run方法来执行用户传入的函数
  _effect.run() 

  // 处理指针问题
  const runner = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

export const stop = function(runner) {
  runner.effect.stop()
}
