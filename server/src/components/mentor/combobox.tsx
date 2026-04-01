"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"

interface GenericComboboxProps<T> {
  items: T[]
  value: T | null
  onValueChange: (item: T) => void
  placeholder?: string
  className?: string
  itemToStringValue: (item: T) => string
  renderItem?: (item: T) => React.ReactNode
}

export function GenericCombobox<T>({
  items,
  value,
  onValueChange,
  placeholder = "Select...",
  className,
  itemToStringValue,
  renderItem,
}: GenericComboboxProps<T>) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)
  const listboxId = React.useId()

  const selectedLabel = value ? itemToStringValue(value) : placeholder

  const filteredItems = React.useMemo(() => {
    if (!query.trim()) return items
    const q = query.toLowerCase()
    return items.filter((item) => itemToStringValue(item).toLowerCase().includes(q))
  }, [items, query, itemToStringValue])

  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [])

  return (
    <div ref={containerRef} className={cn("relative w-[200px]", className)}>
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-8 w-full items-center justify-between rounded-lg border border-input bg-background px-2.5 text-sm"
      >
        <span className="truncate text-left">{selectedLabel}</span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="mb-1 h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm outline-none"
          />

          <div className="max-h-60 overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">No results found.</div>
            ) : (
              filteredItems.map((item, index) => {
                const stringVal = itemToStringValue(item)
                const isSelected = value ? itemToStringValue(value) === stringVal : false
                return (
                  <button
                    key={`${stringVal}-${index}`}
                    type="button"
                    onClick={() => {
                      onValueChange(item)
                      setOpen(false)
                      setQuery("")
                    }}
                    className="flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")}
                    />
                    {renderItem ? renderItem(item) : <span>{stringVal}</span>}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}