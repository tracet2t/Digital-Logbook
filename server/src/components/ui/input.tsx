import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "block w-full rounded-md border shadow-sm transition focus:ring focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "border-gray-300 bg-white text-gray-900",
        outline: "border border-input bg-transparent hover:border-accent",
        ghost: "border-none bg-transparent focus:ring-0",
      },
      inputSize: {  // Renamed 'size' to 'inputSize' to avoid collision
        sm: "px-2 py-1 text-sm",
        default: "px-3 py-2 text-base",
        lg: "px-4 py-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  // No additional properties needed
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, ...props }, ref) => {  // Use 'inputSize' instead of 'size'
    return (
      <input
        className={cn(inputVariants({ variant, inputSize, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
