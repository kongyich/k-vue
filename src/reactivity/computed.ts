import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
  private _effect;
  private _getter;
  private _dirty: boolean = true;
  private _value
  constructor(getter) {
      this._getter = getter
      this._effect = new ReactiveEffect(getter, ()=>{
        if(!this._dirty) {
          this._dirty = true
        }
      })
  }
  get value() {
    if(this._dirty) {
      this._dirty = false
      this._value = this._effect.run()
    }
    return this._value
  }
}


export const computed = function(getter) {
  return new ComputedRefImpl(getter)
}
