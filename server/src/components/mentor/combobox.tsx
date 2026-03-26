"use client"

import { useState, useMemo } from "react"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

interface GenericComboboxProps<T> {
  items: T[]                          // Array of items
  value: T | null                     // Selected value
  onValueChange: (item: T) => void    // Callback when value changes
  placeholder?: string
  className?: string                  // Optional custom CSS class
  itemToStringValue: (item: T) => string  // Convert item to string for display
  renderItem?: (item: T) => React.ReactNode // Optional custom render
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
  const [query, setQuery] = useState("")

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!query) return items
    return items.filter(item =>
      itemToStringValue(item).toLowerCase().includes(query.toLowerCase())
    )
  }, [items, query, itemToStringValue])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select() // Select all text so user can easily replace it
  }

  const handleSelect = (item: T) => {
    onValueChange(item)
    setQuery("") // Clear search after selection
  }

  return (
    <Combobox value={value} onValueChange={handleSelect} itemToStringValue={itemToStringValue}>
      <ComboboxInput
        className={className}
        placeholder={placeholder || "Type to search..."}
        value={query || (value ? itemToStringValue(value) : "")}
        onChange={handleInputChange}
        onFocus={handleFocus}
      />
      <ComboboxContent>
        {filteredItems.length === 0 ? (
          <ComboboxEmpty>No items found.</ComboboxEmpty>
        ) : (
          <ComboboxList>
            {filteredItems.map((item) => (
              <ComboboxItem key={itemToStringValue(item)} value={item}>
                {renderItem ? renderItem(item) : itemToStringValue(item)}
              </ComboboxItem>
            ))}
          </ComboboxList>
        )}
      </ComboboxContent>
    </Combobox>
  )
}