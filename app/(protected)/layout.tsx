import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"

export const metadata: Metadata = {
  title: "KasaAfrica - Protected Area",
  description: "Secure healthcare management portal",
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return         <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
          themes={["light", "dark", "system"]}
          storageKey="kasaafrica-theme"
        >{children}</ThemeProvider>
}
