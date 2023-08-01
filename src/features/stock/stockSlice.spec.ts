import stockReducer, {
  StockState,
  addStockBatch,
  addStockItem,
  deleteStock,
  deleteStockItem,
  editStockItem,
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

  it("should handle addStockItem", () => {
    const actual = stockReducer(
      initialState,
      addStockItem(mockStockItemPayload),
    )
    expect(actual.stock["stock_id"]).toEqual(mockStockItemPayload)
  })

  it("should handle addStockBatch", () => {
    const actual = stockReducer(initialState, addStockBatch(mockStockPayload))
    expect(actual.stock["stock_id"]).toEqual(mockStockItemPayload)
  })

  it("should handle editStockItem", () => {
    const actual = stockReducer(
      initialState,
      editStockItem(mockStockItemPayload),
    )
    expect(actual.stock["stock_id"]).toEqual(mockStockItemPayload)
  })

  it("should handle deleteStockItem", () => {
    const actual = stockReducer(mockState, deleteStockItem("stock_id"))
    expect(actual.stock["stock_id"]).toEqual(undefined)
  })

  it("should handle setStock", () => {
    const actual = stockReducer(initialState, setStock(mockStockPayload))
    expect(actual.stock).toEqual(mockStockPayload)
  })

  it("should handle deleteStock", () => {
    const actual = stockReducer(mockState, deleteStock())
    expect(actual.stock).toEqual({})
  })
})
