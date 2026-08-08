import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "DBMS Quiz 2 Prep",
  description: "Interactive prep app for DBMS Quiz 2 — practice questions, labs, and mastery tracking.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
