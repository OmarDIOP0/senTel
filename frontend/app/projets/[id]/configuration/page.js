'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Settings, FileText, Edit, Trash2 } from "lucide-react";
import { getConfigurationByProjet } from "@/services/configurationService";
import { toast } from "@/components/ui/use-toast";


export default function ProjectConfigurationsPage() {
  const { id } = useParams();
  const [configurations, setConfigurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchConfigurations = async () => {
      try {
        const response = await getConfigurationByProjet(id);
        setConfigurations(response.data || []);
      } catch (err) {
        setError("Erreur lors du chargement des configurations");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les configurations du projet",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConfigurations();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-64 p-8">
          <div className="flex justify-center items-center h-full">
            <p>Chargement des configurations...</p>
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
          <div className="flex items-center justify-between mb-8">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux projets
            </Button>
            <Button onClick={() => router.push(`/configurations/create?project=${id}`)}>
              <Settings className="mr-2 h-4 w-4" />
              Nouvelle configuration
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Configurations du projet</CardTitle>
              <CardDescription>
                Liste des configurations de dimensionnement pour ce projet
              </CardDescription>
            </CardHeader>
            <CardContent>
              {configurations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Distance</TableHead>
                      <TableHead>Bande passante</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {configurations.map((config) => (
                      <TableRow key={config.id}>
                        <TableCell>#{config.id}</TableCell>
                        <TableCell>{config.distance} km</TableCell>
                        <TableCell>{config.bandePassante} MHz</TableCell>
                        <TableCell>
                          <Badge variant="outline">Active</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/configurations/${config.id}`)}>
                            <FileText className="h-4 w-4 mr-2" />
                            Voir
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/configurations/edit/${config.id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <Settings className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune configuration</h3>
                  <p className="mt-2 text-gray-500">Ce projet ne contient aucune configuration.</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => router.push(`/configurations/create?project=${id}`)}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Créer une configuration
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}