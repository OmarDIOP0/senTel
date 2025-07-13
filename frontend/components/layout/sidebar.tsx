"use client"

import { useContext, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Settings,
  FileText,
  BarChart3,
  Users,
  FolderOpen,
  Bell,
  User,
  LogOut,
  Wifi,
  Menu,
  X,
} from "lucide-react"
import AuthContext from "@/context/AuthContext"
import { getAllNotifications } from "@/services/notificationService"
import { useAdminService } from "@/services/useAdminService"

const navigation = [
  { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { name: "Configurations", href: "/configurations", icon: Settings },
  { name: "Rapports", href: "/rapports", icon: FileText },
  { name: "Projets", href: "/projets", icon: FolderOpen },
  // { name: "Statistiques", href: "/statistiques", icon: BarChart3 },
  { name: "Utilisateurs", href: "/utilisateurs", icon: Users },
  { name: "Notifications", href: "/notifications", icon: Bell },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<any>([])
  const pathname = usePathname()
  const router = useRouter()

const {logoutUser} = useContext(AuthContext);
  // Define the expected type for profileData
  type ProfileData = {
    nomComplet?: string
    email?: string
    // add other properties if needed
  }
    useEffect(() => {
      const fetchNotifications = async () => {
          const data = await getAllNotifications()
          setNotifications(data.data || [])
          console.log("Notifications fetched:", data.data)
      }
  
      fetchNotifications()
    }, [])
   const lengthNotifications = notifications.length;
    const { profileData, loading, error } = useAdminService() as {
      profileData: ProfileData | null,
      loading: boolean,
      error: any
    };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)} className="bg-white">
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Wifi className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">SenTel</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                  {item.name === "Notifications" && (
                    <Badge variant="destructive" className="ml-auto">
                      {lengthNotifications > 0 ? lengthNotifications : "0"}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-gray-100 rounded-full">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{profileData?.nomComplet}</p>
                <p className="text-xs text-gray-500">{profileData?.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Link
                href="/profile"
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                <User className="mr-3 h-4 w-4" />
                Profil
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={logoutUser}
              >
                <LogOut className="mr-3 h-4 w-4"/>
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
