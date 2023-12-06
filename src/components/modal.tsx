import { Stack } from "@mui/material"
import Backdrop from "@mui/material/Backdrop"
import Fade from "@mui/material/Fade"
import MuiModal from "@mui/material/Modal"
import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react"
import useTheme, { ThemeColors } from "../common/useTheme"
import { Button } from "./button"
import { IconNames } from "./icon"
/*





*/
export type ModalActionProps = {
  iconName: IconNames
  handleClick: Function
  isDisabled?: boolean
}
type ModalProps = {
  open: boolean
  heading: string
  body: React.ReactElement
  outlineColor?: ThemeColors
  actions?: ModalActionProps[]
  onClose?: Function
}
export default function Modal(props: ModalProps) {
  const theme = useTheme()
  const [open, setOpen] = useState(false)

  function handleClose() {
    setOpen(false)
    props.onClose && props.onClose()
  }

  useEffect(() => {
    setOpen(props.open)
  }, [props.open])

  const styles = {
    transform: "translate(-50%, -50%)",
    outline: `2px solid ${
      theme.scale[props.outlineColor ?? "gray"][props.outlineColor ? 7 : 6]
    } !important`,
    outlineOffset: "-2px",
  }

  return (
    <MuiModal
      open={open}
      onClose={handleClose}
      disablePortal
      disableAutoFocus
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Stack
          width={"95%"}
          maxWidth={theme.module[11]}
          maxHeight={"85%"}
          position={"absolute"}
          top={"50%"}
          left={"50%"}
          boxSizing={"border-box"}
          bgcolor={theme.scale.gray[7]}
          borderRadius={theme.module[3]}
          overflow={"hidden"}
          sx={styles}
        >
          <Stack
            width={"100%"}
            alignItems={"center"}
            padding={theme.module[3]}
            bgcolor={theme.scale.gray[8]}
            boxShadow={theme.shadow.neo[4]}
            boxSizing={"border-box"}
          >
            <Typography fontWeight={"bold"} color={theme.scale.gray[5]}>
              {props.heading}
            </Typography>
          </Stack>
          <Stack
            alignItems={"center"}
            padding={`${theme.module[3]} ${theme.module[3]}`}
            boxSizing={"border-box"}
          >
            {props.body}
          </Stack>
          <Stack
            direction={"row"}
            padding={theme.module[1]}
            paddingTop={0}
            gap={theme.module[1]}
            boxSizing={"border-box"}
            width={"100%"}
            overflow={"visible"}
          >
            {props.actions &&
              props.actions.map((action, index) => (
                <Button
                  variation={"modal"}
                  disabled={action.isDisabled}
                  iconName={action.iconName}
                  outlineColor={theme.scale.gray[7]}
                  onClick={action.handleClick}
                  key={index}
                />
              ))}
          </Stack>
        </Stack>
      </Fade>
    </MuiModal>
  )
}
