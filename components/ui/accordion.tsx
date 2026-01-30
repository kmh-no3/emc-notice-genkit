import * as React from "react"
import { cn } from "@/lib/utils"

interface AccordionContextValue {
  type: "single" | "multiple"
  value: string | string[] | null
  onValueChange: (value: string | string[] | null) => void
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined)

interface AccordionItemContextValue {
  value: string
  isOpen: boolean
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | undefined>(undefined)

function parseDefaultValue(
  type: "single" | "multiple",
  defaultValue?: string | string[]
): string | string[] | null {
  if (defaultValue === undefined || defaultValue === null) return null
  if (type === "multiple" && Array.isArray(defaultValue)) return defaultValue
  if (type === "single" && typeof defaultValue === "string") return defaultValue
  if (type === "multiple" && typeof defaultValue === "string") return [defaultValue]
  return null
}

const Accordion = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    type?: "single" | "multiple"
    collapsible?: boolean
    defaultValue?: string | string[]
    value?: string | string[]
    onValueChange?: (value: string | string[] | null) => void
  }
>(({ className, type = "single", collapsible: _collapsible, defaultValue, value, onValueChange, ...props }, ref) => {
  const parsedDefault = parseDefaultValue(type, defaultValue)
  const [internalValue, setInternalValue] = React.useState<string | string[] | null>(parsedDefault)
  const currentValue = value !== undefined ? value : internalValue
  const handleValueChange = onValueChange || setInternalValue

  const contextValue: AccordionContextValue = {
    type,
    value: currentValue,
    onValueChange: handleValueChange,
  }

  return (
    <AccordionContext.Provider value={contextValue}>
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

  const isOpen =
    context.type === "single"
      ? context.value === value
      : Array.isArray(context.value) && context.value.includes(value)

  const itemContextValue: AccordionItemContextValue = { value, isOpen }

  return (
    <AccordionItemContext.Provider value={itemContextValue}>
      <div
        ref={ref}
        className={cn("border-b", className)}
        data-state={isOpen ? "open" : "closed"}
        {...props}
      />
    </AccordionItemContext.Provider>
  )
})
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, onClick, ...props }, ref) => {
  const context = React.useContext(AccordionContext)
  const itemContext = React.useContext(AccordionItemContext)
  if (!context) throw new Error("AccordionTrigger must be used within Accordion")
  if (!itemContext) throw new Error("AccordionTrigger must be used within AccordionItem")

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (context.type === "single") {
      const next = context.value === itemContext.value ? null : itemContext.value
      context.onValueChange(next)
    } else {
      const current = Array.isArray(context.value) ? context.value : []
      const next = current.includes(itemContext.value)
        ? current.filter((v) => v !== itemContext.value)
        : [...current, itemContext.value]
      context.onValueChange(next.length > 0 ? next : null)
    }
    onClick?.(e)
  }

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      data-state={itemContext.isOpen ? "open" : "closed"}
      aria-expanded={itemContext.isOpen}
      onClick={handleClick}
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
  const itemContext = React.useContext(AccordionItemContext)
  if (!itemContext) throw new Error("AccordionContent must be used within AccordionItem")

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className
      )}
      data-state={itemContext.isOpen ? "open" : "closed"}
      hidden={!itemContext.isOpen}
      {...props}
    >
      {children}
    </div>
  )
})
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
