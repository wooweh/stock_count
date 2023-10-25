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
import { describe, expect, expectTypeOf, it } from "vitest"
/*




*/
const PREP_START_TIME = 1698135256
const COUNT_START_TIME = PREP_START_TIME + 10 * 60
const REVIEW_START_TIME = COUNT_START_TIME + 10 * 60
const FINALIZE_START_TIME = REVIEW_START_TIME + 10 * 60
const FINAL_SUBMIT_TIME = FINALIZE_START_TIME + 10 * 60
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
    prepStartTime: PREP_START_TIME,
    countStartTime: COUNT_START_TIME,
    reviewStartTime: REVIEW_START_TIME,
    finalizationStartTime: FINALIZE_START_TIME,
    finalSubmissionTime: FINAL_SUBMIT_TIME,
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
    const actual = historyReducer(initialState, deleteHistory())
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
