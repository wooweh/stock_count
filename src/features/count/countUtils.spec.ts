import _ from "lodash"
import { describe, expect, expectTypeOf, it } from "vitest"
import { ColumnData, ColumnGroupData, RowData } from "../../components/table"
import {
  CountChecksProps,
  MembersProps,
} from "../organisation/organisationSlice"
import { StockProps } from "../stock/stockSlice"
import {
  CountCheckProps,
  CountCommentsProps,
  CountMemberProps,
  CountMemberResultsProps,
  CountMembersProps,
  CountMetadataProps,
  CountResultsProps,
} from "./countSlice"
import {
  createCountChecksPayload,
  createCountMetadataPayload,
  prepareCountMembersPayload,
  prepareDualResultsTableColumnGroups,
  prepareDualResultsTableColumns,
  prepareDualResultsTableRows,
  prepareFinalResults,
  prepareSoloResultsTableColumnGroups,
  prepareSoloResultsTableColumns,
  prepareSoloResultsTableRows,
  prepareSubmissionPayload,
  prepareTeamResultsTableColumnGroups,
  prepareTeamResultsTableColumns,
  prepareTeamResultsTableRows,
  updateCountCommentsPayload,
  updateCountMemberPayload,
  updateCountMetadataPayload,
} from "./countUtils"

describe("Count Members Utils", () => {
  const memberUuids = ["test-uuid1", "test-uuid2"]
  const userUuid = "test-uuid1"
  const members: MembersProps = {
    "test-uuid1": {
      uuid: "test-uuid1",
      name: "John",
      surname: "Doe",
      role: "admin",
    },
    "test-uuid2": {
      uuid: "test-uuid2",
      name: "Jane",
      surname: "Doe",
      role: "admin",
    },
  }

  it("should handle prepareCountMembersPayload", () => {
    const countMembers = prepareCountMembersPayload(
      memberUuids,
      userUuid,
      members,
    )

    expect(_.keys(countMembers)).toEqual(memberUuids)
    expect(countMembers[userUuid].name).toEqual(members[userUuid].name)
    expectTypeOf(countMembers).toEqualTypeOf<CountMembersProps>()
  })
})

describe("Count Member Utils", () => {
  const memberUuid = "test-uuid"
  const path = "isCounting"
  const value = true
  const members: CountMembersProps = {
    [memberUuid]: {
      uuid: memberUuid,
      name: "John",
      surname: "Doe",
      isOrganiser: false,
      isCounter: false,
      isJoined: false,
      isCounting: false,
      step: "dashboard",
    },
  }
  it("should handle updateCountMemberPayload", () => {
    const member = members[memberUuid]
    const payload = {
      [path]: value,
    }
    const updatedMember = updateCountMemberPayload(member, payload)

    expect(updatedMember[path]).toEqual(value)
    expectTypeOf(updatedMember).toEqualTypeOf<CountMemberProps>()
  })
})

describe("Count Metadata Utils", () => {
  const type = "solo"
  const mockData: CountMetadataProps = {
    type: type,
    organiser: "test-uuid",
    counters: ["test-uuid"],
    prepStartTime: "test",
  }
  it("should handle createCountMetadataPayload", () => {
    const metadata = createCountMetadataPayload(mockData)
    expect(metadata.type).toEqual(type)
    expectTypeOf(metadata).toEqualTypeOf<CountMetadataProps>()
  })

  it("should handle updateCountMetadataPayload", () => {
    const mockTime = "test"
    const updatedMockData: Partial<CountMetadataProps> = {
      reviewStartTime: mockTime,
    }
    const metadata = updateCountMetadataPayload(mockData, updatedMockData)
    expect(metadata.reviewStartTime).toEqual(mockTime)
    expectTypeOf(metadata).toEqualTypeOf<CountMetadataProps>()
  })
})

describe("Count Check Utils", () => {
  const countChecks: CountChecksProps = {
    check1: "Check 1",
    check2: "Check 2",
    check3: "Check 3",
  }
  const satisfiedCheckUuids = ["check1", "check2"]
  it("should handle createCountChecksPayload", () => {
    const checks = createCountChecksPayload(countChecks, satisfiedCheckUuids)
    expect(checks.length).toEqual(3)
    expectTypeOf(checks).toEqualTypeOf<CountCheckProps[]>()
  })
})

describe("Count Comment Utils", () => {
  const countComments: CountCommentsProps = {
    preparation: ["preparation 1", "preparation 2"],
  }
  const mockPayload: Partial<CountCommentsProps> = {
    finalization: ["finalization 1", "finalization 2"],
  }
  it("should handle updateCountCommentsPayload", () => {
    const comments = updateCountCommentsPayload(countComments, mockPayload)
    expect(comments.finalization).toEqual(mockPayload.finalization)
    expectTypeOf(comments).toEqualTypeOf<CountCommentsProps>()
  })
})

describe("Count Results Table Utils", () => {
  const mockSoloResults: CountResultsProps = {
    mockCounterUuid1: {
      mockStockId1: {
        id: "mockStockId1",
        useableCount: 1,
        damagedCount: 2,
        obsoleteCount: 3,
      },
    },
  }
  const mockDualResults: CountResultsProps = {
    ...mockSoloResults,
    mockCounterUuid2: {
      mockStockId1: {
        id: "mockStockId1",
        useableCount: 2,
        damagedCount: 3,
        obsoleteCount: 4,
      },
    },
  }
  const mockTeamResults: CountResultsProps = {
    ...mockSoloResults,
    mockCounterUuid2: {
      mockStockId2: {
        id: "mockStockId2",
        useableCount: 1,
        damagedCount: 2,
        obsoleteCount: 3,
      },
    },
  }
  const mockStock: StockProps = {
    mockStockId1: {
      id: "mockStockId1",
      name: "mockName1",
      description: "mockDescription1",
    },
    mockStockId2: {
      id: "mockStockId2",
      name: "mockName2",
      description: "mockDescription2",
    },
  }

  const mockMembers: MembersProps = {
    mockCounterUuid1: {
      uuid: "mockCounterUuid1",
      name: "John",
      surname: "Doe",
      role: "member",
    },
    mockCounterUuid2: {
      uuid: "mockCounterUuid2",
      name: "Dane",
      surname: "Doe",
      role: "member",
    },
  }

  it("should handle prepareSoloResultsTableRows", () => {
    const rows = prepareSoloResultsTableRows(mockSoloResults, mockStock)
    expect(rows[0].useable).toEqual("1")
    expectTypeOf(rows).toEqualTypeOf<RowData[]>()
  })

  it("should handle prepareDualResultsTableRows", () => {
    const rows = prepareDualResultsTableRows(mockDualResults, mockStock)
    expect(rows[0].useable_mockCounterUuid1).toEqual("1")
    expectTypeOf(rows).toEqualTypeOf<RowData[]>()
  })

  it("should handle prepareTeamResultsTableRows", () => {
    const rows = prepareTeamResultsTableRows(
      mockTeamResults,
      mockStock,
      mockMembers,
    )
    expect(rows[0].useable).toEqual("1")
    expectTypeOf(rows).toEqualTypeOf<RowData[]>()
  })

  it("should handle prepareSoloResultsTableColumns", () => {
    const columns = prepareSoloResultsTableColumns()
    expect(columns[0].dataKey).toEqual("id")
    expectTypeOf(columns).toEqualTypeOf<ColumnData[]>()
  })

  it("should handle prepareDualResultsTableColumns", () => {
    const columns = prepareDualResultsTableColumns(mockDualResults)
    expect(columns[0].dataKey).toEqual("id")
    expectTypeOf(columns).toEqualTypeOf<ColumnData[]>()
  })

  it("should handle prepareTeamResultsTableColumns", () => {
    const columns = prepareTeamResultsTableColumns()
    expect(columns[0].dataKey).toEqual("id")
    expectTypeOf(columns).toEqualTypeOf<ColumnData[]>()
  })

  it("should handle prepareSoloResultsTableColumnGroups", () => {
    const columnGroups = prepareSoloResultsTableColumnGroups()
    expect(columnGroups[0].label).toEqual("Stock Item")
    expectTypeOf(columnGroups).toEqualTypeOf<ColumnGroupData[]>()
  })

  it("should handle prepareDualResultsTableColumnGroups", () => {
    const columnGroups = prepareDualResultsTableColumnGroups(
      mockDualResults,
      mockMembers,
    )
    expect(columnGroups[0].label).toEqual("Stock Item")
    expectTypeOf(columnGroups).toEqualTypeOf<ColumnGroupData[]>()
  })

  it("should handle prepareTeamResultsTableColumnGroups", () => {
    const columnGroups = prepareTeamResultsTableColumnGroups()
    expect(columnGroups[0].label).toEqual("Stock Item")
    expectTypeOf(columnGroups).toEqualTypeOf<ColumnGroupData[]>()
  })
})

describe("Count Submission Utils", () => {
  const mockFinalResults: CountResultsProps = {
    mockCounterUuid1: {
      mockStockId1: {
        id: "mockStockId1",
        useableCount: 2,
        damagedCount: 3,
        obsoleteCount: 4,
      },
    },
    mockCounterUuid2: {
      mockStockId2: {
        id: "mockStockId2",
        useableCount: 2,
        damagedCount: 3,
        obsoleteCount: 4,
      },
    },
  }

  const mockMetadata: CountMetadataProps = {
    type: "solo",
    organiser: "mockCounterUuid1",
    counters: ["mockCounterUuid1", "mockCounterUuid2"],
    prepStartTime: "test",
    reviewStartTime: "test",
    finalizationStartTime: "test",
    finalSubmissionTime: "test",
  }

  it("should handle prepareFinalResults", () => {
    const finalResults = prepareFinalResults(mockFinalResults)
    expect(finalResults.mockStockId1).toEqual(
      mockFinalResults.mockCounterUuid1.mockStockId1,
    )
    expect(finalResults.mockStockId2).toEqual(
      mockFinalResults.mockCounterUuid2.mockStockId2,
    )
    expectTypeOf(finalResults).toEqualTypeOf<CountMemberResultsProps>()
  })

  it("should handle prepareSubmissionPayload", () => {
    const mockResults = prepareFinalResults(mockFinalResults)
    const payload = prepareSubmissionPayload(mockResults, mockMetadata)
    expect(payload.metadata).toEqual(mockMetadata)
    expect(payload.results).toEqual(mockResults)
    expectTypeOf(payload.metadata).toEqualTypeOf<CountMetadataProps>()
    expectTypeOf(payload.results).toEqualTypeOf<CountMemberResultsProps>()
  })
})
