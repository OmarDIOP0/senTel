"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  Shield,
  Key,
  Settings,
  Activity,
  Users,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Save,
  Edit,
  Crown,
  Zap,
  Globe,
  TrendingUp,
} from "lucide-react"

// Mock data pour l'administrateur
const adminStats = {
  totalUsers: 23,
  activeProjects: 8,
  configurationsManaged: 127,
  reportsGenerated: 45,
  systemUptime: 99.8,
  avgResponseTime: 245,
}

const adminActivityData = [
  { month: "Jan", logins: 45, actions: 120, users: 18 },
  { month: "Fév", logins: 52, actions: 135, users: 20 },
  { month: "Mar", logins: 48, actions: 142, users: 21 },
  { month: "Avr", logins: 61, actions: 158, users: 22 },
  { month: "Mai", logins: 55, actions: 167, users: 23 },
  { month: "Jun", logins: 58, actions: 175, users: 23 },
]

const systemMetrics = [
  { name: "CPU Usage", value: 45, color: "#3b82f6" },
  { name: "Memory", value: 62, color: "#10b981" },
  { name: "Storage", value: 38, color: "#f59e0b" },
  { name: "Network", value: 28, color: "#8b5cf6" },
]

const recentAdminActions = [
  {
    id: 1,
    action: "Création d'utilisateur",
    details: "Nouvel utilisateur Thomas Bernard ajouté",
    timestamp: "2024-01-15 14:30",
    type: "user",
  },
  {
    id: 2,
    action: "Modification de rôle",
    details: "Marie Martin promue au rôle Ingénieur Senior",
    timestamp: "2024-01-15 12:15",
    type: "permission",
  },
  {
    id: 3,
    action: "Configuration système",
    details: "Mise à jour des paramètres de sécurité",
    timestamp: "2024-01-15 10:45",
    type: "system",
  },
  {
    id: 4,
    action: "Validation de rapport",
    details: "Rapport #45 validé pour le Projet Alpha",
    timestamp: "2024-01-14 16:20",
    type: "validation",
  },
]

const securityEvents = [
  {
    id: 1,
    event: "Connexion réussie",
    ip: "192.168.1.100",
    location: "Paris, France",
    timestamp: "2024-01-15 14:30",
    status: "success",
  },
  {
    id: 2,
    event: "Tentative de connexion échouée",
    ip: "203.45.67.89",
    location: "Inconnu",
    timestamp: "2024-01-15 03:22",
    status: "warning",
  },
  {
    id: 3,
    event: "Changement de mot de passe",
    ip: "192.168.1.100",
    location: "Paris, France",
    timestamp: "2024-01-14 09:15",
    status: "info",
  },
]

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const userData = localStorage.getItem("token")
    if (!userData) {
      router.push("/login")
      return
    }
    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "ADMIN") {
      router.push("/dashboard")
      return
    }
    setUser(parsedUser)
    setFormData({
      name: parsedUser.name,
      email: parsedUser.email,
      phone: "+33 1 23 45 67 89",
      department: "Direction Technique",
      bio: "Administrateur système senior avec 10+ ans d'expérience dans les télécommunications et la gestion des infrastructures 5G.",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    setTimeout(() => {
      setSuccess("Profil administrateur mis à jour avec succès")
      setLoading(false)
      setIsEditing(false)
    }, 1000)
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case "user":
        return <Users className="h-4 w-4 text-blue-500" />
      case "permission":
        return <Shield className="h-4 w-4 text-purple-500" />
      case "system":
        return <Settings className="h-4 w-4 text-orange-500" />
      case "validation":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getSecurityStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-100"
      case "warning":
        return "text-red-600 bg-red-100"
      case "info":
        return "text-blue-600 bg-blue-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  if (!user) {
    return <div>Chargement...</div>
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Profil Administrateur</h1>
                <p className="text-gray-600 mt-2">Gestion avancée et supervision système</p>
              </div>
            </div>
          </div>

          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="activity">Activité</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
              <TabsTrigger value="system">Système</TabsTrigger>
            </TabsList>

            {/* Vue d'ensemble */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Admin */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Utilisateurs</p>
                        <p className="text-3xl font-bold">{adminStats.totalUsers}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">Projets</p>
                        <p className="text-3xl font-bold">{adminStats.activeProjects}</p>
                      </div>
                      <Globe className="h-8 w-8 text-green-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">Configurations</p>
                        <p className="text-3xl font-bold">{adminStats.configurationsManaged}</p>
                      </div>
                      <Settings className="h-8 w-8 text-purple-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm">Rapports</p>
                        <p className="text-3xl font-bold">{adminStats.reportsGenerated}</p>
                      </div>
                      <FileText className="h-8 w-8 text-orange-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-teal-100 text-sm">Uptime</p>
                        <p className="text-3xl font-bold">{adminStats.systemUptime}%</p>
                      </div>
                      <Zap className="h-8 w-8 text-teal-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-indigo-100 text-sm">Réponse</p>
                        <p className="text-3xl font-bold">{adminStats.avgResponseTime}ms</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-indigo-200" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Graphiques */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Activité Administrative</CardTitle>
                    <CardDescription>Connexions et actions sur 6 mois</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={adminActivityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="logins" stroke="#3b82f6" strokeWidth={2} name="Connexions" />
                        <Line type="monotone" dataKey="actions" stroke="#10b981" strokeWidth={2} name="Actions" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Métriques Système</CardTitle>
                    <CardDescription>Utilisation des ressources en temps réel</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {systemMetrics.map((metric, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                          <span className="text-sm font-bold" style={{ color: metric.color }}>
                            {metric.value}%
                          </span>
                        </div>
                        <Progress value={metric.value} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Profil */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Informations Administrateur</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-4 bg-red-100 rounded-full">
                        <Shield className="h-8 w-8 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <Badge className="bg-red-100 text-red-800 mt-2">
                          <Crown className="w-3 h-3 mr-1" />
                          Super Administrateur
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Département</span>
                        <span className="text-sm font-medium">{formData.department}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Téléphone</span>
                        <span className="text-sm font-medium">{formData.phone}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Membre depuis</span>
                        <span className="text-sm font-medium flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Jan 2024
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Informations Personnelles</CardTitle>
                        {!isEditing && (
                          <Button variant="outline" onClick={() => setIsEditing(true)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nom complet</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Téléphone</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="department">Département</Label>
                          <Input
                            id="department"
                            value={formData.department}
                            onChange={(e) => handleInputChange("department", e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="bio">Biographie</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => handleInputChange("bio", e.target.value)}
                          disabled={!isEditing}
                          rows={3}
                        />
                      </div>

                      {isEditing && (
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Annuler
                          </Button>
                          <Button onClick={handleSaveProfile} disabled={loading}>
                            {loading ? (
                              "Sauvegarde..."
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Sauvegarder
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Activité */}
            <TabsContent value="activity" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Actions Administratives Récentes</CardTitle>
                  <CardDescription>Historique des dernières actions effectuées</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAdminActions.map((action) => (
                      <div key={action.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 mt-1">{getActionIcon(action.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900">{action.action}</p>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {action.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{action.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sécurité */}
            <TabsContent value="security" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Événements de Sécurité</CardTitle>
                    <CardDescription>Historique des connexions et activités</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {securityEvents.map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{event.event}</p>
                            <p className="text-sm text-gray-600">
                              {event.ip} • {event.location}
                            </p>
                            <p className="text-xs text-gray-500">{event.timestamp}</p>
                          </div>
                          <Badge className={getSecurityStatusColor(event.status)}>
                            {event.status === "success" && "Succès"}
                            {event.status === "warning" && "Alerte"}
                            {event.status === "info" && "Info"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Changer le Mot de Passe</CardTitle>
                    <CardDescription>Sécurisez votre compte administrateur</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) => handleInputChange("newPassword", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      />
                    </div>
                    <Button className="w-full">
                      <Key className="mr-2 h-4 w-4" />
                      Changer le mot de passe
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Système */}
            <TabsContent value="system" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Informations Système</CardTitle>
                  <CardDescription>État et configuration du système</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">99.8%</div>
                      <div className="text-sm text-gray-600">Uptime</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">245ms</div>
                      <div className="text-sm text-gray-600">Temps de réponse</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">2.1GB</div>
                      <div className="text-sm text-gray-600">Mémoire utilisée</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">45%</div>
                      <div className="text-sm text-gray-600">CPU</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
