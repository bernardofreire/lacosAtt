'use client'

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, Users, Activity, LogOut, ChevronDown, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"

const navItems = [
  { icon: Home, label: "Dashboard", href: "/app" },
  { icon: Users, label: "Pessoas", href: "/app/pessoas" },
  { icon: Activity, label: "Atividades", href: "/app/atividades" },
]

export default function Sidebar({ userName }: { userName: string; userEmail: string }) {
  const [activeItem, setActiveItem] = useState("Dashboard")
  const [isAdmin] = useState(true)

  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    return nameParts
      .map(part => part.charAt(0).toUpperCase())
      .join("");
  };

  const userInitials = getInitials(userName)

  return (
    <div className="w-64 h-screen flex flex-col">
      <div className="mb-4 md:mb-0 pl-4 pt-4">
        <Image
          src="/images/logo.svg"
          alt="Logo"
          width={200}
          height={200}
          draggable={false}
        />
      </div>
      <ScrollArea className="space-y-12 flex-1">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <Link href={item.href} key={item.href} passHref>
              <Button
                as="a"
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  activeItem === item.label
                    ? "bg-purple-800 text-white hover:bg-gray-800 hover:text-white"
                    : "text-muted-foreground hover:bg-gray-100"
                )}
                onClick={() => setActiveItem(item.label)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
          {isAdmin && (
            <Link href="/app/usuarios" passHref>
              <Button
                as="a"
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  activeItem === "Users" ? "bg-primary text-white hover:bg-foreground hover:text-white" : "text-muted-foreground hover:bg-gray-100"
                )}
                onClick={() => setActiveItem("Users")}
              >
                <Shield className="mr-2 h-4 w-4" />
                Usuários
              </Button>
            </Link>
          )}
        </nav>
      </ScrollArea>
      <div className="mt-auto p-4 border-t mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-0 h-auto hover:bg-transparent">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <div className="ml-3 text-left">
                <div className="font-medium">{userName}</div>
              </div>
              <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem> */}
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <button onClick={() => signOut()}>Sair</button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
