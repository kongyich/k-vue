import { isTracking, trackEffects } from "./effect";
import { hasChanged, isObject } from "../shared/index"
import { reactive } from "./reactive";

// ref 均为单指
// proxy只能处理对象，所以将单值包裹为对象进行处理
// {} -> value get set
class RefImpl {
  private _value: any;
  public dep
  public _rawValue: any
  constructor(value) {
    // 处理比较的时候一个为原始对象，一个为proxy
    this._rawValue = value

    // value -> reactive
    this._value = convert(value)
    this.dep = new Set()
  }

  get value() {
    trackRefValue(this)
    
    return this._value
  };
  set value(newValue) {

    if(hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue
      this._value = convert(newValue)
      triggerEffects(this.dep)
    }
  }
}

const convert = function(value) {
  return isObject(value) ? reactive(value) : value
}

export function ref(value) {
  return new RefImpl(value)
}


const trackRefValue = function(ref) {
  if(isTracking()) {
    trackEffects(ref.dep)
  }
}
