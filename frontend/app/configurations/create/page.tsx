"use client"

import type React from "react"

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

// Mock data - projets simplifiés
const projects = [
  { id: 1, name: "Projet Alpha" },
  { id: 2, name: "Projet Beta" },
  { id: 3, name: "Projet Gamma" },
]

// Presets pour faciliter la configuration
const configPresets = [
  {
    name: "Zone urbaine dense",
    distance: "1.5",
    bandwidth: "100",
    emitterPower: "20",
    emitterFrequency: "3.5",
    receiverSensitivity: "-95",
    receiverGain: "15",
    attenuations: [
      { name: "Pluie", value: "2.5" },
      { name: "Végétation", value: "1.8" },
    ],
  },
  {
    name: "Zone rurale",
    distance: "5.0",
    bandwidth: "50",
    emitterPower: "30",
    emitterFrequency: "2.6",
    receiverSensitivity: "-100",
    receiverGain: "18",
    attenuations: [
      { name: "Atmosphérique", value: "0.8" },
      { name: "Relief", value: "3.2" },
    ],
  },
  {
    name: "Zone industrielle",
    distance: "2.0",
    bandwidth: "200",
    emitterPower: "25",
    emitterFrequency: "3.7",
    receiverSensitivity: "-90",
    receiverGain: "12",
    attenuations: [
      { name: "Interférences", value: "4.1" },
      { name: "Obstacles", value: "2.7" },
      { name: "Multipath", value: "1.5" },
    ],
  },
]

// Types d'atténuation prédéfinis
const attenuationTypes = [
  "Pluie",
  "Neige",
  "Brouillard",
  "Végétation",
  "Obstacles",
  "Atmosphérique",
  "Interférences",
  "Multipath",
  "Relief",
  "Bâtiments",
  "Autre",
]

interface Attenuation {
  id: string
  name: string
  value: string
}

export default function CreateConfigurationPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const [formData, setFormData] = useState({
    projectId: "",
    distance: "",
    bandwidth: "",
    emitterPower: "",
    emitterFrequency: "",
    receiverSensitivity: "",
    receiverGain: "",
  })

  const [attenuations, setAttenuations] = useState<Attenuation[]>([])
  const [newAttenuation, setNewAttenuation] = useState({ name: "", value: "" })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const applyPreset = (preset: (typeof configPresets)[0]) => {
    setFormData((prev) => ({
      ...prev,
      distance: preset.distance,
      bandwidth: preset.bandwidth,
      emitterPower: preset.emitterPower,
      emitterFrequency: preset.emitterFrequency,
      receiverSensitivity: preset.receiverSensitivity,
      receiverGain: preset.receiverGain,
    }))

    // Appliquer les atténuations du preset
    const presetAttenuations = preset.attenuations.map((att, index) => ({
      id: `preset-${index}-${Date.now()}`,
      name: att.name,
      value: att.value,
    }))
    setAttenuations(presetAttenuations)
  }

  const addAttenuation = () => {
    if (newAttenuation.name && newAttenuation.value) {
      const newAtt: Attenuation = {
        id: `att-${Date.now()}`,
        name: newAttenuation.name,
        value: newAttenuation.value,
      }
      setAttenuations((prev) => [...prev, newAtt])
      setNewAttenuation({ name: "", value: "" })
    }
  }

  const removeAttenuation = (id: string) => {
    setAttenuations((prev) => prev.filter((att) => att.id !== id))
  }

  const updateAttenuation = (id: string, field: "name" | "value", value: string) => {
    setAttenuations((prev) => prev.map((att) => (att.id === id ? { ...att, [field]: value } : att)))
  }

  const calculateTotalAttenuation = () => {
    return attenuations.reduce((total, att) => total + Number.parseFloat(att.value || "0"), 0).toFixed(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validation simple
    if (!formData.projectId || !formData.distance || !formData.bandwidth) {
      setError("Veuillez remplir tous les champs obligatoires")
      setLoading(false)
      return
    }

    // Simulation API avec les atténuations
    setTimeout(() => {
      console.log("Configuration créée avec atténuations:", { ...formData, attenuations })
      setSuccess(true)
      setLoading(false)
      setTimeout(() => {
        router.push("/configurations")
      }, 2000)
    }, 1000)
  }

  if (!user) {
    return <div>Chargement...</div>
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

            {/* Presets rapides */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Configuration rapide
                </CardTitle>
                <CardDescription>
                  Choisissez un preset pour commencer rapidement (inclut les atténuations)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {configPresets.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 text-left bg-transparent hover:bg-blue-50 border-2 hover:border-blue-200"
                      onClick={() => applyPreset(preset)}
                    >
                      <div className="w-full">
                        <div className="font-medium mb-2">{preset.name}</div>
                        <div className="text-sm text-gray-500 mb-2">
                          {preset.distance}km • {preset.bandwidth}MHz
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {preset.attenuations.map((att, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {att.name}: {att.value}dB
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

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
                  <Select value={formData.projectId} onValueChange={(value) => handleInputChange("projectId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un projet" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.name}
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="bandwidth">Bande passante (MHz) *</Label>
                    <Input
                      id="bandwidth"
                      type="number"
                      placeholder="100"
                      value={formData.bandwidth}
                      onChange={(e) => handleInputChange("bandwidth", e.target.value)}
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
                  <CardDescription>Paramètres avancés (optionnels - valeurs par défaut appliquées)</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Radio className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-gray-900">Émetteur</h4>
                    </div>
                    <div>
                      <Label htmlFor="emitterPower">Puissance (dBm)</Label>
                      <Input
                        id="emitterPower"
                        type="number"
                        placeholder="20"
                        value={formData.emitterPower}
                        onChange={(e) => handleInputChange("emitterPower", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emitterFrequency">Fréquence (GHz)</Label>
                      <Input
                        id="emitterFrequency"
                        type="number"
                        step="0.1"
                        placeholder="3.5"
                        value={formData.emitterFrequency}
                        onChange={(e) => handleInputChange("emitterFrequency", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Radio className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium text-gray-900">Récepteur</h4>
                    </div>
                    <div>
                      <Label htmlFor="receiverSensitivity">Sensibilité (dBm)</Label>
                      <Input
                        id="receiverSensitivity"
                        type="number"
                        placeholder="-95"
                        value={formData.receiverSensitivity}
                        onChange={(e) => handleInputChange("receiverSensitivity", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="receiverGain">Gain (dB)</Label>
                      <Input
                        id="receiverGain"
                        type="number"
                        placeholder="15"
                        value={formData.receiverGain}
                        onChange={(e) => handleInputChange("receiverGain", e.target.value)}
                      />
                    </div>
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
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs text-gray-600">Type d'atténuation</Label>
                              <Select
                                value={attenuation.name}
                                onValueChange={(value) => updateAttenuation(attenuation.id, "name", value)}
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {attenuationTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-xs text-gray-600">Valeur (dB)</Label>
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="0.0"
                                value={attenuation.value}
                                onChange={(e) => updateAttenuation(attenuation.id, "value", e.target.value)}
                                className="h-9"
                              />
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttenuation(attenuation.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="newAttenuationName">Type d'atténuation</Label>
                          <Select
                            value={newAttenuation.name}
                            onValueChange={(value) => setNewAttenuation((prev) => ({ ...prev, name: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choisir le type" />
                            </SelectTrigger>
                            <SelectContent>
                              {attenuationTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="newAttenuationValue">Valeur (dB)</Label>
                          <Input
                            id="newAttenuationValue"
                            type="number"
                            step="0.1"
                            placeholder="0.0"
                            value={newAttenuation.value}
                            onChange={(e) => setNewAttenuation((prev) => ({ ...prev, value: e.target.value }))}
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={addAttenuation}
                        disabled={!newAttenuation.name || !newAttenuation.value}
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
                            {att.name}: {att.value}dB
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
                  <Button variant="outline">Annuler</Button>
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
