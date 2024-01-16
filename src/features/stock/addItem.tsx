import { Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useState } from "react"
import useTheme from "../../common/useTheme"
import { Input } from "../../components/control"
import Modal, { ModalActionProps } from "../../components/modal"
import { generateCustomNotification } from "../core/coreUtils"
import { setStockUI, useStockUI } from "./stock"
import { updateStockItem } from "./stockSliceUtils"
import { useLocation } from "react-router-dom"
import { ErrorBoundary } from "../../components/errorBoundary"
import { Slot } from "../../components/surface"
/*




*/
export function AddItem() {
  const isAdding = useStockUI((state) => state.isAdding)

  const [name, setName] = useState("")
  const [unit, setUnit] = useState("")
  const [id, setId] = useState("")

  const isAllFieldsComplete = !!id && !!name && !!unit

  function handleAccept() {
    if (isAllFieldsComplete) {
      updateStockItem(id, name, unit)
      setStockUI("isAdding", false)
      _.delay(resetFields, 250)
    } else {
      generateCustomNotification("error", "Please complete all fields.")
    }
  }

  function handleClose() {
    setStockUI("isAdding", false)
    _.delay(resetFields, 250)
  }

  function resetFields() {
    setId("")
    setName("")
    setUnit("")
  }

  const inputs: StockItemInputFieldProps[] = [
    {
      label: "Code",
      placeholder: "COFF01",
      value: id,
      onChange: (event: any) => setId(event.target.value),
    },
    {
      label: "Name",
      placeholder: "Coffee Beans",
      value: name,
      onChange: (event: any) => setName(event.target.value),
    },
    {
      label: "Unit",
      placeholder: "grams",
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
  placeholder?: string
  value: string
  onChange: (event: any) => void
}

export function StockItemInputFields(props: {
  inputs: StockItemInputFieldProps[]
}) {
  const theme = useTheme()
  const location = useLocation()

  const stockUIState = useStockUI((state) => state)

  const path = location.pathname

  return (
    <ErrorBoundary
      componentName={"StockItemInputFields"}
      featurePath={path}
      state={{ component: { ...props }, featureUI: { ...stockUIState } }}
    >
      <Stack
        width={"100%"}
        alignItems={"center"}
        padding={theme.module[3]}
        paddingRight={theme.module[2]}
        gap={theme.module[3]}
        boxSizing={"border-box"}
      >
        {props.inputs.map((input: StockItemInputFieldProps) => (
          <StockItemInputField key={input.label} {...input} />
        ))}
      </Stack>
    </ErrorBoundary>
  )
}
/*




*/
function StockItemInputField(props: StockItemInputFieldProps) {
  const theme = useTheme()

  return (
    <Slot gap={theme.module[1]} key={props.label}>
      <Typography
        width={theme.module[7]}
        fontWeight={"bold"}
        color={theme.scale.gray[4]}
      >
        {props.label}:
      </Typography>
      <Input
        onChange={props.onChange}
        value={props.value}
        placeholder={props.placeholder}
        sx={{
          background: theme.scale.gray[8],
        }}
      />
    </Slot>
  )
}
/*




*/
