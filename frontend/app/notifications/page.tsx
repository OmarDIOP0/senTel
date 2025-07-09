"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell,
  Search,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  Trash2,
  BookMarkedIcon as MarkAsUnread,
  Settings,
} from "lucide-react"

// Mock data
const notifications = [
  {
    id: 1,
    title: "Nouveau rapport généré",
    description: "Le rapport pour la configuration #127 du Projet Alpha a été généré avec succès",
    type: "success",
    status: "NON_LU",
    createdAt: "2024-01-15 14:30",
    relatedId: 127,
    relatedType: "configuration",
  },
  {
    id: 2,
    title: "Configuration en attente de validation",
    description: "La configuration #125 du Projet Beta nécessite une validation d'ingénieur",
    type: "warning",
    status: "NON_LU",
    createdAt: "2024-01-15 12:15",
    relatedId: 125,
    relatedType: "configuration",
  },
  {
    id: 3,
    title: "Nouvel utilisateur ajouté",
    description: "Thomas Bernard a été ajouté au système avec le rôle CLIENT",
    type: "info",
    status: "LU",
    createdAt: "2024-01-15 10:45",
    relatedId: 5,
    relatedType: "user",
  },
  {
    id: 4,
    title: "Rapport validé",
    description: "Le rapport #23 du Projet Gamma a été validé par l'équipe technique",
    type: "success",
    status: "LU",
    createdAt: "2024-01-14 16:20",
    relatedId: 23,
    relatedType: "rapport",
  },
  {
    id: 5,
    title: "Maintenance programmée",
    description: "Maintenance système prévue ce weekend de 2h à 6h du matin",
    type: "warning",
    status: "NON_LU",
    createdAt: "2024-01-14 09:00",
    relatedId: null,
    relatedType: "system",
  },
  {
    id: 6,
    title: "Performance dégradée détectée",
    description: "La configuration #118 montre des performances inférieures à 70%",
    type: "error",
    status: "NON_LU",
    createdAt: "2024-01-13 15:30",
    relatedId: 118,
    relatedType: "configuration",
  },
  {
    id: 7,
    title: "Nouveau projet créé",
    description: "Le Projet Delta a été créé et est maintenant disponible",
    type: "info",
    status: "LU",
    createdAt: "2024-01-13 11:15",
    relatedId: 4,
    relatedType: "project",
  },
  {
    id: 8,
    title: "Sauvegarde automatique effectuée",
    description: "Sauvegarde quotidienne des données terminée avec succès",
    type: "success",
    status: "LU",
    createdAt: "2024-01-13 02:00",
    relatedId: null,
    relatedType: "system",
  },
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case "warning":
      return <AlertCircle className="h-5 w-5 text-yellow-500" />
    case "error":
      return <AlertCircle className="h-5 w-5 text-red-500" />
    case "info":
      return <Info className="h-5 w-5 text-blue-500" />
    default:
      return <Bell className="h-5 w-5 text-gray-500" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "NON_LU":
      return <Badge className="bg-blue-100 text-blue-800">Non lu</Badge>
    case "LU":
      return <Badge variant="secondary">Lu</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getTypeBadge = (type: string) => {
  switch (type) {
    case "success":
      return <Badge className="bg-green-100 text-green-800">Succès</Badge>
    case "warning":
      return <Badge className="bg-yellow-100 text-yellow-800">Attention</Badge>
    case "error":
      return <Badge className="bg-red-100 text-red-800">Erreur</Badge>
    case "info":
      return <Badge className="bg-blue-100 text-blue-800">Info</Badge>
    default:
      return <Badge variant="outline">{type}</Badge>
  }
}

export default function NotificationsPage() {
  const [user, setUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const router = useRouter()

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || notification.type === filterType
    const matchesStatus = filterStatus === "all" || notification.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const unreadCount = notifications.filter((n) => n.status === "NON_LU").length

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-2">Gérez vos notifications système • {unreadCount} non lue(s)</p>
            </div>
            <div className="flex space-x-2 mt-4 sm:mt-0">
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </Button>
              <Button>Marquer tout comme lu</Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Bell className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <MarkAsUnread className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Non lues</p>
                    <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Succès</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {notifications.filter((n) => n.type === "success").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <AlertCircle className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Alertes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {notifications.filter((n) => n.type === "warning" || n.type === "error").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher dans les notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="success">Succès</SelectItem>
                    <SelectItem value="warning">Attention</SelectItem>
                    <SelectItem value="error">Erreur</SelectItem>
                    <SelectItem value="info">Information</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="NON_LU">Non lu</SelectItem>
                    <SelectItem value="LU">Lu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`hover:shadow-md transition-shadow ${
                  notification.status === "NON_LU" ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">{notification.title}</h3>
                          <p className="text-gray-600 mb-3">{notification.description}</p>
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {notification.createdAt}
                            </div>
                            {notification.relatedId && <div>ID: #{notification.relatedId}</div>}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {getTypeBadge(notification.type)}
                          {getStatusBadge(notification.status)}
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredNotifications.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Bell className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune notification trouvée</h3>
                  <p className="mt-2 text-gray-500">Aucune notification ne correspond à vos critères de recherche.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
