"use client"

import type React from "react"

import { useContext, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wifi, AlertCircle, CheckCircle } from "lucide-react"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import  AuthContext  from "@/context/AuthContext"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nomComplet: "",
    email: "",
    role: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

const {registerMutation} = useContext(AuthContext);

    const handleSubmit  = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Données envoyées :", formData);
        registerMutation.mutate(formData);
        setSuccess(true);
    }
    
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

  // if (success) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
  //       <Card className="w-full max-w-md">
  //         <CardContent className="pt-6">
  //           <div className="text-center">
  //             <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
  //             <h2 className="text-xl font-semibold text-gray-900 mb-2">Inscription réussie !</h2>
  //             <p className="text-gray-600 mb-4">
  //               Votre compte a été créé avec succès. Redirection vers la page d'accueil...
  //             </p>
  //           </div>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Wifi className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Créer un compte</CardTitle>
          <CardDescription>Rejoignez SenTel pour dimensionner vos réseaux 5G</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="nomComplet">Nom complet</Label>
              <Input
                id="nomComplet"
                name="nomComplet"
                type="text"
                placeholder="Omar DIOP"
                value={formData.nomComplet}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="omar@exemple.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Select
                  name="role"
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="Sélectionnez un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrateur</SelectItem>
                    <SelectItem value="CLIENT">Utilisateur</SelectItem>
                    <SelectItem value="INGENIEUR_RESEAU">Ingenieur Reseau</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Création..." : "Créer le compte"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Déjà un compte ? </span>
              <Link href="/login" className="text-blue-600 hover:underline">
                Se connecter
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
