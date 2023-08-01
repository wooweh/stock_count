import { InputAdornment } from "@mui/material"
import Input from "@mui/material/InputBase"
import Slider from "@mui/material/Slider"
import Switch from "@mui/material/Switch"
import { useState } from "react"
import { SxProps } from "../common/types"
import { Button } from "./button"
import Icon from "./icon"
import useTheme from "../common/useTheme"
/*





*/
export type ControlNames =
  | "slider"
  | "switch"
  | "input"
  | "select"
  | "multiSelect"
export type ControlsProps = {
  variation: ControlNames
  value: any
  onChange: any
  placeholder?: string
  disabled?: boolean
  type?: "password"
  sx?: SxProps
}
export function Control(props: ControlsProps) {
  const theme = useTheme()
  const [showPassword, setShowPassword] = useState(false)
  /*


*/
  function handleClickShowPassword() {
    setShowPassword((show) => !show)
  }
  /*


*/
  const CONTROLS = {
    slider: (
      <Slider
        value={Number(props.value)}
        onChange={props.onChange}
        sx={props.sx}
      />
    ),
    switch: (
      <Switch
        value={props.value}
        checked={Boolean(props.value)}
        onChange={props.onChange}
        sx={props.sx}
      />
    ),
    input: (
      <Input
        fullWidth={true}
        type={
          props.type === "password"
            ? showPassword
              ? "text"
              : "password"
            : "text"
        }
        placeholder={props.placeholder}
        onChange={props.onChange}
        value={props.value}
        disabled={props.disabled}
        sx={{
          ...props.sx,
          transition: "background 250ms",
          paddingRight: theme.module[1],
        }}
        endAdornment={
          props.type === "password" ? (
            <InputAdornment position="end">
              <Button variation="icon" onClick={handleClickShowPassword}>
                <Icon
                  variation={showPassword ? "notVisible" : "visible"}
                  color={theme.scale.gray[6]}
                />
              </Button>
            </InputAdornment>
          ) : undefined
        }
      />
    ),
    select: <div>x</div>,
    multiSelect: <div>x</div>,
  }

  return CONTROLS[props.variation as keyof typeof CONTROLS]
}
/*





*/
