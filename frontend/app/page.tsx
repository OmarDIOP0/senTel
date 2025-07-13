"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wifi, ArrowRight, BarChart3, Settings, Users, Shield, Zap, Globe, TrendingUp, Star } from "lucide-react"

const features = [
  {
    icon: Settings,
    title: "Configuration Avancée",
    description: "Configurez vos réseaux 5G avec des paramètres précis et des presets intelligents",
  },
  {
    icon: BarChart3,
    title: "Analyses Détaillées",
    description: "Obtenez des rapports complets avec statistiques et visualisations avancées",
  },
  {
    icon: TrendingUp,
    title: "Optimisation Continue",
    description: "Surveillez les performances et optimisez vos configurations en temps réel",
  },
  {
    icon: Shield,
    title: "Sécurité Renforcée",
    description: "Gestion des utilisateurs et des permissions avec contrôle d'accès granulaire",
  },
]

const stats = [
  { label: "Configurations Actives", value: "5+", icon: Settings },
  { label: "Rapports Générés", value: "5+", icon: BarChart3 },
  { label: "Utilisateurs", value: "3+", icon: Users },
  { label: "Projets Déployés", value: "5+", icon: Globe },
]

const testimonials = [
  {
    name: "Omar DIOP",
    role: "Ingénieur Logiciel",
    company: "CEO SenTel",
    content:
      "SenTel a révolutionné l'approche du dimensionnement 5G. Les analyses sont précises et l'interface intuitive.",
    rating: 5,
  },
  {
    name: "Ndeye Mareme Gueye",
    role: "Ingénieure Logiciel",
    company: "CTO SenTel",
    content:
      "Un outil indispensable pour les déploiements 5G. Les rapports automatisés nous font gagner un temps précieux.",
    rating: 5,
  },
  {
    name: "Mamadou Sylla",
    role: "Testeur Logiciel",
    company: "FreeLanceur",
    content: "La qualité des analyses et la facilité d'utilisation font de SenTel une solution de référence.",
    rating: 5,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Wifi className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SenTel</h1>
                <p className="text-sm text-gray-600">Dimensionnement 5G Intelligent</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Se connecter</Button>
              </Link>
              <Link href="/register">
                <Button>Commencer</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Zap className="w-4 h-4 mr-2" />
            Nouvelle génération de dimensionnement 5G
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Dimensionnez vos
            <span className="text-blue-600 block">réseaux 5G</span>
            avec précision
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            SenTel est la plateforme de référence pour le dimensionnement, l'analyse et l'optimisation des réseaux 5G.
            Obtenez des configurations précises, des rapports détaillés et des insights actionables.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-4">
                Démarrer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            {/* <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent">
                Voir la démo
              </Button>
            </Link> */}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <stat.icon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tout ce dont vous avez besoin pour vos réseaux 5G</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une suite complète d'outils pour dimensionner, analyser et optimiser vos déploiements 5G
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="p-3 bg-blue-100 rounded-lg w-fit">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ce que disent nos clients</h2>
            <p className="text-xl text-gray-600">Plus de 3 professionnels nous font confiance</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role} • {testimonial.company}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Prêt à optimiser vos réseaux 5G ?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez les professionnels qui utilisent SenTel pour leurs déploiements 5G
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Wifi className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">SenTel</span>
              </div>
              <p className="text-gray-400">La solution de référence pour le dimensionnement des réseaux 5G</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Fonctionnalités</li>
                <li>Tarifs</li>
                <li>Documentation</li>
                <li>API</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-gray-400">
                <li>À propos</li>
                <li>Blog</li>
                <li>Carrières</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Centre d'aide</li>
                <li>Communauté</li>
                <li>Statut</li>
                <li>Sécurité</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SenTel. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
