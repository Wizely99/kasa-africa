import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import QueryProvider from "@/providers/query-provider"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { Providers } from "@/providers/auth"
import { retrieveServerSession } from "@/utils/auth/options"
import { ThemeProvider } from "@/components/theme-provider"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "KasaAfrica - Healthcare Platform",
  description: "Connecting you to quality healthcare across Africa",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await retrieveServerSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.variable}>
        <ThemeProvider
          // attribute="class"
          defaultTheme="light"
          // enableSystem
          // disableTransitionOnChange={false}
          // themes={["light", "dark", "system"]}
          storageKey="kasaafrica-theme"
        >
             <Providers session={session}>

          <QueryProvider>
            <main className="min-h-screen bg-background font-sans antialiased">{children}</main>
            <Toaster />
          </QueryProvider>
             </Providers>
        </ThemeProvider>

      </body>
    </html>
  )
}
