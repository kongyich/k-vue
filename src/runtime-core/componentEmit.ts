import { camelize, toHandlerKey } from "../shared/index"

export const emit = function(instance, event, ...args) {

  const { props } = instance

  // TPP 先写一个特定的行为，-》 重构成通用的行为
  // add-foo -> addFoo
  // add -> Add

  
  const handlerName = toHandlerKey(camelize(event))

  const handler = props[handlerName]
  handler && handler(...args)
}
