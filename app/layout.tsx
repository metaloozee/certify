import "./globals.css"

import { GeistSans } from "geist/font/sans"

import { Toaster } from "@/components/ui/toaster"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import SupabaseProvider from "@/app/supabase-provider"

export const metadata = {
    title: "Certify",
    description: "College Event Management Application",
}

export const dynamic = "force-dynamic"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={GeistSans.className}>
            <body>
                <SupabaseProvider>
                    <ThemeProvider attribute="class" defaultTheme="dark">
                        <div className="relative flex min-h-screen flex-col">
                            <Navbar />
                            <div className="flex my-10 md:mt-10 md:mb-20 items-center justify-center">
                                {children}
                            </div>
                            <Toaster />
                            <Footer />
                        </div>
                    </ThemeProvider>
                </SupabaseProvider>
            </body>
        </html>
    )
}
