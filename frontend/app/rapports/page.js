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
import { getAllRapports, getRapportById } from "@/services/rapportService"

const getStatusBadge = (status) => {
  switch (status) {
    case "EXECELLENT":
      return <Badge className="bg-green-100 text-green-800">EXCELLENT</Badge>
    case "INSUFFISANT":
      return <Badge className="bg-red-100 text-red-800">INSUFFISANT</Badge>
    case "EN_COURS":
      return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>
    case "EN_ATTENTE":
      return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getPerformanceColor = (note) => {
  if (note >= 0) return "text-green-600 font-semibold"
  if (note >= -50) return "text-blue-600 font-semibold"
  if (note >= -80) return "text-yellow-600 font-semibold"
  return "text-red-600 font-semibold"
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function RapportsPage() {
  const [rapports, setRapports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchRapports = async () => {
      try {
        const response = await getAllRapports()
        if (response.success) {
          setRapports(response.data)
        } else {
          setError(response.message || "Erreur lors du chargement des rapports")
        }
      } catch (err) {
        setError(err.message || "Erreur lors du chargement des rapports")
      } finally {
        setLoading(false)
      }
    }

    fetchRapports()
  }, [])

  // Filter reports based on search term
  const filteredRapports = rapports.filter(
    (rapport) =>
      rapport.conclusion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rapport.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rapport.id.toString().includes(searchTerm))
  
  const handleViewDetails = (id) => {
    router.push(`/rapports/${id}`)
  }

  const handleGeneratePDF = async (rapport) => {
    // Si besoin de plus de données, on peut faire un appel API pour récupérer le rapport complet
    const fullReport = await getRapportById(rapport.id)
    generateReportPDF(fullReport.data)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-64 p-8 flex items-center justify-center">
          <div className="text-center">Chargement des rapports...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-64 p-8 flex items-center justify-center">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    )
  }

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
                      {rapports.filter((r) => r.status === "EXCELLENT").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <div className="h-6 w-6 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">En cours</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {rapports.filter((r) => r.status === "EN_COURS").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <div className="h-6 w-6 bg-red-600 rounded-full"></div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Insuffisants</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {rapports.filter((r) => r.status === "INSUFFISANT").length}
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
                    placeholder="Rechercher par ID, conclusion, statut..."
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
                      <TableHead>Date</TableHead>
                      <TableHead>Note Performance</TableHead>
                      <TableHead>Puissance Reçue</TableHead>
                      <TableHead>Débit Estimé</TableHead>
                      {/* <TableHead>Conclusion</TableHead> */}
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRapports.map((rapport) => (
                      <TableRow key={rapport.id}>
                        <TableCell className="font-medium">#{rapport.id}</TableCell>
                        <TableCell>{formatDate(rapport.date)}</TableCell>
                        <TableCell>
                          <span className={getPerformanceColor(rapport.notePerformance)}>
                            {rapport.notePerformance.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>{rapport.puissanceRecu?.toFixed(2)} dBm</TableCell>
                        <TableCell>{(rapport.debitEstime / 1000000).toFixed(2)} Mbps</TableCell>
                        {/* <TableCell className="max-w-xs truncate">{rapport.conclusion}</TableCell> */}
                        <TableCell>{getStatusBadge(rapport.status)}</TableCell>
                        <TableCell>
                        <Button onClick={() => handleGeneratePDF(rapport)} className="bg-red-700"><Download/>PDF</Button>
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