import _ from "lodash"
import { describe, expect, expectTypeOf, it } from "vitest"
import historyReducer, {
  HistoryItemCommentsProps,
  HistoryItemMetadataProps,
  HistoryItemProps,
  HistoryItemResultsProps,
  HistoryProps,
  HistoryState,
  deleteHistory,
  deleteHistoryItem,
  setHistory,
  setHistoryItem,
} from "./historySlice"
/*




*/
describe("History Reducer", () => {
  const initialState: HistoryState = {
    history: {},
  }

  it("should handle initial state", () => {
    expect(historyReducer(undefined, { type: "unknown" })).toEqual({
      ...initialState,
    })
  })

  const mockResults: HistoryItemResultsProps = {
    mockStockId1: {
      id: "mockStockId1",
      useableCount: 2,
      damagedCount: 3,
      obsoleteCount: 4,
    },
  }
  const mockComments: HistoryItemCommentsProps = {
    preparation: ["mockComment1", "mockComment2"],
    finalization: ["mockComment3", "mockComment4"],
  }
  const mockMetadata: HistoryItemMetadataProps = {
    type: "dual",
    organiser: "mockUuid",
    counters: ["mockUuid"],
    prepStartTime: "mockPrepTime",
    countStartTime: "mockCountTime",
    reviewStartTime: "mockReviewTime",
    finalizationStartTime: "mockFinalTime",
    finalSubmissionTime: "mockFinalTime",
  }
  const mockHistoryItem: HistoryItemProps = {
    uuid: "mockHistoryUuid1",
    results: mockResults,
    comments: mockComments,
    metadata: mockMetadata,
  }
  const mockHistory: HistoryProps = {
    mockHistoryUuid1: mockHistoryItem,
  }

  it("should handle setHistory", () => {
    const actual = historyReducer(initialState, setHistory(mockHistory))
    expect(actual.history).toEqual(mockHistory)
    expectTypeOf(actual.history).toEqualTypeOf<HistoryProps>()
  })

  it("should handle deleteHistory", () => {
    const actual = historyReducer(
      initialState,
      deleteHistory({ updateDB: false }),
    )
    expect(actual.history).toEqual({})
  })

  it("should handle setHistoryItem", () => {
    const actual = historyReducer(initialState, setHistoryItem(mockHistoryItem))
    expect(actual.history).toEqual(mockHistory)
    expectTypeOf(actual.history).toEqualTypeOf<HistoryProps>()
  })

  it("should handle deleteHistoryItem", () => {
    const actual = historyReducer(
      initialState,
      deleteHistoryItem({ uuid: "mockHistoryUuid1" }),
    )
    expect(actual.history).toEqual({})
  })
})
