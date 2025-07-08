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
import { Wifi, AlertCircle } from "lucide-react"
import AuthContext from "@/context/AuthContext"

export default function LoginPage() {
  // const [email, setEmail] = useState("")
  // const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
    const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const {loginMutation} = useContext(AuthContext);
    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate(formData); 
  };

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData({
          ...formData,
          [name]: value
      });
  }

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setLoading(true)
  //   setError("")

  //   // Simulate API call
  //   setTimeout(() => {
  //     if (email === "admin@sentel.com" && password === "admin123") {
  //       localStorage.setItem(
  //         "user",
  //         JSON.stringify({
  //           id: 1,
  //           name: "Admin User",
  //           email: "admin@sentel.com",
  //           role: "ADMIN",
  //         }),
  //       )
  //       router.push("/dashboard")
  //     } else {
  //       setError("Email ou mot de passe incorrect")
  //     }
  //     setLoading(false)
  //   }, 1000)
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
          <CardTitle className="text-2xl font-bold text-gray-900">SenTel</CardTitle>
          <CardDescription>Dimensionnement des réseaux 5G</CardDescription>
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Pas encore de compte ? </span>
              <Link href="/register" className="text-blue-600 hover:underline">
                Créer un compte
              </Link>
            </div>
          </form>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
            <strong>Compte de démonstration :</strong>
            <br />
            Email: admin@sentel.com
            <br />
            Mot de passe: admin123
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
