import * as React from "react"

export interface AvatarProps {
  className?: string
  children?: React.ReactNode
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={className} {...props} />
  )
)
Avatar.displayName = "Avatar"

export { Avatar }
