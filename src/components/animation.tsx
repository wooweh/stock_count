import { Box, Stack } from "@mui/material"
import { animated, useSpring } from "@react-spring/web"
import { useEffect, useState } from "react"
/* 





*/
type AnimationProps = {
  children: any
  start?: boolean
  position?: string
  from?: { [key: string]: string | number }
  to?: { [key: string]: string | number }
  duration?: number
  delay?: number
  sx?: any
}
export default function Animation(props: AnimationProps) {
  const [isReversed, setIsReversed] = useState(false)
  const [springs, api] = useSpring(() => ({
    from: { ...props.from },
    delay: props.delay,
    config: {
      duration: props.duration,
      clamp: true,
      precision: 0.0001,
    },
  }))

  useEffect(() => {
    function animate() {
      api.start({
        from: { ...props.from },
        to: { ...props.to },
        reverse: isReversed,
        onRest: () => setIsReversed(!isReversed),
      })
    }

    props.start && !isReversed && animate()
    !props.start && isReversed && animate()
  }, [api, props.to, props.from, isReversed, props.start])

  return (
    <animated.div
      style={{ width: "100%", height: "100%", ...props.sx, ...springs }}
    >
      {props.children}
    </animated.div>
  )
}
