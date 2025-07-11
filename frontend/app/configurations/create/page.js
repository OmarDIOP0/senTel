"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Save, AlertCircle, CheckCircle, Zap, Plus, Trash2, Radio } from "lucide-react"
import { getAllProjets } from "@/services/projetService"
import {getConfigurationByProjet} from "@/services/configurationService"
import { createConfiguration } from "@/services/configurationService"
import { toast } from "@/components/ui/use-toast"
import { useAdminService } from "@/services/useAdminService"
import { createEmetteur } from "@/services/emetteurService";
import { createRecepteur } from "@/services/recepteurService";


// Types d'atténuation correspondant à l'enum TypeAttenuation
const attenuationTypes = [
  "PERTE_EPISSURE_FUSION",
  "PERTE_EPISSURE_MECANIQUE",
  "CABLE_RACCORDEMENT",
  "PERTE_CONNECTEUR"
]

export default function CreateConfigurationPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [projects, setProjects] = useState([])
  const [emetteurData, setEmetteurData] = useState({
    configurationId: null,
    puissanceEntree: '',
    frequence: ''
  });

  const [recepteurData, setRecepteurData] = useState({
    configurationId: null,
    sensibilite: '',
    gainReception: ''
  });
  const router = useRouter()

  const [formData, setFormData] = useState({
    projetId: "",
    distance: "",
    bandePassante: "",
    emetteurId: "",
    recepteurId: "",
    clientId: ""
  })

  const [attenuations, setAttenuations] = useState([])
  const [newAttenuation, setNewAttenuation] = useState({ 
    nomAttenuation: "", 
    valeur: "", 
    longueurCable: "1" 
  })

  // Charger les projets et les équipements au montage
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const projetsResponse = await getAllProjets()
        setProjects(projetsResponse.data || [])
        
      } catch (err) {
        setError("Erreur lors du chargement des données")
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les données initiales",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Charger les émetteurs/récepteurs quand un projet est sélectionné
  useEffect(() => {
    if (formData.projetId) {
      const loadProjectData = async () => {
        try {
          const configs = await getConfigurationByProjet(formData.projetId)
          const uniqueEmetteurs = [...new Set(configs.data.map(c => c.emetteur))]
          const uniqueRecepteurs = [...new Set(configs.data.map(c => c.recepteur))]
          
          setEmetteurs(uniqueEmetteurs)
          setRecepteurs(uniqueRecepteurs)
          if (uniqueEmetteurs.length === 1) {
            handleInputChange("emetteurId", uniqueEmetteurs[0].id)
          }
          if (uniqueRecepteurs.length === 1) {
            handleInputChange("recepteurId", uniqueRecepteurs[0].id)
          }
        } catch (err) {
          console.error("Erreur chargement configs projet:", err)
        }
      }
      
      loadProjectData()
    }
  }, [formData.projetId])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addAttenuation = () => {
    if (newAttenuation.nomAttenuation && newAttenuation.valeur) {
      const newAtt = {
        id: `att-${Date.now()}`,
        nomAttenuation: newAttenuation.nomAttenuation,
        valeur: parseFloat(newAttenuation.valeur),
        longueurCable: parseFloat(newAttenuation.longueurCable) || 1
      }
      setAttenuations((prev) => [...prev, newAtt])
      setNewAttenuation({ nomAttenuation: "", valeur: "", longueurCable: "1" })
    }
  }

  const removeAttenuation = (id) => {
    setAttenuations((prev) => prev.filter((att) => att.id !== id))
  }

  const updateAttenuation = (id, field, value) => {
    setAttenuations((prev) => 
      prev.map((att) => 
        att.id === id ? { ...att, [field]: value } : att
      )
    )
  }

  const calculateTotalAttenuation = () => {
    return attenuations.reduce(
      (total, att) => total + (parseFloat(att.valeur) * parseFloat(att.longueurCable || 1)), 
      0
    ).toFixed(2)
  }
    const { profileData } = useAdminService();

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    console.log("Form values:", formData)
    formData.clientId = profileData?.id;
    // Validation
    if (!formData.projetId || !formData.distance || !formData.bandePassante || !formData.emetteurId || !formData.recepteurId) {
      setError("Veuillez remplir tous les champs obligatoires")
      setLoading(false)
      return
    }

    try {
      // Préparer la requête selon ConfigurationRequest
      const configRequest = {
        distance: parseFloat(formData.distance),
        bandePassante: parseFloat(formData.bandePassante),
        emetteurId: parseInt(formData.emetteurId),
        recepteurId: parseInt(formData.recepteurId),
        projetId: parseInt(formData.projetId),
        clientId: 1, // À remplacer par l'ID du client connecté
        attenuations: attenuations.map(att => ({
          nomAttenuation: att.nomAttenuation,
          valeur: parseFloat(att.valeur),
          longueurCable: parseFloat(att.longueurCable)
        }))
      }

      const response = await createConfiguration(configRequest)
      
      toast({
        title: "Succès",
        description: "Configuration créée avec succès",
      })
      
      setSuccess(true)
      setTimeout(() => {
        router.push("/configurations")
      }, 2000)
    } catch (err) {
      console.error("Erreur création configuration:", err)
      setError(err.response?.data?.message || "Erreur lors de la création")
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.response?.data?.message || "Erreur lors de la création",
      })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="p-6 lg:p-8">
            <Card className="max-w-md mx-auto mt-20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Configuration créée !</h2>
                  <p className="text-gray-600 mb-4">
                    Votre configuration avec {attenuations.length} atténuation(s) a été sauvegardée avec succès.
                  </p>
                </div>
              </CardContent>
            </Card>
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
          <div className="flex items-center mb-8">
            <Link href="/configurations">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Nouvelle configuration</h1>
              <p className="text-gray-600 mt-2">Configuration avancée avec gestion des atténuations</p>
            </div>
          </div>

          <div className="max-w-4xl">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Étape 1: Projet */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold mr-3">
                      1
                    </span>
                    Sélectionner le projet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select 
                    value={formData.projetId} 
                    onValueChange={(value) => handleInputChange("projetId", value)}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un projet" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Étape 2: Paramètres de base */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold mr-3">
                      2
                    </span>
                    Paramètres de base
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="distance">Distance (km) *</Label>
                    <Input
                      id="distance"
                      type="number"
                      step="0.1"
                      placeholder="2.5"
                      value={formData.distance}
                      onChange={(e) => handleInputChange("distance", e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bandePassante">Bande passante (MHz) *</Label>
                    <Input
                      id="bandePassante"
                      type="number"
                      placeholder="100"
                      value={formData.bandePassante}
                      onChange={(e) => handleInputChange("bandePassante", e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Étape 3: Configuration radio */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold mr-3">
                      3
                    </span>
                    Configuration radio
                  </CardTitle>
                  <CardDescription>Sélectionnez l'émetteur et le récepteur</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Émetteur - Ajouter ces champs */}
                  <div>
                    <Label htmlFor="puissanceEntree">Puissance d'entrée (dBm)</Label>
                    <Input
                      id="puissanceEntree"
                      type="number"
                      step="0.1"
                      placeholder="10"
                      value={emetteurData.puissanceEntree}
                      onChange={(e) => setEmetteurData({...emetteurData, puissanceEntree: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="frequence">Fréquence (GHz)</Label>
                    <Input
                      id="frequence"
                      type="number"
                      step="0.1"
                      placeholder="2.4"
                      value={emetteurData.frequence}
                      onChange={(e) => setEmetteurData({...emetteurData, frequence: e.target.value})}
                    />
                  </div>

                  {/* Récepteur - Ajouter ces champs */}
                  <div>
                    <Label htmlFor="sensibilite">Sensibilité (dBm)</Label>
                    <Input
                      id="sensibilite"
                      type="number"
                      step="0.1"
                      placeholder="-85"
                      value={recepteurData.sensibilite}
                      onChange={(e) => setRecepteurData({...recepteurData, sensibilite: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gainReception">Gain de réception (dB)</Label>
                    <Input
                      id="gainReception"
                      type="number"
                      step="0.1"
                      placeholder="15"
                      value={recepteurData.gainReception}
                      onChange={(e) => setRecepteurData({...recepteurData, gainReception: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Étape 4: Atténuations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold mr-3">
                      4
                    </span>
                    Atténuations
                  </CardTitle>
                  <CardDescription>
                    Ajoutez les différentes sources d'atténuation du signal
                    {attenuations.length > 0 && (
                      <span className="ml-2">
                        • Total: <strong>{calculateTotalAttenuation()} dB</strong>
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Atténuations existantes */}
                  {attenuations.length > 0 && (
                    <div className="space-y-3">
                      {attenuations.map((attenuation) => (
                        <div
                          key={attenuation.id}
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border"
                        >
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <Label className="text-xs text-gray-600">Type d'atténuation</Label>
                              <Select
                                value={attenuation.nomAttenuation}
                                onValueChange={(value) => updateAttenuation(attenuation.id, "nomAttenuation", value)}
                                disabled={loading}
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {attenuationTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type.replace(/_/g, ' ').toLowerCase()}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-xs text-gray-600">Valeur (dB/m)</Label>
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="0.0"
                                value={attenuation.valeur}
                                onChange={(e) => updateAttenuation(attenuation.id, "valeur", e.target.value)}
                                className="h-9"
                                disabled={loading}
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-gray-600">Longueur (m)</Label>
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="1.0"
                                value={attenuation.longueurCable}
                                onChange={(e) => updateAttenuation(attenuation.id, "longueurCable", e.target.value)}
                                className="h-9"
                                disabled={loading}
                              />
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttenuation(attenuation.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Separator />
                    </div>
                  )}

                  {/* Ajouter nouvelle atténuation */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-900 flex items-center">
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter une atténuation
                    </h5>
                    <div className="flex items-end space-x-3">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <Label>Type d'atténuation</Label>
                          <Select
                            value={newAttenuation.nomAttenuation}
                            onValueChange={(value) => setNewAttenuation((prev) => ({ ...prev, nomAttenuation: value }))}
                            disabled={loading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choisir le type" />
                            </SelectTrigger>
                            <SelectContent>
                              {attenuationTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type.replace(/_/g, ' ').toLowerCase()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Valeur (dB/m)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="0.0"
                            value={newAttenuation.valeur}
                            onChange={(e) => setNewAttenuation((prev) => ({ ...prev, valeur: e.target.value }))}
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <Label>Longueur (m)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="1.0"
                            value={newAttenuation.longueurCable}
                            onChange={(e) => setNewAttenuation((prev) => ({ ...prev, longueurCable: e.target.value }))}
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={addAttenuation}
                        disabled={loading || !newAttenuation.nomAttenuation || !newAttenuation.valeur}
                        className="shrink-0"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter
                      </Button>
                    </div>
                  </div>

                  {/* Résumé des atténuations */}
                  {attenuations.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-blue-900">
                          Total des atténuations: {calculateTotalAttenuation()} dB
                        </span>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                          {attenuations.length} source(s)
                        </Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {attenuations.map((att) => (
                          <Badge key={att.id} variant="secondary" className="text-xs">
                            {att.nomAttenuation.replace(/_/g, ' ').toLowerCase()}: {att.valeur}dB/m × {att.longueurCable}m
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Boutons d'action */}
              <div className="flex justify-end space-x-4">
                <Link href="/configurations">
                  <Button variant="outline" disabled={loading}>
                    Annuler
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    "Sauvegarde..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Créer la configuration
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}