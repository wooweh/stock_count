import ButtonBase from "@mui/material/ButtonBase"
import useTheme from "../common/useTheme"
import { useEffect, useState } from "react"
/*





*/
type ButtonVariations = "profile" | "modal" | "icon" | "home"
type AnimationDurations = 150 | 200
type ButtonProps = {
  variation: ButtonVariations
  animationDuration?: AnimationDurations
  children: string | React.ReactElement
  onClick: any
}
export function Button(props: ButtonProps) {
  const theme = useTheme()
  const [isPressed, setIsPressed] = useState(false)
  const [isThrottled, setIsThrottled] = useState(false)
  const duration = props.animationDuration ? props.animationDuration : 250
  /*


*/
  function handleClick() {
    if (!isThrottled) {
      setIsThrottled(true)
      setIsPressed(true)
      setTimeout(() => setIsPressed(false), duration / 2)
      setTimeout(() => props.onClick(), 250)
    }
  }
  /*


*/
  useEffect(() => {
    if (isThrottled) setTimeout(() => setIsThrottled(false), 350)
  }, [isThrottled])

  const commonStyles = {
    transition: `transform ${duration / 2}ms, box-shadow ${duration / 2}ms`,
  }

  const VARIATIONS = {
    profile: {
      background: theme.scale.gray[8],
      padding: theme.module[4],
      color: theme.scale.gray[3],
      borderRadius: theme.module[3],
      width: "100%",
      outline: `2px solid ${theme.scale.gray[7]} !important`,
      transform: `scale(${isPressed ? 0.975 : 1})`,
      ...commonStyles,
    },
    modal: {
      width: "100%",
      padding: theme.module[3],
      color: theme.scale.gray[4],
      background: theme.scale.gray[9],
      borderRadius: theme.module[3],
      transform: `scale(${isPressed ? 0.975 : 1})`,
      ...commonStyles,
    },
    home: {
      background: theme.scale.gray[8],
      width: "100%",
      borderRadius: theme.module[3],
      boxShadow: theme.shadow.neo[isPressed ? 5 : 6],
      overflow: "hidden",
      justifyContent: "flex-start",
      transform: `scale(${isPressed ? 0.975 : 1})`,
      ...commonStyles,
    },
    icon: {
      borderRadius: theme.module[5],
      padding: theme.module[2],
      transform: `scale(${isPressed ? 0.8 : 1})`,
      ...commonStyles,
      transition: "transform 250ms",
    },
  }

  const styles = VARIATIONS[props.variation as keyof typeof VARIATIONS]

  return (
    <ButtonBase disableRipple onMouseDown={handleClick} sx={styles}>
      {props.children}
    </ButtonBase>
  )
}
