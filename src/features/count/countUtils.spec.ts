import { describe, expect, expectTypeOf, it } from "vitest"
import { ColumnData, ColumnGroupData, RowData } from "../../components/table"
import { MembersProps } from "../org/orgSlice"
import { StockProps } from "../stock/stockSlice"
import { CountResultsProps } from "./countSlice"
import {
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
})
