import type React from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/Header/page"
import { SchoolSidebar } from "@/components/Sidebar/page"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import Footer from "@/components/Footer/page"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <SidebarProvider>
      <SchoolSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  )
}
