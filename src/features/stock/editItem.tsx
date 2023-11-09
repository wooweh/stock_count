import { useEffect, useState } from "react"
import useTheme from "../../common/useTheme"
import Modal, { ModalActionProps } from "../../components/modal"
import { StockItemInputFieldProps, StockItemInputFields } from "./addItem"
import { setStockUI, useStockUI } from "./stock"
import { updateStockItem } from "./stockSliceUtils"
/*




*/
export function EditItem() {
  const isEditing = useStockUI((state: any) => state.isEditing)

  const [name, setName] = useState("")
  const [unit, setUnit] = useState("")
  const [id, setId] = useState("")

  useEffect(() => {
    if (!!isEditing) {
      setId(isEditing.id)
      setName(isEditing.name)
      setUnit(isEditing.description)
    }
  }, [isEditing])

  const isAllFieldsComplete = !!id && !!name && !!unit

  function handleAccept(event: any) {
    if (isAllFieldsComplete) {
      updateStockItem(id, name, unit)
      setStockUI("isEditing", false)
    }
  }

  function handleClose() {
    setStockUI("isEditing", false)
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
      open={!!isEditing}
      heading={"Edit Stock Item"}
      body={<StockItemInputFields inputs={inputs} />}
      actions={actions}
      onClose={handleClose}
    />
  )
}
/*




*/
