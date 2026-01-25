import * as React from "react"
import { cn } from "@/lib/utils"

interface AccordionContextValue {
  value: string | null
  onValueChange: (value: string | null) => void
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined)

const Accordion = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    type?: "single" | "multiple"
    defaultValue?: string
    value?: string
    onValueChange?: (value: string | null) => void
  }
>(({ className, type = "single", defaultValue, value, onValueChange, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState<string | null>(defaultValue || null)
  const currentValue = value !== undefined ? value : internalValue
  const handleValueChange = onValueChange || setInternalValue

  return (
    <AccordionContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </AccordionContext.Provider>
  )
})
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string
  }
>(({ className, value, ...props }, ref) => {
  const context = React.useContext(AccordionContext)
  if (!context) throw new Error("AccordionItem must be used within Accordion")
  
  const isOpen = context.value === value
  
  return (
    <div
      ref={ref}
      className={cn("border-b", className)}
      {...props}
    />
  )
})
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(AccordionContext)
  if (!context) throw new Error("AccordionTrigger must be used within Accordion")
  
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(AccordionContext)
  if (!context) throw new Error("AccordionContent must be used within Accordion")
  
  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
