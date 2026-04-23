import * as React from "react"

export interface AlertProps {
  className?: string
  children?: React.ReactNode
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={className} role="alert" {...props} />
  )
)
Alert.displayName = "Alert"

export { Alert }
