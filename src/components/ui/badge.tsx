import { cva, type VariantProps } from "class-variance-authority"
import { type ComponentProps } from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-2.5 rounded-md border px-4 py-1.5 text-[13px] font-semibold tracking-[0.08em] uppercase",
  {
    variants: {
      variant: {
        amber: "border-amber-100 bg-amber-50 text-amber-700",
        brand: "border-brand-200 bg-brand-50 text-brand-800",
        neutral: "border-stone-200 bg-white text-stone-600",
      },
    },
    defaultVariants: {
      variant: "amber",
    },
  },
)

type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>

function Badge({ className, variant = "amber", ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants }
