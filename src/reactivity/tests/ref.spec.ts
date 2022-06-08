import { effect } from "../effect"
import { reactive } from "../reactive"
import { isRef, proxyRef, ref, unRef } from "../ref"


describe("ref", ()=>{
  it("happy path", ()=>{
    const a = ref(1)
    expect(a.value).toBe(1)
  })

  it("should be reactive", ()=>{
    const a = ref(1)
    let dummy
    let calls = 0
    effect(()=>{
      calls++
      dummy = a.value
    })

    expect(calls).toBe(1)
    expect(dummy).toBe(1)

    a.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)

    a.value = 2

    expect(calls).toBe(2)
    expect(dummy).toBe(2)
  })



  it("should use reactive", ()=>{
    let a = ref({
      count: 1
    })

    let dummy

    effect(()=>{
      dummy = a.value.count
    })

    expect(dummy).toBe(1)
    a.value.count = 2
    expect(dummy).toBe(2)
  })


  // isRef
  it("isRef", ()=>{
    let a = 1
    let b = ref(2)
    let c = reactive({
      val: 6
    })

    expect(isRef(a)).toBe(false)
    expect(isRef(b)).toBe(true)
  })

  // unRef
  it("unRef",()=>{
    let a = 1
    let b = ref(2)

    expect(unRef(a)).toBe(1)
    expect(unRef(b)).toBe(2)
  })

  // proxyRef
  it("proxyRef", ()=>{
    let user = {
      age: ref(10),
      name: 'xiaohua'
    }

    let proxyUser = proxyRef(user)
    expect(user.age.value).toBe(10)
    expect(proxyUser.age).toBe(10)
    expect(proxyUser.name).toBe("xiaohua")

    proxyUser.age = 20

    expect(proxyUser.age).toBe(20)
    expect(user.age.value).toBe(20)

    proxyUser.age = ref(10)
    expect(proxyUser.age).toBe(10)
    expect(user.age.value).toBe(10)

  })
})


