"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { getAllConfigurations } from "@/services/configurationService"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2, Filter } from "lucide-react"

export default function ConfigurationsPage() {
  const [configurations, setConfigurations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchConfigurations = async () => {
      try {
        setLoading(true)
        const response = await getAllConfigurations()
        console.log("API Response:", response)
        
        // Assurez-vous que la réponse est bien un tableau
        const configs = Array.isArray(response) ? response : response.data || []
        console.log("Configurations to set:", configs)
        
        setConfigurations(configs)
      } catch (err) {
        console.error("Failed to load configurations:", err)
        setError("Erreur lors du chargement des configurations")
      } finally {
        setLoading(false)
      }
    }

    fetchConfigurations()
  }, [])

  // Group by project name or use "Sans projet" as default
  const groupedConfigurations = Array.isArray(configurations) 
    ? configurations.reduce((groups, config) => {
        const projectName = config.projet?.nom || "Sans projet"
        if (!groups[projectName]) {
          groups[projectName] = []
        }
        groups[projectName].push(config)
        return groups
      }, {})
    : {}

  // Filter configurations based on search term
  const filteredGroups = Object.entries(groupedConfigurations).reduce((result, [project, configs]) => {
    const filtered = configs.filter(config => 
      project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.distance?.toString().includes(searchTerm) ||
      config.bandePassante?.toString().includes(searchTerm) ||
      (config.projet?.nom || "").toLowerCase().includes(searchTerm.toLowerCase()))
    if(filtered.length > 0) {
      result[project] = filtered
    }
    return result
  }, {})

  // ... (le reste du code reste inchangé)

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-64 p-6 lg:p-8 flex items-center justify-center">
          <div>Chargement en cours...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-64 p-6 lg:p-8 flex items-center justify-center">
          <div className="text-red-500">{error}</div>
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
              <h1 className="text-3xl font-bold text-gray-900">Configurations</h1>
              <p className="text-gray-600 mt-2">Gérez vos configurations de réseaux 5G par projet</p>
            </div>
            <Link href="/configurations/create">
              <Button className="mt-4 sm:mt-0">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle configuration
              </Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par projet, distance, bande passante..."
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

          {/* Configurations List */}
          <div className="space-y-6">
            {Object.keys(filteredGroups).length > 0 ? (
              Object.entries(filteredGroups).map(([project, configs]) => (
                <Card key={project}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {project}
                      <Badge variant="outline">{configs.length} configuration(s)</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Distance (km)</TableHead>
                            <TableHead>Bande passante (MHz)</TableHead>
                            <TableHead>Atténuations</TableHead>
                            <TableHead>Projet</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {configs.map((config) => (
                            <TableRow key={config.id}>
                              <TableCell className="font-medium">#{config.id}</TableCell>
                              <TableCell>{config.distance}</TableCell>
                              <TableCell>{config.bandePassante}</TableCell>
                              <TableCell>
                                {config.attenuations?.length || 0}
                              </TableCell>
                              <TableCell>{config.projet?.nom || "-"}</TableCell>
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
                                    <DropdownMenuItem>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Modifier
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Supprimer
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Search className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune configuration trouvée</h3>
                    <p className="mt-2 text-gray-500">
                      Essayez de modifier vos critères de recherche ou créez une nouvelle configuration.
                    </p>
                    <Link href="/configurations/create">
                      <Button className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Créer une configuration
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}