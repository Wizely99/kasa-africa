"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bold, Italic, Underline, List, ListOrdered, Link, Quote, Heading1, Heading2, Heading3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ value, onChange, placeholder = "Start writing...", className }: RichTextEditorProps) {
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null)

  const insertText = (before: string, after = "") => {
    if (!textareaRef) return

    const start = textareaRef.selectionStart
    const end = textareaRef.selectionEnd
    const selectedText = value.substring(start, end)

    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
    onChange(newText)

    // Restore cursor position
    setTimeout(() => {
      textareaRef.focus()
      textareaRef.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const formatButtons = [
    {
      icon: Bold,
      label: "Bold",
      action: () => insertText("**", "**"),
    },
    {
      icon: Italic,
      label: "Italic",
      action: () => insertText("*", "*"),
    },
    {
      icon: Underline,
      label: "Underline",
      action: () => insertText("<u>", "</u>"),
    },
    {
      icon: Heading1,
      label: "Heading 1",
      action: () => insertText("# "),
    },
    {
      icon: Heading2,
      label: "Heading 2",
      action: () => insertText("## "),
    },
    {
      icon: Heading3,
      label: "Heading 3",
      action: () => insertText("### "),
    },
    {
      icon: List,
      label: "Bullet List",
      action: () => insertText("- "),
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      action: () => insertText("1. "),
    },
    {
      icon: Quote,
      label: "Quote",
      action: () => insertText("> "),
    },
    {
      icon: Link,
      label: "Link",
      action: () => insertText("[", "](url)"),
    },
  ]

  return (
    <div className={cn("border rounded-md", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
        {formatButtons.map((button, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            onClick={button.action}
            className="h-8 w-8 p-0"
            title={button.label}
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      {/* Editor */}
      <Textarea
        ref={setTextareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[300px] border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />

      {/* Preview hint */}
      <div className="px-3 py-2 text-xs text-muted-foreground border-t bg-muted/30">
        Supports Markdown formatting. Use the toolbar buttons or type Markdown syntax directly.
      </div>
    </div>
  )
}
