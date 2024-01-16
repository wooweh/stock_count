import { Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import { CSVParser, downloadCSVTemplate } from "../../components/csvParser"
import { ErrorBoundary } from "../../components/errorBoundary"
import Modal, { ModalActionProps } from "../../components/modal"
import VirtualizedTable, { ColumnData, RowData } from "../../components/table"
import { setStockUI, useStockUI } from "./stock"
import { StockItemProps } from "./stockSlice"
import { uploadStockList } from "./stockSliceUtils"
/*




*/
export function UploadItems() {
  const isUploading = useStockUI((state) => state.isUploading)
  const [data, setData]: any = useState([])

  function handleAccept() {
    uploadStockList(data)
    setStockUI("isUploading", false)
  }

  function handleClose() {
    setStockUI("isUploading", false)
  }

  useEffect(() => {
    if (!isUploading && !!data.length) resetData()
  }, [isUploading, data])

  function resetData() {
    _.delay(() => setData([]), 1000)
  }

  const uploadItemBodyProps = {
    setData,
    data,
  }

  const actions: ModalActionProps[] = [
    { iconName: "cancel", handleClick: handleClose },
  ]

  if (!!data.length)
    actions.push({ iconName: "done", handleClick: handleAccept })

  return (
    <Modal
      open={isUploading}
      heading={"Upload Stock List"}
      body={<UploadItemBody {...uploadItemBodyProps} />}
      actions={actions}
      onClose={handleClose}
    />
  )
}
/*




*/
type UploadItemBodyProps = {
  setData: Function
  data: StockItemProps[]
}
function UploadItemBody(props: UploadItemBodyProps) {
  const location = useLocation()

  const stockUIState = useStockUI((state) => state)

  const path = location.pathname
  const columns: ColumnData[] = [
    {
      width: "min-content",
      align: "left",
      label: "Code",
      dataKey: "id",
    },
    {
      width: "min-content",
      align: "left",
      label: "Name",
      dataKey: "name",
    },
    {
      width: "min-content",
      align: "left",
      label: "Unit",
      dataKey: "unit",
    },
  ]
  return (
    <ErrorBoundary
      componentName="UploadItemBody"
      featurePath={path}
      state={{ component: { ...props }, featureUI: { ...stockUIState } }}
    >
      {props.data.length ? (
        <ReviewTable rows={props.data} columns={columns} />
      ) : (
        <ChooseFile setData={props.setData} />
      )}
    </ErrorBoundary>
  )
}
/*




*/
function ChooseFile({ setData }: { setData: any }) {
  const theme = useTheme()

  function handleOnComplete(results: StockItemProps[]) {
    setData(results)
  }

  function handleDownload() {
    const data = [{ id: "", name: "", unit: "" }]
    downloadCSVTemplate(data)
  }

  return (
    <Stack width={"100%"} boxSizing={"border-box"} justifyContent={"center"}>
      <Stack width={"100%"} gap={theme.module[4]}>
        <CSVParser onComplete={handleOnComplete} />
        <Button
          variation={"modal"}
          label={"CSV Template"}
          iconName={"download"}
          bgColor={theme.scale.gray[7]}
          outlineColor={theme.scale.gray[6]}
          onClick={handleDownload}
        />
      </Stack>
    </Stack>
  )
}
/*




*/
function ReviewTable({
  rows,
  columns,
}: {
  rows: RowData[]
  columns: ColumnData[]
}) {
  const theme = useTheme()

  return (
      <Stack width={"100%"} gap={theme.module[3]} justifyContent={"flex-start"}>
        <Typography fontWeight={"bold"} color={theme.scale.gray[5]}>
          Item count: {rows.length}
        </Typography>
        <VirtualizedTable rows={rows} columns={columns} />
      </Stack>
  )
}
/*




*/
