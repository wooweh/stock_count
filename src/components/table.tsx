import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import * as React from "react"
import { TableComponents, TableVirtuoso } from "react-virtuoso"
import useTheme from "../common/useTheme"

export type ColumnData = {
  label: string
  dataKey: string
  width: number | string
}
type RowData = { [key: string]: string }
type VirtualizedTableProps = {
  rows: RowData[]
  columns: ColumnData[]
}
export default function VirtualizedTable(props: VirtualizedTableProps) {
  const theme = useTheme()

  const VirtuosoTableComponents: TableComponents<RowData> = {
    Table: (props) => (
      <Table
        {...props}
        sx={{
          borderCollapse: "separate",
          tableLayout: "auto",
          background: theme.scale.gray[8],
        }}
      />
    ),
    TableHead,
    TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
    TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
      <TableBody {...props} ref={ref} />
    )),
  }

  function fixedHeaderContent(columns: ColumnData[]) {
    return (
      <TableRow>
        {columns.map((column, index) => (
          <TableCell
            variant="head"
            align={"left"}
            sx={{
              width: "min-content",
              padding: theme.module[2],
              color: theme.scale.gray[4],
              background: theme.scale.gray[9],
              border: 0,
            }}
            key={index}
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    )
  }

  function rowContent(_index: number, row: RowData, columns: ColumnData[]) {
    return (
      <React.Fragment>
        {columns.map((column) => (
          <TableCell
            key={column.dataKey}
            align={"left"}
            padding={"none"}
            width={"min-content"}
            size={"small"}
            sx={{
              whiteSpace: "nowrap",
              color: theme.scale.gray[4],
              padding: theme.module[2],
              border: 0,
            }}
          >
            {row[column.dataKey]}
          </TableCell>
        ))}
      </React.Fragment>
    )
  }

  return (
    <Paper
      style={{
        minHeight: 400,
        height: "60vh",
        width: "100%",
        background: theme.scale.gray[9],
        outline: `1px solid ${theme.scale.gray[9]}`,
      }}
    >
      <TableVirtuoso
        data={props.rows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={() => fixedHeaderContent(props.columns)}
        itemContent={(_index, row) => rowContent(_index, row, props.columns)}
      />
    </Paper>
  )
}
