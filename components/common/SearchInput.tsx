"use client"

import * as React from "react"
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type SearchInputProps = {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  className?: string
  "aria-label"?: string
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
  "aria-label": ariaLabel = "Search",
}: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      {/* IMPORTANT: Input is a void element and must not have children */}
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="pl-9"
      />
    </div>
  )
}
