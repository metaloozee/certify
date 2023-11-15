import "./globals.css"

import { Toaster } from "@/components/ui/toaster"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import SupabaseProvider from "@/app/supabase-provider"

export const metadata = {
    title: "Ceritfy",
    description: "Generated by create next app",
}

export const dynamic = "force-dynamic"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <SupabaseProvider>
                    <ThemeProvider attribute="class" defaultTheme="dark">
                        <div className="relative flex min-h-screen flex-col">
                            <Navbar />
                            <div className="flex my-10 md:mt-10 md:mb-20 items-center justify-center">
                                {children}
                            </div>
                            <div className="md:fixed flex justify-center items-center bottom-0 right-0 left-0 text-center">
                                <Footer />
                            </div>
                        </div>
                    </ThemeProvider>
                </SupabaseProvider>
            </body>
        </html>
    )
}
