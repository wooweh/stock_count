import { Stack } from "@mui/material"
import Backdrop from "@mui/material/Backdrop"
import Fade from "@mui/material/Fade"
import MuiModal from "@mui/material/Modal"
import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react"
import useTheme from "../common/useTheme"
import Animation from "./animation"
import { Button } from "./button"
import Icon, { IconNames } from "./icon"
/*





*/
export type ModalActionProps = {
  iconName: IconNames
  handleClick: Function
}
type ModalProps = {
  open: boolean
  heading: string
  body: React.ReactElement
  show?: "footer" | "actions"
  footer?: React.ReactElement
  actions?: ModalActionProps[]
  onClose: Function
}
export default function Modal(props: ModalProps) {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const showFooter = props.show === "footer"
  const showActions = props.show === "actions"
  /*
  

  */
  function handleClose() {
    setOpen(false)
    props.onClose()
  }
  /*
  

  */
  useEffect(() => {
    setOpen(props.open)
  }, [props.open])

  const styles = {
    transform: "translate(-50%, -50%)",
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
            <Typography>{props.heading}</Typography>
          </Stack>
          <Stack
            alignItems={"center"}
            padding={theme.module[4]}
            boxSizing={"border-box"}
          >
            {props.body}
          </Stack>
          <Stack
            direction={"row"}
            padding={!showActions && !showFooter ? 0 : theme.module[4]}
            paddingTop={0}
            gap={theme.module[4]}
            boxSizing={"border-box"}
            width={"100%"}
            overflow={"visible"}
          >
            {showActions &&
              props.actions &&
              props.actions.map((action, index) => (
                <Animation
                  from={{ opacity: 0 }}
                  to={{ opacity: 1 }}
                  start={true}
                  key={index}
                >
                  <Button
                    variation={"modal"}
                    iconName={action.iconName}
                    onClick={action.handleClick}
                  />
                </Animation>
              ))}
            {showFooter && (
              <Animation from={{ opacity: 0 }} to={{ opacity: 1 }} start={true}>
                {props.footer}
              </Animation>
            )}
          </Stack>
        </Stack>
      </Fade>
    </MuiModal>
  )
}
