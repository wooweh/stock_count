import stockReducer, {
  StockState,
  addStockList,
  deleteStock,
  deleteStockItem,
  setStock,
  setStockItem,
} from "./stockSlice"

describe("stock reducer", () => {
  const initialState: StockState = {
    stock: {},
  }

  const mockState: StockState = {
    stock: {
      stock_id: {
        id: "stock_id",
        name: "Stock Name",
        description: "Stock description",
      },
    },
  }

  const mockStockItemPayload = {
    id: "stock_id",
    name: "Stock Name",
    description: "Stock description",
  }

  const mockStockPayload = {
    stock_id: {
      id: "stock_id",
      name: "Stock Name",
      description: "Stock description",
    },
  }

  it("should handle initial state", () => {
    expect(stockReducer(undefined, { type: "unknown" })).toEqual({
      stock: {},
    })
  })

  it("should handle setStockItem", () => {
    const actual = stockReducer(
      initialState,
      setStockItem(mockStockItemPayload),
    )
    expect(actual.stock["stock_id"]).toEqual(mockStockItemPayload)
  })

  it("should handle deleteStockItem", () => {
    const actual = stockReducer(mockState, deleteStockItem("stock_id"))
    expect(actual.stock["stock_id"]).toEqual(undefined)
  })

  it("should handle addStockList", () => {
    const actual = stockReducer(initialState, addStockList(mockStockPayload))
    expect(actual.stock).toEqual(mockStockPayload)
  })

  it("should handle setStock", () => {
    const actual = stockReducer(
      initialState,
      setStock({ stock: mockStockPayload, updateDB: false }),
    )
    expect(actual.stock).toEqual(mockStockPayload)
  })

  it("should handle deleteStock", () => {
    const actual = stockReducer(mockState, deleteStock())
    expect(actual.stock).toEqual({})
  })
})
