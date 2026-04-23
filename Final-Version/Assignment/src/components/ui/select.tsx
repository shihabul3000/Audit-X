import * as React from "react"

export interface SelectProps {
  className?: string
  children?: React.ReactNode
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={className} {...props} />
  )
)
Select.displayName = "Select"

export { Select }
