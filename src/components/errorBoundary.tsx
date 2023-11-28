import { useEffect, useState } from "react"
/*




*/
type ErrorBoundaryProps = {
  child: React.ReactElement
  componentName: string
  UIState: {
    [key: string]: any
  }
  componentProps?: {
    [key: string]: any
  }
}
export function ErrorBoundary(props: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    function handleErrors(event: ErrorEvent) {
      // TODO:
      setHasError(true)
    }

    window.addEventListener("error", handleErrors)

    return () => window.removeEventListener("error", handleErrors)
  }, [])

  return hasError ? <p>Something went wrong.</p> : props.child
}
/*




*/
