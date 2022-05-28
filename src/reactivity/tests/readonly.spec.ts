import { isReadOnly, readOnly } from "../reactive"

describe('readonly', ()=>{
  it("happy path", ()=>{
    const original = { foo: 1, bar: {baz: 1} }
    const wrapped = readOnly(original)

    expect(wrapped).not.toBe(original)

    expect(isReadOnly(wrapped)).toBe(true)
    expect(wrapped.foo).toBe(1)
  })


  // warn
  it("warn then call set", ()=>{
    // console.warn()
    console.warn = jest.fn()
    const user = readOnly({
      age: 10
    })

    user.age = 11
    expect(console.warn).toBeCalled()
  })
})
