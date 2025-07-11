"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2, Filter } from "lucide-react"

// Mock data
const configurations = [
  {
    id: 1,
    project: "Projet Alpha",
    distance: 2.5,
    bandwidth: 100,
    status: "ACTIVE",
    createdAt: "2024-01-15",
    emitter: { power: 20, frequency: 3.5 },
    receiver: { sensitivity: -95, gain: 15 },
  }
]

const getStatusBadge = (status) => {
  switch (status) {
    case "ACTIVE":
      return <Badge className="bg-green-100 text-green-800">Actif</Badge>
    case "INACTIVE":
      return <Badge variant="secondary">Inactif</Badge>
    case "PENDING":
      return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function ConfigurationsPage() {
  const [user, setUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const groupedConfigurations = configurations.reduce(
    (acc, config) => {
      if (!acc[config.project]) {
        acc[config.project] = []
      }
      acc[config.project].push(config)
      return acc
    },
    {},
  )

  // Filter configurations based on search term
  const filteredGroups = Object.entries(groupedConfigurations).reduce(
    (acc, [project, configs]) => {
      const filteredConfigs = configs.filter(
        (config) =>
          project.toLowerCase().includes(searchTerm.toLowerCase()) ||
          config.distance.toString().includes(searchTerm) ||
          config.bandwidth.toString().includes(searchTerm) ||
          config.status.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      if (filteredConfigs.length > 0) {
        acc[project] = filteredConfigs
      }
      return acc
    },
    {},
  )

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

          {/* Configurations by Project */}
          <div className="space-y-6">
            {Object.entries(filteredGroups).map(([project, configs]) => (
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
                          <TableHead>Émetteur</TableHead>
                          <TableHead>Récepteur</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Date création</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {configs.map((config) => (
                          <TableRow key={config.id}>
                            <TableCell className="font-medium">#{config.id}</TableCell>
                            <TableCell>{config.distance}</TableCell>
                            <TableCell>{config.bandwidth}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>P: {config.emitter.power}dBm</div>
                                <div className="text-gray-500">F: {config.emitter.frequency}GHz</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>S: {config.receiver.sensitivity}dBm</div>
                                <div className="text-gray-500">G: {config.receiver.gain}dB</div>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(config.status)}</TableCell>
                            <TableCell>{config.createdAt}</TableCell>
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
            ))}
          </div>

          {Object.keys(filteredGroups).length === 0 && (
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
  )
}
