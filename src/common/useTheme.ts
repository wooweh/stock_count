import { useMemo } from "react"
import { z } from "zod"
import { useAppSelector } from "../app/hooks"
import { selectIsDarkmode } from "../features/core/coreSlice"
import colorScales from "./colorScales"
import { generateModules } from "./utils"

export const GOLDEN_RATIO = 1.618
export const SILVER_RATIO = 1.414
export const MODULE_COUNT = 100

const SizeSchema = z.string().refine((data: string) => data.includes("rem"))
const HexSchema = z.string().refine((data: string) => data.charAt(0) === "#")
export const ShadeIndexSchema = z.number().min(0).max(10)
export const ShadeSchema = z.array(HexSchema).length(10)
export const ModuleSchema = z.number().min(0).max(MODULE_COUNT)
export const ColorSchema = z.enum([
  "primary",
  "secondary",
  "gray",
  "white",
  "black",
  "danger",
  "success",
  "warning",
])

export const ThemeSchema = z.object({
  scale: z.record(
    z.enum([
      "gray",
      "black",
      "white",
      "blue",
      "green",
      "yellow",
      "orange",
      "red",
      "purple",
      "pink",
      "coral",
    ]),
    ShadeSchema,
  ),
  color: z.any(),
  module: z.array(SizeSchema).length(MODULE_COUNT),
  shadow: z.any(),
})
export type ThemeProps = z.infer<typeof ThemeSchema>

export default function useTheme() {
  const primaryHue = "purple"
  const secondaryHue = "green"
  const isDarkmode = useAppSelector(selectIsDarkmode)

  const activeScale = colorScales(isDarkmode ? "dark" : "light")
  const neoShadows = [-2.5, -2, -1.25, 0.75, 1.25, 2, 2.5].map(
    (value, index) => {
      const largeShadow = index > 4 || index < 2
      const darkShadowScale = isDarkmode
        ? largeShadow
          ? 9
          : 10
        : largeShadow
        ? 7
        : 6
      const lightShadowScale = isDarkmode ? (largeShadow ? 7 : 6) : 9
      const darkShadow = activeScale.gray[darkShadowScale]
      const lightShadow = activeScale.gray[lightShadowScale]
      const inset = value < 0
      return `${value}px ${value}px ${(inset ? -value : value) * 2}px ${
        inset ? lightShadow : darkShadow
      } ${inset ? "inset" : ""}, ${-1 * value}px ${-1 * value}px ${
        (inset ? -value : value) * 2
      }px  ${inset ? darkShadow : lightShadow} ${inset ? "inset" : ""}`
    },
  )
  function generate() {
    const shadows = {
      neo: neoShadows,
      std: [],
    }
    return {
      scale: activeScale,
      color: {
        primary: activeScale[primaryHue],
        secondary: activeScale[secondaryHue],
        gray: activeScale.gray,
        white: activeScale.white,
        black: activeScale.black,
        danger: activeScale.red,
        success: activeScale.green,
        warning: activeScale.orange,
      },
      module: generateModules(0.1, MODULE_COUNT, GOLDEN_RATIO),
      shadow: shadows,
    }
  }

  const generated = useMemo(generate, [
    primaryHue,
    secondaryHue,
    activeScale,
    neoShadows,
  ])
  if (!isDarkmode) {
    generated.scale.black = generated.scale.white
  }

  return generated
}
