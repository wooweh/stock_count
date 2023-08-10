import countReducer from "./countSlice"

describe("stock reducer", () => {
  const initialState: CountState = {}

  it("should handle initial state", () => {
    expect(countReducer(undefined, { type: "unknown" })).toEqual({
      stock: {},
    })
  })

  it.skip("should handle ...", () => {
    // const actual = countReducer(initialState, setStockItem())
    // expect(actual).toEqual("...")
  })
})
