import { Stack, Typography } from "@mui/material"
import { useState } from "react"
import useTheme from "../../common/useTheme"
import { Input } from "../../components/control"
import Modal, { ModalActionProps } from "../../components/modal"
import { generateCustomNotification } from "../core/coreUtils"
import { setStockUI, useStockUI } from "./stock"
import { updateStockItem } from "./stockSliceUtils"
/*




*/
export function AddItem() {
  const isAdding = useStockUI((state: any) => state.isAdding)

  const [name, setName] = useState("")
  const [unit, setUnit] = useState("")
  const [id, setId] = useState("")

  const isAllFieldsComplete = !!id && !!name && !!unit

  function handleAccept() {
    if (isAllFieldsComplete) {
      updateStockItem(id, name, unit)
      setStockUI("isAdding", false)
      resetFields()
    } else {
      generateCustomNotification("error", "Please complete all fields.")
    }
  }

  function resetFields() {
    setTimeout(() => {
      setId("")
      setName("")
      setUnit("")
    }, 250)
  }

  function handleClose(event: any) {
    setStockUI("isAdding", false)
  }

  const inputs: StockItemInputFieldProps[] = [
    {
      label: "Code",
      value: id,
      onChange: (event: any) => setId(event.target.value),
    },
    {
      label: "Name",
      value: name,
      onChange: (event: any) => setName(event.target.value),
    },
    {
      label: "Unit",
      value: unit,
      onChange: (event: any) => setUnit(event.target.value),
    },
  ]

  const actions: ModalActionProps[] = [
    { iconName: "cancel", handleClick: handleClose },
    { iconName: "done", handleClick: handleAccept },
  ]

  return (
    <Modal
      open={isAdding}
      heading={"Add Stock Item"}
      body={<StockItemInputFields inputs={inputs} />}
      actions={actions}
      onClose={handleClose}
    />
  )
}
/*




*/
export type StockItemInputFieldProps = {
  label: string
  value: string
  onChange: (event: any) => void
}

export function StockItemInputFields(props: {
  inputs: StockItemInputFieldProps[]
}) {
  const theme = useTheme()

  return (
    <Stack
      width={"100%"}
      alignItems={"center"}
      padding={theme.module[3]}
      gap={theme.module[3]}
      boxSizing={"border-box"}
    >
      {props.inputs.map((input: StockItemInputFieldProps) => {
        return (
          <Stack
            width={"100%"}
            direction={"row"}
            alignItems={"center"}
            key={input.label}
          >
            <Typography width={theme.module[7]}>{input.label}:</Typography>
            <Input
              onChange={input.onChange}
              value={input.value}
              sx={{
                background: theme.scale.gray[8],
              }}
            />
          </Stack>
        )
      })}
    </Stack>
  )
}
/*




*/
