"use client"
import { Typography } from "@mui/material"
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary"
import { Window } from "./surface"
/*




*/
export function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: any
  resetErrorBoundary: any
}) {
  return (
    <Window bgcolor={"blue"}>
      <Typography fontWeight={"bold"} variant="h5">
        Something went wrong.
      </Typography>
    </Window>
  )
}
/*




*/
export function ErrorBoundary({
  children,
}: {
  children: React.ReactElement | React.ReactElement[]
}) {
  function handleError(error: Error, info: React.ErrorInfo) {
    console.log(error, info)
  }

  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback} onError={handleError}>
      {children}
    </ReactErrorBoundary>
  )
}
/*




*/
