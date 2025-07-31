import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/providers/auth";
import QueryProvider from "@/providers/query-provider";
import { retrieveServerSession } from "@/utils/auth/options";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Poppins } from 'next/font/google';
import "./globals.css";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "Viaservice PDF Document Processor",
  description: "Upload and process PDF documents",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await retrieveServerSession();


  
  return (
    <html lang="en">


      <body
        className={poppins.variable}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Providers session={session}>

            <QueryProvider>
              <main>

                  {children}
              </main>
              <Toaster />
            </QueryProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
