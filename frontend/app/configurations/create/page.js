"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Save, AlertCircle, CheckCircle, Plus, Trash2 } from "lucide-react"
import { getAllProjets } from "@/services/projetService"
import { createConfiguration, addEmetteurToConfig, addRecepteurToConfig, addAttenuationsToConfig, simulerConfiguration } from "@/services/configurationService"
import { toast } from "@/components/ui/use-toast"
import { useAdminService } from "@/services/useAdminService"

const attenuationTypes = [
  "PERTE_EPISSURE_FUSION",
  "PERTE_EPISSURE_MECANIQUE",
  "CABLE_RACCORDEMENT",
  "PERTE_CONNECTEUR"
]

export default function CreateConfigurationPage() {
  const [etape, setEtape] = useState(1)
  const [configId, setConfigId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [projects, setProjects] = useState([])
  const [rapport, setRapport] = useState(null)
  const router = useRouter()
  const { profileData } = useAdminService()

  // Données du formulaire
  const [formData, setFormData] = useState({
    projetId: "",
    distance: "",
    bandePassante: "",
  })

  const [emetteurData, setEmetteurData] = useState({
    puissanceEntree: "",
    frequence: ""
  })

  const [recepteurData, setRecepteurData] = useState({
    sensibilite: "",
    gainReception: ""
  })

  const [attenuations, setAttenuations] = useState([])
  const [newAttenuation, setNewAttenuation] = useState({ 
    nomAttenuation: "", 
    valeur: "", 
    longueurCable: "1" 
  })

  // Charger les projets
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await getAllProjets()
        setProjects(response.data || [])
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les projets",
        })
      }
    }
    loadProjects()
  }, [])

  // Gestion des atténuations
  const addAttenuation = () => {
    if (newAttenuation.nomAttenuation && newAttenuation.valeur) {
      const newAtt = {
        id: `att-${Date.now()}`,
        nomAttenuation: newAttenuation.nomAttenuation,
        valeur: parseFloat(newAttenuation.valeur),
        longueurCable: parseFloat(newAttenuation.longueurCable) || 1
      }
      setAttenuations([...attenuations, newAtt])
      setNewAttenuation({ nomAttenuation: "", valeur: "", longueurCable: "1" })
    }
  }

  const removeAttenuation = (id) => {
    setAttenuations(attenuations.filter(att => att.id !== id))
  }

  const calculateTotalAttenuation = () => {
    return attenuations.reduce(
      (total, att) => total + (parseFloat(att.valeur) * parseFloat(att.longueurCable || 1)), 
      0
    ).toFixed(2)
  }

  // Étape 1: Créer la configuration
  const handleCreateConfig = async () => {
    if (!formData.projetId || !formData.distance || !formData.bandePassante) {
      setError("Veuillez remplir tous les champs obligatoires")
      return
    }

    setLoading(true)
    try {
      const response = await createConfiguration({
        ...formData,
        clientId: profileData?.id
      })
      setConfigId(response.data.id)
      setEtape(2)
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création")
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error,
      })
    } finally {
      setLoading(false)
    }
  }

  // Étape 2: Ajouter équipements et atténuations
  const handleAddEquipment = async () => {
    if (!emetteurData.puissanceEntree || !emetteurData.frequence || 
        !recepteurData.sensibilite || !recepteurData.gainReception) {
      setError("Veuillez remplir tous les champs des équipements")
      return
    }

    setLoading(true)
    try {
      // Ajouter émetteur
      await addEmetteurToConfig(configId, emetteurData)
      
      // Ajouter récepteur
      await addRecepteurToConfig(configId, recepteurData)
      
      // Ajouter atténuations
      if (attenuations.length > 0) {
        await addAttenuationsToConfig(configId, attenuations)
      }
      
      setEtape(3)
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'ajout des équipements")
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error,
      })
    } finally {
      setLoading(false)
    }
  }

  // Étape 3: Simulation
  const handleSimuler = async () => {
    setLoading(true)
    try {
      const response = await simulerConfiguration(configId)
      setRapport(response.data)
      setSuccess(true)
      toast({
        title: "Succès",
        description: "Simulation terminée",
      })
      setTimeout(() => router.push("/configurations"), 2000)
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la simulation")
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error,
      })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-64 p-6 lg:p-8">
          <Card className="max-w-md mx-auto mt-20">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Configuration créée !</h2>
                <p className="text-gray-600 mb-4">
                  Votre configuration a été simulée avec succès.
                </p>
                <Button onClick={() => router.push("/configurations")}>
                  Retour aux configurations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2" /> Retour
          </Button>
          <div className="ml-4">
            <h1 className="text-3xl font-bold">Nouvelle configuration</h1>
            <p className="text-gray-600">Étape {etape} sur 3</p>
          </div>
        </div>

        {/* Indicateur d'étapes */}
        <div className="flex mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                ${etape >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {step}
              </div>
              {step < 3 && <div className="w-16 h-1 bg-gray-200 mx-2"></div>}
            </div>
          ))}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Étape 1: Configuration de base */}
        {etape === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Configuration de base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Projet *</Label>
                <Select 
                  value={formData.projetId} 
                  onValueChange={(value) => setFormData({...formData, projetId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un projet" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Distance (km) *</Label>
                  <Input 
                    type="number" 
                    step="0.1"
                    value={formData.distance}
                    onChange={(e) => setFormData({...formData, distance: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Bande passante (MHz) *</Label>
                  <Input 
                    type="number"
                    value={formData.bandePassante}
                    onChange={(e) => setFormData({...formData, bandePassante: e.target.value})}
                  />
                </div>
              </div>
              
              <Button onClick={handleCreateConfig} disabled={loading}>
                {loading ? "En cours..." : "Continuer"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Étape 2: Équipements et atténuations */}
        {etape === 2 && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Paramètres de l'émetteur</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Puissance d'entrée (dBm) *</Label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={emetteurData.puissanceEntree}
                    onChange={(e) => setEmetteurData({...emetteurData, puissanceEntree: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Fréquence (GHz) *</Label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={emetteurData.frequence}
                    onChange={(e) => setEmetteurData({...emetteurData, frequence: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Paramètres du récepteur</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Sensibilité (dBm) *</Label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={recepteurData.sensibilite}
                    onChange={(e) => setRecepteurData({...recepteurData, sensibilite: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Gain de réception (dB) *</Label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={recepteurData.gainReception}
                    onChange={(e) => setRecepteurData({...recepteurData, gainReception: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Atténuations</CardTitle>
                <CardDescription>
                  Total: <strong>{calculateTotalAttenuation()} dB</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {attenuations.map((att) => (
                  <div key={att.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Type</Label>
                        <Select
                          value={att.nomAttenuation}
                          onValueChange={(value) => setAttenuations(attenuations.map(a => 
                            a.id === att.id ? {...a, nomAttenuation: value} : a
                          ))}
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
                        <Label className="text-xs">Valeur (dB/m)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={att.valeur}
                          onChange={(e) => setAttenuations(attenuations.map(a => 
                            a.id === att.id ? {...a, valeur: e.target.value} : a
                          ))}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Longueur (m)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={att.longueurCable}
                          onChange={(e) => setAttenuations(attenuations.map(a => 
                            a.id === att.id ? {...a, longueurCable: e.target.value} : a
                          ))}
                          className="h-9"
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttenuation(att.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="space-y-3">
                  <h5 className="font-medium flex items-center">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une atténuation
                  </h5>
                  <div className="flex items-end gap-3">
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Type</Label>
                        <Select
                          value={newAttenuation.nomAttenuation}
                          onValueChange={(value) => setNewAttenuation({...newAttenuation, nomAttenuation: value})}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Type" />
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
                        <Label className="text-xs">Valeur (dB/m)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="0.0"
                          value={newAttenuation.valeur}
                          onChange={(e) => setNewAttenuation({...newAttenuation, valeur: e.target.value})}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Longueur (m)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="1.0"
                          value={newAttenuation.longueurCable}
                          onChange={(e) => setNewAttenuation({...newAttenuation, longueurCable: e.target.value})}
                          className="h-9"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={addAttenuation}
                      disabled={!newAttenuation.nomAttenuation || !newAttenuation.valeur}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setEtape(1)}>
                Retour
              </Button>
              <Button onClick={handleAddEquipment} disabled={loading}>
                {loading ? "En cours..." : "Continuer vers la simulation"}
              </Button>
            </div>
          </>
        )}

        {/* Étape 3: Simulation */}
        {etape === 3 && (
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Résumé de la configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Projet:</Label>
                    <p>{projects.find(p => p.id === formData.projetId)?.nom || 'Non spécifié'}</p>
                  </div>
                  <div>
                    <Label>Distance:</Label>
                    <p>{formData.distance} km</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Bande passante:</Label>
                    <p>{formData.bandePassante} MHz</p>
                  </div>
                  <div>
                    <Label>Total atténuations:</Label>
                    <p>{calculateTotalAttenuation()} dB</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Émetteur:</Label>
                    <p>{emetteurData.puissanceEntree} dBm @ {emetteurData.frequence} GHz</p>
                  </div>
                  <div>
                    <Label>Récepteur:</Label>
                    <p>Sensibilité: {recepteurData.sensibilite} dBm, Gain: {recepteurData.gainReception} dB</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setEtape(2)}>
                Retour
              </Button>
              <Button onClick={handleSimuler} disabled={loading}>
                {loading ? "Simulation en cours..." : "Lancer la simulation"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}