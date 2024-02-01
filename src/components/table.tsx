import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import * as React from "react"
import { useLocation } from "react-router-dom"
import { TableComponents, TableVirtuoso } from "react-virtuoso"
import useTheme from "../common/useTheme"
import { ErrorBoundary } from "./errorBoundary"
/*




*/
export type ColumnData = {
  label: string
  dataKey: string
  width: number | string
  align: "left" | "center" | "right"
}
export type ColumnGroupData = {
  label: string
  colSpan: number
}
export type RowData = { [key: string]: string }
type VirtualizedTableProps = {
  rows: RowData[]
  columns: ColumnData[]
  columnGroups?: ColumnGroupData[]
}
export default function VirtualizedTable(props: VirtualizedTableProps) {
  const theme = useTheme()
  const location = useLocation()

  const path = location.pathname

  const tableStyles = {
    borderCollapse: "separate",
    tableLayout: "auto",
    background: theme.scale.gray[8],
  }
  const tableBodyStyles = {
    paddingTop: theme.module[0],
    overflow: "hidden",
    background: theme.scale.gray[9],
  }

  const VirtuosoTableComponents: TableComponents<RowData> = {
    Table: (props) => <Table {...props} sx={tableStyles} />,
    TableHead,
    TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
    TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
      <TableBody {...props} sx={tableBodyStyles} ref={ref} />
    )),
  }

  const headerRowStyles = {
    width: "100%",
    outline: `1px solid ${theme.scale.gray[7]}`,
  }
  const headerCellStyles = {
    outline: `1px solid ${theme.scale.gray[7]}`,
    boxSizing: "border-box",
    width: "min-content",
    padding: theme.module[2],
    color: theme.scale.gray[4],
    background: theme.scale.gray[9],
    border: 0,
  }
  function fixedHeaderContent() {
    return (
      <>
        {!!props.columnGroups && (
          <TableRow sx={headerRowStyles}>
            {props.columnGroups.map((columnGroup) => (
              <TableCell
                variant="head"
                align="center"
                colSpan={columnGroup.colSpan}
                sx={headerCellStyles}
                key={columnGroup.label}
              >
                {columnGroup.label}
              </TableCell>
            ))}
          </TableRow>
        )}
        <TableRow sx={headerRowStyles}>
          {props.columns.map((column, index) => (
            <TableCell
              variant="head"
              align={column.align}
              sx={headerCellStyles}
              key={index}
            >
              {column.label}
            </TableCell>
          ))}
        </TableRow>
      </>
    )
  }

  const tableCellStyles = {
    whiteSpace: "nowrap",
    color: theme.scale.gray[4],
    outline: `1px solid ${theme.scale.gray[7]}`,
    padding: theme.module[2],
    border: 0,
  }

  function rowContent(_index: number, row: RowData) {
    return (
      <React.Fragment>
        {props.columns.map((column) => (
          <TableCell
            key={column.dataKey}
            align={column.align}
            padding={"none"}
            width={"min-content"}
            size={"small"}
            sx={tableCellStyles}
          >
            {row[column.dataKey]}
          </TableCell>
        ))}
      </React.Fragment>
    )
  }

  const paperStyles = {
    minHeight: 100,
    height: "60vh",
    width: "100%",
    background: theme.scale.gray[9],
    outline: `1px solid ${theme.scale.gray[9]}`,
    overflow: "hidden",
  }

  return (
    <Paper style={paperStyles}>
      <ErrorBoundary
        componentName={"Table"}
        featurePath={path}
        state={{ component: { ...props } }}
      >
        <TableVirtuoso
          data={props.rows}
          components={VirtuosoTableComponents}
          fixedHeaderContent={() => fixedHeaderContent()}
          itemContent={(_index, row) => rowContent(_index, row)}
        />
      </ErrorBoundary>
    </Paper>
  )
}
