"use client"
import { Typography } from "@mui/material"
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary"
import { useNavigate } from "react-router-dom"
import useTheme from "../common/useTheme"
import { routePaths } from "../features/core/pages"
import { Button } from "./button"
import { Slot, Window } from "./surface"
/*




*/
export function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: any
  resetErrorBoundary: any
}) {
  const theme = useTheme()
  const navigate = useNavigate()

  const home = routePaths.home.path

  return (
    <Window bgcolor={theme.scale.gray[8]}>
      <Typography fontWeight={"bold"} variant="h5">
        Something went wrong. An error report has been sent.
      </Typography>
      <Slot gap={theme.module[3]}>
        <Button
          variation={"modal"}
          label={"Return home"}
          iconName={"home"}
          onClick={() => navigate(home)}
        />
        <Button
          variation={"modal"}
          label={"Retry"}
          iconName={"retry"}
          onClick={resetErrorBoundary}
        />
      </Slot>
    </Window>
  )
}
/*




*/
type ErrorBoundaryProps = {
  children: React.ReactElement | React.ReactElement[]
  componentName?: string
  featurePath?: string
  state?: {
    component?: {}
    featureUI?: {}
  }
}
export function ErrorBoundary(props: ErrorBoundaryProps) {
  function handleError(error: Error, info: React.ErrorInfo) {
    console.log("error", error)
    console.log("info", info)
    console.log("componentName", props.componentName)
    console.log("state", props.state)
  }

  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback} onError={handleError}>
      {props.children}
    </ReactErrorBoundary>
  )
}
/*




*/
