"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  User,
  Shield,
  Mail,
  Calendar,
  Activity,
  Settings,
  FileText,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react"
import { useAdminService } from "@/services/adminService"

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

const getStatusBadge = (status) => {
  return status ? 
    <Badge className="bg-green-100 text-green-800">Actif</Badge> : 
    <Badge variant="secondary">Inactif</Badge>
}

const getActivityIcon = (type) => {
  switch (type) {
    case "configuration":
      return <Settings className="h-4 w-4 text-blue-500" />
    case "report":
      return <FileText className="h-4 w-4 text-green-500" />
    case "project":
      return <BarChart3 className="h-4 w-4 text-purple-500" />
    default:
      return <Activity className="h-4 w-4 text-gray-500" />
  }
}

export default function UserProfilePage() {
  const { profileData, loading, error } = useAdminService();
  const [profileUser, setProfileUser] = useState(null);
  const router = useRouter();
  const params = useParams();
  const userId = params.id;

  useEffect(() => {
    if (profileData) {
      // Transform the profileData into the expected format
      const transformedProfile = {
        id: profileData.id,
        name: profileData.nomComplet,
        email: profileData.email,
        role: profileData.role,
        status: profileData.actif ? "ACTIVE" : "INACTIVE",
        joinDate: new Date().toISOString().split('T')[0], // Default to today
        lastLogin: "Jamais connecté", // Default value
        department: "Non spécifié", // Default value
        phone: profileData.telephone || "Non spécifié",
        location: "Non spécifié", // Default value
        bio: "Aucune description fournie", // Default value
        stats: {
          configurationsCreated: 0, // Default value
          reportsGenerated: 0, // Default value
          projectsManaged: 0, // Default value
          avgPerformance: 0, // Default value
        },
        recentActivity: [], // Default empty array
        configurations: [] // Default empty array
      };
      setProfileUser(transformedProfile);
    }
  }, [profileData]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-64 p-8">
          <div className="flex justify-center items-center h-full">
            <p>Chargement du profil utilisateur...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-64 p-8">
          <div className="flex justify-center items-center h-full">
            <p>Erreur lors du chargement du profil: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-64 p-8">
          <div className="flex justify-center items-center h-full">
            <p>Aucune donnée de profil disponible</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button variant="ghost" size="sm" className="mr-4" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profil utilisateur</h1>
              <p className="text-gray-600 mt-2">Informations détaillées et activité</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-4 bg-blue-100 rounded-full">
                      <User className="h-12 w-12 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{profileUser.name}</h2>
                      <p className="text-gray-600">{profileUser.department}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rôle</span>
                      {getRoleBadge(profileUser.role)}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Statut</span>
                      {getStatusBadge(profileUser.status === "ACTIVE")}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{profileUser.email}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Membre depuis {profileUser.joinDate}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Dernière connexion: {profileUser.lastLogin}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-medium text-gray-900 mb-2">À propos</h3>
                    <p className="text-sm text-gray-600">{profileUser.bio}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Statistiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{profileUser.stats.configurationsCreated}</div>
                      <div className="text-xs text-gray-600">Configurations</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{profileUser.stats.reportsGenerated}</div>
                      <div className="text-xs text-gray-600">Rapports</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{profileUser.stats.projectsManaged}</div>
                      <div className="text-xs text-gray-600">Projets</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{profileUser.stats.avgPerformance}%</div>
                      <div className="text-xs text-gray-600">Performance</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Activity */}
              {profileUser.recentActivity.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Activité récente</CardTitle>
                    <CardDescription>Les dernières actions effectuées</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profileUser.recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-600">{activity.details}</p>
                            <p className="text-xs text-gray-500 flex items-center mt-1">
                              <Clock className="w-3 h-3 mr-1" />
                              {activity.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Configurations */}
              {profileUser.configurations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Configurations récentes</CardTitle>
                    <CardDescription>Les dernières configurations créées par cet utilisateur</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Projet</TableHead>
                          <TableHead>Distance</TableHead>
                          <TableHead>Bande passante</TableHead>
                          <TableHead>Performance</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {profileUser.configurations.map((config) => (
                          <TableRow key={config.id}>
                            <TableCell className="font-medium">#{config.id}</TableCell>
                            <TableCell>{config.project}</TableCell>
                            <TableCell>{config.distance} km</TableCell>
                            <TableCell>{config.bandwidth} MHz</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <div
                                  className={`text-sm font-medium ${
                                    config.performance >= 90
                                      ? "text-green-600"
                                      : config.performance >= 80
                                        ? "text-blue-600"
                                        : "text-yellow-600"
                                  }`}
                                >
                                  {config.performance}%
                                </div>
                                {config.performance >= 90 ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(config.status)}</TableCell>
                            <TableCell>{config.createdAt}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}