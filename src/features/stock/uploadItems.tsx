import { Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useEffect, useState } from "react"
import { useAppDispatch } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import { CSVParser, downloadCSVTemplate } from "../../components/csvParser"
import Modal, { ModalActionProps } from "../../components/modal"
import VirtualizedTable, { ColumnData } from "../../components/table"
import { setUseStock, useStockStore } from "./stock"
import { StockItemProps, setStock } from "./stockSlice"
/*





*/
export function UploadItems() {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const isUploading = useStockStore((state: any) => state.isUploading)
  const [data, setData]: any = useState([])

  function handleAccept() {
    const stockList = {}
    _.forEach(data, (item) => _.set(stockList, item.id, item))
    dispatch(setStock({ stock: stockList, updateDB: true }))
    handleClose()
  }

  function handleClose() {
    setUseStock("isUploading", false)
  }

  function handleOnComplete(results: StockItemProps[]) {
    setData(results)
  }

  function handleDownload() {
    const data = [{ id: "", name: "", description: "" }]
    downloadCSVTemplate(data)
  }

  useEffect(() => {
    if (!isUploading && data.length) setTimeout(() => setData([]), 1000)
  }, [isUploading, data])

  const columns: ColumnData[] = [
    {
      width: "min-content",
      align: "left",
      label: "ID",
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
      label: "Description",
      dataKey: "description",
    },
  ]

  const modalActions: ModalActionProps[] = [
    { iconName: "cancel", handleClick: handleClose },
  ]
  if (data.length)
    modalActions.push({ iconName: "done", handleClick: handleAccept })

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
      actions={modalActions}
      onClose={handleClose}
    />
  )
}
/*





*/
