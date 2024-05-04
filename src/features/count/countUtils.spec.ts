import { describe, expect, expectTypeOf, it } from "vitest"
import { ColumnData, ColumnGroupData, RowData } from "../../components/table"
import { MembersProps } from "../org/orgSlice"
import { StockProps } from "../stock/stockSlice"
import { CountMembersProps, CountResultsProps, CountTypes } from "./countSlice"
import {
  getCountHeadCountRequirement,
  getCountMember,
  getReviewTableData,
  prepareDualResultsTableColumnGroups,
  prepareDualResultsTableColumns,
  prepareDualResultsTableRows,
  prepareSoloResultsTableColumnGroups,
  prepareSoloResultsTableColumns,
  prepareSoloResultsTableRows,
  prepareTeamResultsTableColumnGroups,
  prepareTeamResultsTableColumns,
  prepareTeamResultsTableRows,
} from "./countUtils"
/*




*/
describe("Count Utils", () => {
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
      unit: "mockDescription1",
    },
    mockStockId2: {
      id: "mockStockId2",
      name: "mockName2",
      unit: "mockDescription2",
    },
  }

  const mockMembers: MembersProps = {
    mockCounterUuid1: {
      uuid: "mockCounterUuid1",
      firstName: "John",
      lastName: "Doe",
      role: "member",
    },
    mockCounterUuid2: {
      uuid: "mockCounterUuid2",
      firstName: "Dane",
      lastName: "Doe",
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

  it("should handle getCountHeadCountRequirement", () => {
    const mockMemberUuids: string[] = ["mockCounterUuid1", "mockCounterUuid2"]
    const mockCountType: CountTypes = "solo"
    const headCountRequirement = getCountHeadCountRequirement(1, mockCountType)
    expect(headCountRequirement.verbose).toEqual("1 Counter")
    expect(headCountRequirement.isMet).toEqual(true)
  })

  it("should handle getReviewTableData", () => {
    const mockResults: CountResultsProps = {
      mockCounterUuid1: {
        mockStockId1: {
          id: "mockStockId1",
          useableCount: 1,
          damagedCount: 2,
          obsoleteCount: 3,
        },
      },
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
        unit: "mockDescription1",
      },
      mockStockId2: {
        id: "mockStockId2",
        name: "mockName2",
        unit: "mockDescription2",
      },
    }
    const mockCountType: CountTypes = "solo"
    const tableData = getReviewTableData(
      mockResults,
      mockStock,
      mockMembers,
      mockCountType,
    )
    expect(tableData.rows[0].useable).toEqual("1")
    expectTypeOf(tableData.rows).toEqualTypeOf<RowData[]>()
  })

  it("should handle getCountMember", () => {
    const mockMembers: CountMembersProps = {
      mockCounterUuid1: {
        uuid: "mockCounterUuid1",
        firstName: "John",
        lastName: "Doe",
        step: "dashboard",
        isJoined: true,
        isCounter: true,
        isCounting: true,
        isOrganiser: true,
        isDeclined: false,
      },
      mockCounterUuid2: {
        uuid: "mockCounterUuid2",
        firstName: "Dane",
        lastName: "Doe",
        step: "dashboard",
        isJoined: true,
        isCounter: true,
        isCounting: true,
        isOrganiser: true,
        isDeclined: false,
      },
    }
    const member = getCountMember(mockMembers, "mockCounterUuid1")
    expect(member.firstName).toEqual("John")
    expect(member.lastName).toEqual("Doe")
  })
})
/*




*/
