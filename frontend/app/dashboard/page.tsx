"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { jwtDecode } from "jwt-decode"
import {
  Line,AreaChart,Area,XAxis,YAxis, CartesianGrid,Tooltip,ResponsiveContainer,PieChart,Pie,Cell,
} from "recharts"
import {
  Settings,
  FileText,
  Users,
  TrendingUp,
  AlertCircle,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  Globe,
  Shield,
  Plus,
  Calendar,
  Target,
} from "lucide-react"

// Mock data améliorées
const performanceData = [
  { month: "Jan", performance: 85, target: 90, configurations: 12 },
  { month: "Fév", performance: 88, target: 90, configurations: 15 },
  { month: "Mar", performance: 92, target: 90, configurations: 18 },
  { month: "Avr", performance: 89, target: 90, configurations: 22 },
  { month: "Mai", performance: 94, target: 90, configurations: 25 },
  { month: "Jun", performance: 96, target: 90, configurations: 28 },
]

const networkCoverageData = [
  { zone: "Urbain Dense", coverage: 95, color: "#10b981" },
  { zone: "Urbain", coverage: 88, color: "#3b82f6" },
  { zone: "Suburbain", coverage: 82, color: "#f59e0b" },
  { zone: "Rural", coverage: 76, color: "#ef4444" },
]

const projectStatusData = [
  { name: "Actifs", value: 8, color: "#10b981" },
  { name: "En cours", value: 5, color: "#3b82f6" },
  { name: "En attente", value: 3, color: "#f59e0b" },
  { name: "Terminés", value: 12, color: "#6b7280" },
]

const recentActivities = [
  {
    id: 1,
    type: "configuration",
    title: "Nouvelle configuration créée",
    description: "Configuration #127 pour Projet Alpha - Zone urbaine dense",
    time: "Il y a 2h",
    user: "Marie Martin",
    status: "success",
  },
  {
    id: 2,
    type: "report",
    title: "Rapport validé",
    description: "Rapport #45 - Performance excellente (96%)",
    time: "Il y a 4h",
    user: "Jean Dupont",
    status: "success",
  },
  {
    id: 3,
    type: "alert",
    title: "Performance dégradée",
    description: "Configuration #118 - Performance sous le seuil (68%)",
    time: "Il y a 6h",
    user: "Système",
    status: "warning",
  },
  {
    id: 4,
    type: "user",
    title: "Nouvel utilisateur",
    description: "Thomas Bernard ajouté avec le rôle CLIENT",
    time: "Il y a 8h",
    user: "Admin",
    status: "info",
  },
]

const topPerformingConfigs = [
  { id: 127, project: "Alpha", performance: 96, zone: "Urbain", trend: "up" },
  { id: 125, project: "Beta", performance: 94, zone: "Rural", trend: "up" },
  { id: 123, project: "Gamma", performance: 92, zone: "Industriel", trend: "stable" },
  { id: 121, project: "Delta", performance: 89, zone: "Suburbain", trend: "down" },
]

const quickStats = [
  {
    title: "Configurations Actives",
    value: "127",
    change: "+12%",
    trend: "up",
    icon: Settings,
    color: "blue",
    description: "vs mois dernier",
  },
  {
    title: "Performance Moyenne",
    value: "92.4%",
    change: "+4.2%",
    trend: "up",
    icon: TrendingUp,
    color: "green",
    description: "objectif: 90%",
  },
  {
    title: "Rapports Générés",
    value: "45",
    change: "+8%",
    trend: "up",
    icon: FileText,
    color: "purple",
    description: "ce mois-ci",
  },
  {
    title: "Utilisateurs Actifs",
    value: "23",
    change: "+3",
    trend: "up",
    icon: Users,
    color: "orange",
    description: "nouveaux cette semaine",
  },
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [timeRange, setTimeRange] = useState("6m")
  const router = useRouter()

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  const decoded = jwtDecode(token);
  setUser(decoded);
}, [router]);

  if (!user) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
          </div>
        </div>
      </div>
    )
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "configuration":
        return <Settings className="h-4 w-4 text-blue-500" />
      case "report":
        return <FileText className="h-4 w-4 text-green-500" />
      case "alert":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "user":
        return <Users className="h-4 w-4 text-purple-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 border-green-200"
      case "warning":
        return "bg-yellow-100 border-yellow-200"
      case "info":
        return "bg-blue-100 border-blue-200"
      default:
        return "bg-gray-100 border-gray-200"
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          {/* Header avec salutation personnalisée */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Bonjour, {user?.email?.split("@")[0] ?? 'Admin'} 👋</h1>
                <p className="text-gray-600 mt-2">
                  Voici un aperçu de vos réseaux 5G •{" "}
                  {new Date().toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Derniers 6 mois
                </Button>
                <Link href="/configurations/create">
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle config
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Cards avec design amélioré */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats.map((stat, index) => (
              <Card
                key={index}
                className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <div className="flex items-baseline space-x-2">
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        <div
                          className={`flex items-center text-sm font-medium ${
                            stat.trend === "up" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {stat.trend === "up" ? (
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 mr-1" />
                          )}
                          {stat.change}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                      <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-600`}
                  ></div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Graphiques principaux */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Performance Evolution */}
            <Card className="lg:col-span-2 border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
                      Évolution des Performances
                    </CardTitle>
                    <CardDescription>Performance moyenne vs objectif sur 6 mois</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Target className="mr-1 h-3 w-3" />
                    Objectif atteint
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="performance"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fill="url(#performanceGradient)"
                    />
                    <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Project Status */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5 text-purple-600" />
                  Statut des Projets
                </CardTitle>
                <CardDescription>Répartition par état d'avancement</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {projectStatusData.map((item, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-600">
                        {item.name}: {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section inférieure */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Network Coverage */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-green-600" />
                  Couverture Réseau par Zone
                </CardTitle>
                <CardDescription>Pourcentage de couverture 5G optimale</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {networkCoverageData.map((zone, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{zone.zone}</span>
                      <span className="text-sm font-bold" style={{ color: zone.color }}>
                        {zone.coverage}%
                      </span>
                    </div>
                    <Progress value={zone.coverage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Performing Configurations */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-blue-600" />
                  Meilleures Configurations
                </CardTitle>
                <CardDescription>Top 4 des configurations les plus performantes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPerformingConfigs.map((config, index) => (
                    <div key={config.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-sm font-bold text-blue-600">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            #{config.id} - {config.project}
                          </p>
                          <p className="text-sm text-gray-500">{config.zone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-green-600">{config.performance}%</span>
                        {config.trend === "up" && <ArrowUpRight className="h-4 w-4 text-green-500" />}
                        {config.trend === "down" && <ArrowDownRight className="h-4 w-4 text-red-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activité récente */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-orange-600" />
                    Activité Récente
                  </CardTitle>
                  <CardDescription>Les dernières actions sur la plateforme</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  Voir tout
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`flex items-start space-x-4 p-4 rounded-lg border ${getStatusColor(activity.status)}`}
                  >
                    <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-2">Par {activity.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
