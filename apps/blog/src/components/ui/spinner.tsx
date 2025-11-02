import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function Spinner({
  className,
  size = 20,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { size?: number }) {
  return (
    <div 
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <Loader2 className="animate-spin" size={size} />
    </div>
  )
}

export function ButtonSpinner() {
  return <Spinner className="mr-2 h-4 w-4" />
}
