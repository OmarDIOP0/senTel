"use client"

import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  Shield,
  User,
  UserCheck,
  Mail,
  Calendar,
} from "lucide-react"
import { getAllClients, updateClient } from "@/services/clientService"
import { useEffect, useState } from "react";
import showAlert from "@/utils/alert";

const getRoleBadge = (role) => {
  switch (role) {
    case "ADMIN":
      return (
        <Badge className="bg-red-100 text-red-800">
          <Shield className="w-3 h-3 mr-1" />
          Admin
        </Badge>
      )
    case "INGENIEUR":
      return (
        <Badge className="bg-blue-100 text-blue-800">
          <UserCheck className="w-3 h-3 mr-1" />
          Ingénieur
        </Badge>
      )
    case "CLIENT":
      return (
        <Badge className="bg-green-100 text-green-800">
          <User className="w-3 h-3 mr-1" />
          Client
        </Badge>
      )
    default:
      return <Badge variant="outline">{role}</Badge>
  }
}

const getStatusBadge = (actif) => {
  return actif 
    ? <Badge className="bg-green-100 text-green-800">Actif</Badge>
    : <Badge variant="secondary">Inactif</Badge>
}

export default function UtilisateursPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newRole, setNewRole] = useState("")
  const router = useRouter()

  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
   const fetchClients = async () => {
  try {
    const response = await getAllClients();
    if (Array.isArray(response.data)) {
      setUtilisateurs(response.data);
    } else if (Array.isArray(response.data.data)) {
      setUtilisateurs(response.data.data);
    } else {
      setUtilisateurs([]);
      setError("Format inattendu des utilisateurs");
    }
  } catch (err) {
    console.error(err);
    setError("Erreur lors du chargement des clients");
  } finally {
    setLoading(false);
  }
};



    fetchClients();
  }, []);

  const handleUpdateClient = async (updatedUser) => {
    setIsUpdating(true);
    try {
      await updateClient(updatedUser);
      // Update local state with the new user data
      setUtilisateurs(prev => prev.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
      showAlert("Client mis à jour ✅", "success");
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error("Erreur update:", err);
      showAlert("Erreur de mise à jour ❌", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = utilisateurs.filter(
    (utilisateur) =>
      utilisateur.nomComplet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      utilisateur.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      utilisateur.role?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEditRole = (utilisateur) => {
    setSelectedUser(utilisateur)
    setNewRole(utilisateur.role)
    setIsEditDialogOpen(true)
  }

  const handleSaveRole = () => {
    if (!selectedUser) return
    
    const updatedUser = {
      ...selectedUser,
      role: newRole
    }
    
    handleUpdateClient(updatedUser);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-64 p-8">
          <div className="flex justify-center items-center h-full">
            <p>Chargement des utilisateurs...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-64 p-8">
          <div className="flex justify-center items-center h-full">
            <p>{error}</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
              <p className="text-gray-600 mt-2">Gérez les utilisateurs et leurs permissions</p>
            </div>
            <Button className="mt-4 sm:mt-0">
              <Plus className="mr-2 h-4 w-4" />
              Inviter un utilisateur
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{utilisateurs.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Admins</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {utilisateurs.filter((u) => u.role === "ADMIN").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <UserCheck className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Ingénieurs</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {utilisateurs.filter((u) => u.role === "INGENIEUR").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <User className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Clients</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {utilisateurs.filter((u) => u.role === "CLIENT").length}
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
                  placeholder="Rechercher par nom, email ou rôle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des utilisateurs</CardTitle>
              <CardDescription>{filteredUsers.length} utilisateur(s) trouvé(s)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Dernière connexion</TableHead>
                      <TableHead>Configurations</TableHead>
                      <TableHead>Date création</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((utilisateur) => (
                      <TableRow key={utilisateur.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{utilisateur.nomComplet}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {utilisateur.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(utilisateur.role)}</TableCell>
                        <TableCell>{getStatusBadge(utilisateur.actif)}</TableCell>
                        <TableCell className="text-sm">Jamais connecté</TableCell>
                        <TableCell>
                          <Badge variant="outline">{utilisateur.configurations?.length || 0}</Badge>
                        </TableCell>
                        <TableCell className="text-sm flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(utilisateur.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditRole(utilisateur)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier le rôle
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

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun utilisateur trouvé</h3>
                  <p className="mt-2 text-gray-500">Aucun utilisateur ne correspond à vos critères de recherche.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Edit Role Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier le rôle utilisateur</DialogTitle>
                <DialogDescription>Modifier le rôle de {selectedUser?.nomComplet}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="role">Nouveau rôle</Label>
                  <Select value={newRole} onValueChange={setNewRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLIENT">Client</SelectItem>
                      <SelectItem value="INGENIEUR">Ingénieur</SelectItem>
                      <SelectItem value="ADMIN">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditDialogOpen(false)}
                    disabled={isUpdating}
                  >
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleSaveRole}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Enregistrement..." : "Sauvegarder"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}