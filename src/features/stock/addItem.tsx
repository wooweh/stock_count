import { Stack, Typography } from "@mui/material"
import { useState } from "react"
import { useAppDispatch } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Input } from "../../components/control"
import Modal from "../../components/modal"
import { generateCustomNotification } from "../core/coreUtils"
import { setUseStock, useStockStore } from "./stock"
import { updateStockItem } from "./stockSliceUtils"
/*




*/
export function AddItem() {
  const theme = useTheme()

  const isAdding = useStockStore((state: any) => state.isAdding)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [id, setId] = useState("")

  function handleAccept() {
    if (id && name && description) {
      updateStockItem(id, name, description)
      setUseStock("isAdding", false)
      resetFields()
    } else {
      generateCustomNotification("error", "Please complete all fields.")
    }
  }

  function resetFields() {
    setTimeout(() => {
      setId("")
      setName("")
      setDescription("")
    }, 250)
  }

  function handleClose(event: any) {
    setUseStock("isAdding", false)
  }

  const inputs = [
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
      label: "Descr.",
      value: description,
      onChange: (event: any) => setDescription(event.target.value),
    },
  ]

  return (
    <Modal
      open={isAdding}
      heading={"Add Stock Item"}
      body={
        <Stack
          width={"100%"}
          padding={theme.module[3]}
          boxSizing={"border-box"}
          gap={theme.module[4]}
        >
          <Stack width={"100%"} alignItems={"center"} gap={theme.module[3]}>
            {inputs.map((input: (typeof inputs)[number], index: number) => {
              return (
                <Stack
                  width={"100%"}
                  direction={"row"}
                  alignItems={"center"}
                  key={index}
                >
                  <Typography width={theme.module[7]}>
                    {input.label}:
                  </Typography>
                  <Input
                    value={input.value}
                    onChange={input.onChange}
                    sx={{
                      background: theme.scale.gray[8],
                    }}
                  />
                </Stack>
              )
            })}
          </Stack>
        </Stack>
      }
      actions={[
        { iconName: "cancel", handleClick: handleClose },
        { iconName: "done", handleClick: handleAccept },
      ]}
      onClose={handleClose}
    />
  )
}
/*




*/
