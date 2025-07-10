"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Shield, Key, LogOut, Save, AlertCircle, CheckCircle, Calendar, Activity } from "lucide-react"
import { useAdminService } from  "../../services/useAdminService"

export default function ProfilePage() {
  const { profileData, loading: profileLoading, error: profileError } = useAdminService();
  const [isEditing, setIsEditing] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.nomComplet || "",
        email: profileData.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }
  }, [profileData])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async () => {
    setFormLoading(true)
    setError("")
    setSuccess("")

    try {
      // Here you would call your actual API endpoint to update the profile
      // For now, we'll simulate it
      setTimeout(() => {
        setSuccess("Profil mis à jour avec succès")
        setFormLoading(false)
        setIsEditing(false)
      }, 1000)
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil")
      setFormLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    if (formData.newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      return
    }

    setFormLoading(true)
    setError("")
    setSuccess("")

    try {
      // Here you would call your actual API endpoint to change password
      // For now, we'll simulate it
      setTimeout(() => {
        setSuccess("Mot de passe modifié avec succès")
        setFormLoading(false)
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }))
      }, 1000)
    } catch (err) {
      setError("Erreur lors du changement de mot de passe")
      setFormLoading(false)
    }
  }

  const handleLogout = () => {
    // Clear any authentication tokens or user data
    router.push("/login")
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge className="bg-red-100 text-red-800">
            <Shield className="w-3 h-3 mr-1" />
            Administrateur
          </Badge>
        )
      case "INGENIEUR":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <User className="w-3 h-3 mr-1" />
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

  if (profileLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-64 p-8">
          <div className="flex justify-center items-center h-full">
            <p>Chargement du profil...</p>
          </div>
        </div>
      </div>
    )
  }

  if (profileError) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-64 p-8">
          <div className="flex justify-center items-center h-full">
            <p>Erreur lors du chargement du profil</p>
          </div>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-64 p-8">
          <div className="flex justify-center items-center h-full">
            <p>Aucune donnée de profil disponible</p>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
            <p className="text-gray-600 mt-2">Gérez vos informations personnelles et paramètres de compte</p>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Aperçu du profil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{profileData.nomComplet}</h3>
                      <p className="text-sm text-gray-500">{profileData.email}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rôle</span>
                      {getRoleBadge(profileData.role)}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Statut</span>
                      <Badge className={profileData.actif ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {profileData.actif ? "Actif" : "Inactif"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Membre depuis</span>
                      <span className="text-sm text-gray-900 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date().toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Dernière connexion</span>
                      <span className="text-sm text-gray-900 flex items-center">
                        <Activity className="w-3 h-3 mr-1" />
                        Aujourd'hui
                      </span>
                    </div>
                  </div>

                  <Button variant="destructive" className="w-full mt-6" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Profile Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Informations personnelles</CardTitle>
                      <CardDescription>Modifiez vos informations de base</CardDescription>
                    </div>
                    {!isEditing && (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
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
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false)
                          setFormData({
                            name: profileData.nomComplet || "",
                            email: profileData.email || "",
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          })
                        }}
                      >
                        Annuler
                      </Button>
                      <Button onClick={handleSaveProfile} disabled={formLoading}>
                        {formLoading ? (
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

              {/* Change Password */}
              <Card>
                <CardHeader>
                  <CardTitle>Changer le mot de passe</CardTitle>
                  <CardDescription>Modifiez votre mot de passe pour sécuriser votre compte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) => handleInputChange("newPassword", e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <Button onClick={handleChangePassword} disabled={formLoading}>
                    {formLoading ? (
                      "Modification..."
                    ) : (
                      <>
                        <Key className="mr-2 h-4 w-4" />
                        Changer le mot de passe
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Account Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques du compte</CardTitle>
                  <CardDescription>Aperçu de votre activité</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">0</div>
                      <div className="text-sm text-gray-600">Configurations créées</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">0</div>
                      <div className="text-sm text-gray-600">Rapports générés</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">0</div>
                      <div className="text-sm text-gray-600">Projets actifs</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}