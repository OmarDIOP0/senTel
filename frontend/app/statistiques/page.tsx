"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from "recharts"
import { TrendingUp, BarChart3, PieChartIcon, Activity } from "lucide-react"

// Mock data pour les statistiques
const puissanceData = [
  { range: "-100 à -90", count: 5 },
  { range: "-90 à -80", count: 12 },
  { range: "-80 à -70", count: 18 },
  { range: "-70 à -60", count: 8 },
  { range: "-60 à -50", count: 3 },
]

const heatmapData = [
  { projet: "Alpha", jan: 85, fev: 88, mar: 92, avr: 89, mai: 94, jun: 96 },
  { projet: "Beta", jan: 78, fev: 82, mar: 85, avr: 87, mai: 90, jun: 88 },
  { projet: "Gamma", jan: 92, fev: 94, mar: 96, avr: 93, mai: 97, jun: 95 },
  { projet: "Delta", jan: 75, fev: 79, mar: 82, avr: 85, mai: 87, jun: 84 },
]

const performanceEvolution = [
  { mois: "Jan", moyenne: 83.5, mediane: 85 },
  { mois: "Fév", moyenne: 85.8, mediane: 87 },
  { mois: "Mar", moyenne: 88.7, mediane: 90 },
  { mois: "Avr", moyenne: 88.5, mediane: 89 },
  { mois: "Mai", moyenne: 92.0, mediane: 93 },
  { mois: "Jun", moyenne: 90.8, mediane: 92 },
]

const correlationData = [
  { distance: 1.2, performance: 95 },
  { distance: 1.8, performance: 92 },
  { distance: 2.1, performance: 88 },
  { distance: 2.5, performance: 85 },
  { distance: 3.0, performance: 82 },
  { distance: 3.5, performance: 78 },
  { distance: 4.0, performance: 75 },
  { distance: 4.5, performance: 72 },
  { distance: 5.0, performance: 68 },
]

const statusDistribution = [
  { name: "Excellent (90-100)", value: 35, color: "#10b981" },
  { name: "Bon (80-89)", value: 28, color: "#3b82f6" },
  { name: "Moyen (70-79)", value: 15, color: "#f59e0b" },
  { name: "Faible (<70)", value: 8, color: "#ef4444" },
]

export default function StatistiquesPage() {
  const [user, setUser] = useState<any>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("6mois")
  const router = useRouter()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Statistiques avancées</h1>
              <p className="text-gray-600 mt-2">Analyse détaillée des performances de vos réseaux 5G</p>
            </div>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1mois">Dernier mois</SelectItem>
                <SelectItem value="3mois">3 derniers mois</SelectItem>
                <SelectItem value="6mois">6 derniers mois</SelectItem>
                <SelectItem value="1an">Dernière année</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Performance Moyenne</p>
                    <p className="text-2xl font-bold text-gray-900">87.9%</p>
                    <p className="text-xs text-green-600">+2.3% vs période précédente</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Puissance Moy. Reçue</p>
                    <p className="text-2xl font-bold text-gray-900">-78.2 dBm</p>
                    <p className="text-xs text-blue-600">Optimal</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <PieChartIcon className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Taux de Réussite</p>
                    <p className="text-2xl font-bold text-gray-900">94.2%</p>
                    <p className="text-xs text-purple-600">Excellent</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Configurations Actives</p>
                    <p className="text-2xl font-bold text-gray-900">127</p>
                    <p className="text-xs text-orange-600">+12 ce mois</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Graphiques principaux */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Histogramme des puissances */}
            <Card>
              <CardHeader>
                <CardTitle>Distribution des puissances reçues</CardTitle>
                <CardDescription>Répartition des mesures de puissance par plage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={puissanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribution des performances */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition des performances</CardTitle>
                <CardDescription>Classification des configurations par niveau de performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {statusDistribution.map((item) => (
                    <div key={item.name} className="flex items-center text-sm">
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

          {/* Évolution temporelle */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Évolution des performances moyennes</CardTitle>
              <CardDescription>Tendance des performances sur les 6 derniers mois</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceEvolution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis domain={[70, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="moyenne" stroke="#3b82f6" strokeWidth={3} name="Moyenne" />
                  <Line
                    type="monotone"
                    dataKey="mediane"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Médiane"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Analyses avancées */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Corrélation distance/performance */}
            <Card>
              <CardHeader>
                <CardTitle>Corrélation Distance vs Performance</CardTitle>
                <CardDescription>Impact de la distance sur les performances</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={correlationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="distance" name="Distance (km)" />
                    <YAxis dataKey="performance" name="Performance (%)" domain={[60, 100]} />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter dataKey="performance" fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Heatmap par projet */}
            <Card>
              <CardHeader>
                <CardTitle>Performance par projet (Heatmap)</CardTitle>
                <CardDescription>Évolution mensuelle par projet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {heatmapData.map((projet) => (
                    <div key={projet.projet} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{projet.projet}</span>
                        <span className="text-sm text-gray-500">
                          Moy:{" "}
                          {((projet.jan + projet.fev + projet.mar + projet.avr + projet.mai + projet.jun) / 6).toFixed(
                            1,
                          )}
                          %
                        </span>
                      </div>
                      <div className="grid grid-cols-6 gap-1">
                        {[projet.jan, projet.fev, projet.mar, projet.avr, projet.mai, projet.jun].map(
                          (value, index) => (
                            <div
                              key={index}
                              className="h-8 rounded flex items-center justify-center text-xs font-medium text-white"
                              style={{
                                backgroundColor:
                                  value >= 90
                                    ? "#10b981"
                                    : value >= 80
                                      ? "#3b82f6"
                                      : value >= 70
                                        ? "#f59e0b"
                                        : "#ef4444",
                              }}
                            >
                              {value}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center space-x-4 mt-6 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
                    <span>90-100%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
                    <span>80-89%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded mr-1"></div>
                    <span>70-79%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded mr-1"></div>
                    <span>{"<70%"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
