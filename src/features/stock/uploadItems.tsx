import { Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import { CSVParser, downloadCSVTemplate } from "../../components/csvParser"
import Modal, { ModalActionProps } from "../../components/modal"
import VirtualizedTable, { ColumnData } from "../../components/table"
import { setStockUI, useStockUI } from "./stock"
import { StockItemProps } from "./stockSlice"
import { uploadStockList } from "./stockSliceUtils"
/*




*/
export function UploadItems() {
  const theme = useTheme()
  const isUploading = useStockUI((state: any) => state.isUploading)
  const [data, setData]: any = useState([])

  function handleAccept() {
    uploadStockList(data)
    setStockUI("isUploading", false)
  }

  function handleClose() {
    setStockUI("isUploading", false)
  }

  function handleOnComplete(results: StockItemProps[]) {
    setData(results)
  }

  function handleDownload() {
    const data = [{ id: "", name: "", unit: "" }]
    downloadCSVTemplate(data)
  }

  useEffect(() => {
    if (!isUploading && data.length) setTimeout(() => setData([]), 1000)
  }, [isUploading, data])

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

  const actions: ModalActionProps[] = [
    { iconName: "cancel", handleClick: handleClose },
  ]

  if (data.length) actions.push({ iconName: "done", handleClick: handleAccept })

  return (
    <Modal
      open={isUploading}
      heading={"Upload Stock List"}
      body={
        <Stack
          width={"100%"}
          boxSizing={"border-box"}
          justifyContent={"center"}
        >
          {!data.length ? (
            <Stack width={"100%"} gap={theme.module[4]}>
              <CSVParser onComplete={handleOnComplete} />
              <Button
                variation={"modal"}
                label={"CSV Template"}
                iconName={"download"}
                bgColor={theme.scale.gray[7]}
                onClick={handleDownload}
              />
            </Stack>
          ) : (
            <Stack
              width={"100%"}
              gap={theme.module[3]}
              justifyContent={"flex-start"}
            >
              <Typography>Item count: {data.length}</Typography>
              <VirtualizedTable rows={data} columns={columns} />
            </Stack>
          )}
        </Stack>
      }
      actions={actions}
      onClose={handleClose}
    />
  )
}
/*




*/
