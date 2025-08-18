import type React from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { retrieveServerSession } from "@/utils/auth/options";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "KasaAfrica - Protected Area",
  description: "Secure healthcare management portal",
};

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await retrieveServerSession();

  // if (!session || session.error) {
  //   redirect("/");
  // }
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange={false}
      themes={["light", "dark", "system"]}
      storageKey="kasaafrica-theme"
    >
      {children}
    </ThemeProvider>
  );
}
