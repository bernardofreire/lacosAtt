"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Menu, Search, Home, Users, Activity, UserCircle } from "lucide-react"

const navItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Users, label: "Peoples", href: "/peoples" },
  { icon: Activity, label: "Activities", href: "/activities" },
  { icon: UserCircle, label: "Users", href: "/users" },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState("Dashboard")

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SidebarContent />
      </SheetContent>

      <div className="hidden md:flex">
        <SidebarContent />
      </div>
    </Sheet>
  )

  function SidebarContent() {
    return (
      <div className="flex flex-col ">
        <div className="p-4">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Eden
          </h2>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search" className="pl-8" />
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    active === item.label && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => setActive(item.label)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        </div>
        <ScrollArea className="flex-1">
          {/* Add scrollable content here if needed */}
        </ScrollArea>
      </div>
    )
  }
}