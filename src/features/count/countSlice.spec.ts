import countReducer, {
  CountCommentsProps,
  CountMemberProps,
  CountMembersProps,
  CountMetadataProps,
  CountResultsProps,
  CountState,
  DeleteCountItemProps,
  SetCountResultsItemProps,
  deleteCount,
  deleteCountMember,
  deleteCountResultsItem,
  setCount,
  setCountComments,
  setCountFinalComments,
  setCountMember,
  setCountMembers,
  setCountMetaData,
  setCountPrepComments,
  setCountResults,
  setCountResultsItem,
  setCountStep,
} from "./countSlice"

describe("count reducer", () => {
  const initialState: CountState = {
    step: "dashboard",
    count: {},
  }
  const mockState: CountState = {
    step: "dashboard",
    count: {
      metadata: {
        type: "solo",
        prepStartTime: "mockPrepTime",
        countStartTime: "mockCountTime",
        reviewStartTime: "mockReviewTime",
        finalSubmissionTime: "mockFinalTime",
        organiser: "mockUuid",
        counters: ["mockUuid"],
      },
      comments: {
        preparation: ["mockComment1", "mockComment2"],
        finalization: ["mockComment3", "mockComment4"],
      },
      results: {
        mockUuid: {
          mockStockId: {
            stockId: "mockStockId",
            useableCount: 1,
            damagedCount: 2,
            obsoleteCount: 3,
          },
        },
      },
      members: {
        mockUuid: {
          uuid: "mockUuid",
          name: "mockName",
          surname: "mockSurname",
          isOrganiser: true,
          isCounter: true,
          isJoined: true,
          step: "dashboard",
        },
      },
    },
  }

  it("should handle initial state", () => {
    expect(countReducer(undefined, { type: "unknown" })).toEqual({
      step: "dashboard",
      count: {},
    })
  })

  it("should handle setCountStep", () => {
    const actual = countReducer(initialState, setCountStep("setup"))
    expect(actual.step).toEqual("setup")
  })

  it("should handle setCountMember", () => {
    const mockData: CountMemberProps = {
      uuid: "mockUuid",
      name: "mockName",
      surname: "mockSurname",
      isCounter: false,
      isJoined: false,
      isOrganiser: false,
      step: "dashboard",
    }
    const actual = countReducer(
      mockState,
      setCountMember({ member: mockData, updateDB: false }),
    )
    const members = actual.count.members as CountMembersProps
    expect(members[mockData.uuid]).toEqual(mockData)
  })

  it("should handle deleteCountMember", () => {
    const actual = countReducer(mockState, deleteCountMember("mockUuid"))
    const members = actual.count.members as CountMembersProps
    expect(members["mockUuid"]).toEqual(undefined)
  })

  it("should handle setCountResultsItem", () => {
    const mockItem: SetCountResultsItemProps = {
      memberUuid: "mockUuid",
      stockId: "mockStockId1",
      useableCount: 1,
      damagedCount: 2,
      obsoleteCount: 3,
    }
    const actual = countReducer(mockState, setCountResultsItem(mockItem))
    const results = actual.count.results as CountResultsProps
    expect(results["mockUuid"]["mockStockId1"].useableCount).toEqual(1)
  })

  it("should handle deleteCountResultsItem", () => {
    const mockPayload: DeleteCountItemProps = {
      memberUuid: "mockUuid",
      stockId: "mockStockId",
    }
    const actual = countReducer(mockState, deleteCountResultsItem(mockPayload))
    const results = actual.count.results as CountResultsProps
    expect(results["mockUuid"]["mockStockId"]).toEqual(undefined)
  })

  it("should handle setCountMembers", () => {
    const mockPayload: CountMembersProps = {
      mockUuid1: {
        uuid: "mockUuid1",
        name: "mockName",
        surname: "mockSurname",
        isCounter: false,
        isJoined: false,
        isOrganiser: false,
        step: "dashboard",
      },
    }
    const actual = countReducer(
      initialState,
      setCountMembers({ members: mockPayload, updateDB: false }),
    )
    const members = actual.count.members as CountMembersProps
    expect(members["mockUuid1"]).toEqual(mockPayload.mockUuid1)
  })

  it("should handle setCountMetaData", () => {
    const mockPayload: CountMetadataProps = {
      type: "dual",
      prepStartTime: "mockPrepTime",
      countStartTime: "mockCountTime",
      reviewStartTime: "mockReviewTime",
      finalSubmissionTime: "mockFinalTime",
      organiser: "mockUuid",
      counters: ["mockUuid"],
    }
    const actual = countReducer(
      initialState,
      setCountMetaData({ metadata: mockPayload, updateDB: false }),
    )
    const metadata = actual.count.metadata as CountMetadataProps
    expect(metadata).toEqual(mockPayload)
  })

  const mockCommentPayload: CountCommentsProps = {
    preparation: ["mockComment1", "mockComment2"],
    finalization: ["mockComment3", "mockComment4"],
  }
  it("should handle setCountComments", () => {
    const actual = countReducer(
      initialState,
      setCountComments(mockCommentPayload),
    )
    const comments = actual.count.comments as CountCommentsProps
    expect(comments).toEqual(mockCommentPayload)
  })

  it("should handle setCountPrepComments", () => {
    const mockComments = mockCommentPayload.preparation as string[]
    const actual = countReducer(mockState, setCountPrepComments(mockComments))
    const comments = actual.count.comments as CountCommentsProps
    expect(comments.preparation).toEqual(mockComments)
  })

  it("should handle setCountFinalComments", () => {
    const mockComments = mockCommentPayload.finalization as string[]
    const actual = countReducer(mockState, setCountFinalComments(mockComments))
    const comments = actual.count.comments as CountCommentsProps
    expect(comments.finalization).toEqual(mockComments)
  })

  it("should handle setCountResults", () => {
    const mockResults = mockState.count.results as CountResultsProps
    const actual = countReducer(initialState, setCountResults(mockResults))
    const results = actual.count.results as CountResultsProps
    expect(results).toEqual(mockResults)
  })

  it("should handle setCount", () => {
    const mockPayload = mockState.count
    const actual = countReducer(initialState, setCount(mockPayload))
    expect(actual.count).toEqual(mockPayload)
  })

  it("should handle deleteCount", () => {
    const actual = countReducer(mockState, deleteCount())
    expect(actual.count).toEqual({})
  })
})
