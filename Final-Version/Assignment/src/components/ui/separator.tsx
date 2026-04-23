import * as React from "react"

export interface SeparatorProps {
  className?: string
}

const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>(
  ({ className, ...props }, ref) => (
    <hr ref={ref} className={className} {...props} />
  )
)
Separator.displayName = "Separator"

export { Separator }
