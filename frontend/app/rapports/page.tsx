"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye, Download, Filter, FileText } from "lucide-react"
import { generateReportPDF } from "@/utils/pdfGenerator"

// Mock data
const rapports = [
  {
    id: 1,
    configurationId: 1,
    date: "2024-01-15",
    notePerformance: 92,
    puissanceRecue: -78.5,
    conclusion: "Configuration optimale pour la couverture urbaine",
    statut: "VALIDE",
    projet: "Projet Alpha",
  },
  {
    id: 2,
    configurationId: 2,
    date: "2024-01-14",
    notePerformance: 85,
    puissanceRecue: -82.1,
    conclusion: "Performance acceptable avec quelques ajustements nécessaires",
    statut: "EN_COURS",
    projet: "Projet Alpha",
  },
  {
    id: 3,
    configurationId: 3,
    date: "2024-01-13",
    notePerformance: 96,
    puissanceRecue: -75.2,
    conclusion: "Excellente performance, déploiement recommandé",
    statut: "VALIDE",
    projet: "Projet Beta",
  },
  {
    id: 4,
    configurationId: 4,
    date: "2024-01-12",
    notePerformance: 78,
    puissanceRecue: -88.7,
    conclusion: "Performance limitée, révision de la configuration suggérée",
    statut: "EN_ATTENTE",
    projet: "Projet Beta",
  },
  {
    id: 5,
    configurationId: 5,
    date: "2024-01-11",
    notePerformance: 89,
    puissanceRecue: -80.3,
    conclusion: "Bonne performance globale avec marge d'amélioration",
    statut: "VALIDE",
    projet: "Projet Gamma",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "VALIDE":
      return <Badge className="bg-green-100 text-green-800">Validé</Badge>
    case "EN_COURS":
      return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>
    case "EN_ATTENTE":
      return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getPerformanceColor = (note: number) => {
  if (note >= 90) return "text-green-600 font-semibold"
  if (note >= 80) return "text-blue-600 font-semibold"
  if (note >= 70) return "text-yellow-600 font-semibold"
  return "text-red-600 font-semibold"
}

export default function RapportsPage() {
  const [user, setUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()


  // Filter reports based on search term
  const filteredRapports = rapports.filter(
    (rapport) =>
      rapport.projet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rapport.conclusion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rapport.statut.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rapport.id.toString().includes(searchTerm),
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Rapports</h1>
              <p className="text-gray-600 mt-2">Consultez et gérez tous vos rapports de dimensionnement</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{rapports.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <div className="h-6 w-6 bg-green-600 rounded-full"></div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Validés</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {rapports.filter((r) => r.statut === "VALIDE").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <div className="h-6 w-6 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">En cours</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {rapports.filter((r) => r.statut === "EN_COURS").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <div className="h-6 w-6 bg-yellow-600 rounded-full"></div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">En attente</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {rapports.filter((r) => r.statut === "EN_ATTENTE").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par ID, projet, conclusion..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtres
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reports Table */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des rapports</CardTitle>
              <CardDescription>{filteredRapports.length} rapport(s) trouvé(s)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Projet</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Note Performance</TableHead>
                      <TableHead>Puissance Reçue</TableHead>
                      <TableHead>Conclusion</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRapports.map((rapport) => (
                      <TableRow key={rapport.id}>
                        <TableCell className="font-medium">#{rapport.id}</TableCell>
                        <TableCell>{rapport.projet}</TableCell>
                        <TableCell>{rapport.date}</TableCell>
                        <TableCell>
                          <span className={getPerformanceColor(rapport.notePerformance)}>
                            {rapport.notePerformance}/100
                          </span>
                        </TableCell>
                        <TableCell>{rapport.puissanceRecue} dBm</TableCell>
                        <TableCell className="max-w-xs truncate">{rapport.conclusion}</TableCell>
                        <TableCell>{getStatusBadge(rapport.statut)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir détails
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => generateReportPDF(rapport)}>
                                <Download className="mr-2 h-4 w-4" />
                                Exporter PDF
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredRapports.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun rapport trouvé</h3>
                  <p className="mt-2 text-gray-500">Aucun rapport ne correspond à vos critères de recherche.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
