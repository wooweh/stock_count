import { Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useAppDispatch } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Input } from "../../components/control"
import Modal from "../../components/modal"
import { setUseStock, useStockStore } from "./stock"
import { setStockItem } from "./stockSlice"
/*





*/
export function EditItem() {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const isEditing = useStockStore((state: any) => state.isEditing)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [id, setId] = useState("")

  useEffect(() => {
    if (!!isEditing) {
      setId(isEditing.id)
      setName(isEditing.name)
      setDescription(isEditing.description)
    }
  }, [isEditing])

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
  /*
  
  
  */
  function handleAccept(event: any) {
    if (id && name) {
      dispatch(
        setStockItem({
          id: id,
          name: name,
          description: description,
        }),
      )
      handleClose()
    }
  }
  /*
  
  
  */
  function handleClose() {
    setUseStock("isEditing", false)
    setUseStock("idViewingOptions", false)
  }
  /*
  
  
  */
  return (
    <Modal
      open={!!isEditing}
      heading={"Edit Stock Item"}
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
