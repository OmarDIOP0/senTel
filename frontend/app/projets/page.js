"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, FolderOpen, Settings } from "lucide-react"
import { getAllProjets, deleteProjet } from "@/services/projetService"

const getStatusBadge = (status) => {
  switch (status) {
    case "ACTIVE":
      return <Badge className="bg-green-100 text-green-800">Actif</Badge>
    case "PENDING":
      return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
    case "COMPLETED":
      return <Badge className="bg-blue-100 text-blue-800">Terminé</Badge>
    case "INACTIVE":
      return <Badge variant="secondary">Inactif</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function ProjetsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  // Fetch projects from API
  const { data: projetsData, isLoading, refetch } = useQuery({
    queryKey: ["projets"],
    queryFn: getAllProjets,
  })

  const projets = projetsData?.data || []

  // Handle project deletion
  const handleDelete = async (id) => {
    try {
      await deleteProjet(id)
      refetch()
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  // Filter projects based on search term
  const filteredProjets = projets.filter(
    (projet) =>
      projet.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projet.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-64 p-8">
          <div className="flex justify-center items-center h-full">
            <p>Chargement des projets...</p>
          </div>
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
              <h1 className="text-3xl font-bold text-gray-900">Projets</h1>
              <p className="text-gray-600 mt-2">Gérez vos projets de dimensionnement de réseaux 5G</p>
            </div>
            <Link href="/projets/create">
              <Button className="mt-4 sm:mt-0">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau projet
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <FolderOpen className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{projets.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="h-4 w-4 bg-green-600 rounded-full"></div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Actifs</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {projets.filter((p) => p.status === "ACTIVE").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Settings className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Configurations</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {projets.reduce((sum, p) => sum + (p.configurations?.length || 0), 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="h-4 w-4 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Terminés</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {projets.filter((p) => p.status === "COMPLETED").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom ou description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjets.map((projet) => (
              <Card key={projet.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{projet.nom}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        {getStatusBadge(projet.status || "ACTIVE")}
                        <Badge variant="outline">{projet.configurations?.length || 0} config(s)</Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/projets/edit/${projet.id}`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(projet.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-gray-600 mb-4">{projet.description}</CardDescription>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Créé le {new Date(projet.createdAt).toLocaleDateString()}</span>
                    <Link href={`/configurations?project=${projet.id}`}>
                      <Button variant="outline" size="sm">
                        Voir configurations
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProjets.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun projet trouvé</h3>
                  <p className="mt-2 text-gray-500">Aucun projet ne correspond à vos critères de recherche.</p>
                  <Link href="/projets/create">
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Créer un projet
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