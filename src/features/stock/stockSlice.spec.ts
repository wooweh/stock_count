import stockReducer, {
  StockState,
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
    const id = "stock_id"
    const actual = stockReducer(mockState, deleteStockItem({ id }))
    expect(actual.stock["stock_id"]).toEqual(undefined)
  })

  it("should handle setStock", () => {
    const stock = {
      stock_id: {
        id: "stock_id",
        name: "Stock Name",
        description: "Stock description",
      },
    }
    const actual = stockReducer(
      initialState,
      setStock({ stock, updateDB: false }),
    )
    expect(actual.stock).toEqual(stock)
  })

  it("should handle deleteStock", () => {
    const actual = stockReducer(mockState, deleteStock())
    expect(actual.stock).toEqual({})
  })
})
