import { InputAdornment } from "@mui/material"
import MuiInput from "@mui/material/InputBase"
import MenuItem from "@mui/material/MenuItem"
import MuiSelect, { SelectChangeEvent } from "@mui/material/Select"
import MuiSlider from "@mui/material/Slider"
import MuiSwitch from "@mui/material/Switch"
import _ from "lodash"
import { useState } from "react"
import useTheme from "../common/useTheme"
import { Button } from "./button"
/*





*/
type SliderProps = {
  value: number
  onChange: any
  sx?: any
}
export function Slider(props: SliderProps) {
  return (
    <MuiSlider value={props.value} onChange={props.onChange} sx={props.sx} />
  )
}
/*





*/
type SwitchProps = {
  value: boolean
  onChange: any
  sx?: any
}
export function Switch(props: SwitchProps) {
  return (
    <MuiSwitch
      value={props.value}
      checked={props.value}
      onChange={props.onChange}
      sx={props.sx}
    />
  )
}
/*





*/
type InputProps = {
  value: string | number
  onChange: any
  placeholder?: string
  disabled?: boolean
  isPassword?: boolean
  isNumber?: boolean
  multiline?: boolean
  autoFocus?: boolean
  spellCheck?: boolean
  onFocus?: any
  onBlur?: any
  readOnly?: any
  inputProps?: any
  sx?: any
}
export function Input(props: InputProps) {
  const theme = useTheme()

  const [showPassword, setShowPassword] = useState(false)

  function handleClickShowPassword() {
    setShowPassword((show) => !show)
  }

  const type = props.isNumber
    ? "number"
    : props.isPassword
    ? showPassword
      ? "text"
      : "password"
    : "text"

  return (
    <MuiInput
      fullWidth={true}
      autoFocus={props.autoFocus}
      type={type}
      placeholder={props.placeholder}
      onChange={props.onChange}
      value={props.value}
      disabled={props.disabled}
      multiline={props.multiline}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      readOnly={props.readOnly}
      inputProps={props.inputProps}
      spellCheck={!!props.spellCheck}
      sx={props.sx}
      endAdornment={
        props.isPassword && (
          <InputAdornment position="end">
            <Button
              variation={"pill"}
              onClick={handleClickShowPassword}
              iconName={showPassword ? "notVisible" : "visible"}
              iconColor={theme.scale.gray[6]}
            />
          </InputAdornment>
        )
      }
    />
  )
}
/*





*/
type SelectProps = {
  options: string[]
  onChange?: Function
  value?: string
  displayEmpty?: boolean
  placeholder?: string
  width?: string
}
export function Select(props: SelectProps) {
  const theme = useTheme()
  const [isOpen, setIsOpen]: any = useState()

  const menuItemStyles = {
    background: theme.scale.gray[7],
    color: theme.scale.gray[3],
  }

  const selectStyles = {
    height: theme.module[6],
    width: props.width ? props.width : "100%",
    borderRadius: isOpen
      ? `${theme.module[3]} ${theme.module[3]} 0 0`
      : `${theme.module[3]}`,
    transition: "border-radius ease-in 50ms",
    background: theme.scale.gray[7],
    color: theme.scale.gray[3],
    padding: 0,
    boxSizing: "border-box",
    boxShadow: isOpen ? "none !important" : theme.shadow.neo[2],
    border: `1px solid ${theme.scale.gray[6]}`,
    "& .MuiOutlinedInput-notchedOutline ": {
      border: "none",
      borderColor: isOpen
        ? `${theme.scale.gray[6]} !important`
        : `${theme.scale.gray[6]} !important`,
    },
    "& .MuiSelect-icon": {
      color: theme.scale.gray[5],
    },
  }

  const paperStyles = {
    borderRadius: `0 0 ${theme.module[3]} ${theme.module[3]}`,
    border: `1px solid ${theme.scale.gray[6]}`,
    background: theme.scale.gray[7],
    "& .MuiList-root": {
      padding: 0,
    },
  }

  return (
    <MuiSelect
      value={props.value ? _.capitalize(props.value) : ""}
      onChange={(e: SelectChangeEvent) => {
        props.onChange?.(e.target.value as string)
      }}
      displayEmpty
      renderValue={(selected: any) => {
        if (selected.length === 0) {
          return (
            <em style={{ color: theme.scale.gray[5] }}>{props.placeholder}</em>
          )
        } else {
          return selected
        }
      }}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      sx={selectStyles}
      MenuProps={{ PaperProps: { sx: paperStyles } }}
    >
      {props.options.map((option: any, index: any) => {
        return (
          <MenuItem value={option} sx={{ ...menuItemStyles }} key={index}>
            {_.capitalize(option)}
          </MenuItem>
        )
      })}
    </MuiSelect>
  )
}
/*





*/
