"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="bg-transparent">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


// "use client"

// import { useState } from "react"
// import { MoonIcon, SunIcon } from "lucide-react"

// import { Toggle } from "@/components/ui/toggle"

// export default function Component() {
//   const [theme, setTheme] = useState<string>("light")

//   return (
//     <div>
//       <Toggle
//         variant="outline"
//         className="group data-[state=on]:hover:bg-muted size-9 data-[state=on]:bg-transparent"
//         pressed={theme === "dark"}
//         onPressedChange={() =>
//           setTheme((prev) => (prev === "dark" ? "light" : "dark"))
//         }
//         aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
//       >
//         {/* Note: After dark mode implementation, rely on dark: prefix rather than group-data-[state=on]: */}
//         <MoonIcon
//           size={16}
//           className="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
//           aria-hidden="true"
//         />
//         <SunIcon
//           size={16}
//           className="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
//           aria-hidden="true"
//         />
//       </Toggle>
//     </div>
//   )
// }
