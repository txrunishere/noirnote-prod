import { AppSidebar } from "@/components/app-sidebar"
import Header from "@/components/header"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function rootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex flex-1 flex-col">
          <Header layout="root" />
          <div className="container mx-auto flex w-full px-4 py-10">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  )
}
