import { Stack } from "@mui/material"
import Backdrop from "@mui/material/Backdrop"
import Fade from "@mui/material/Fade"
import MuiModal from "@mui/material/Modal"
import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react"
import useTheme from "../common/useTheme"
import { Button } from "./button"
import Icon, { IconNames } from "./icon"
/*





*/
type ModalProps = {
  open: boolean
  heading: string
  body: React.ReactElement
  actions: { iconName: IconNames; handleClick: Function }[]
  onClose: Function
}
export default function Modal(props: ModalProps) {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
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
            alignItems={"center"}
            padding={theme.module[3]}
            bgcolor={theme.scale.gray[8]}
          >
            <Typography>{props.heading}</Typography>
          </Stack>
          <Stack alignItems={"center"} padding={theme.module[4]}>
            {props.body}
          </Stack>
          <Stack
            direction={"row"}
            padding={theme.module[4]}
            paddingTop={0}
            gap={theme.module[4]}
            boxSizing={"border-box"}
            width={"100%"}
          >
            {props.actions.map((action, index) => (
              <Button
                variation={"modal"}
                key={index}
                onClick={action.handleClick}
              >
                <Icon variation={action.iconName} />
              </Button>
            ))}
            {/* {props.footer} */}
          </Stack>
        </Stack>
        {/* </Stack> */}
      </Fade>
    </MuiModal>
  )
}
