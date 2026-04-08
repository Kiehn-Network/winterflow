import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Snowflake,
  MapPin,
  Users,
  ClipboardList,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Clock,
  Shield,
  Truck
} from "lucide-react";

const features = [
  {
    icon: ClipboardList,
    title: "Auftragsverwaltung",
    description: "Erstellen, zuweisen und verfolgen Sie alle Winterdienst-Aufträge in Echtzeit.",
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  },
  {
    icon: MapPin,
    title: "Live-Karte",
    description: "Behalten Sie alle Einsatzorte und Fahrer auf einer interaktiven Karte im Blick.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10"
  },
  {
    icon: Truck,
    title: "Fahrer-App",
    description: "Mobile Ansicht für Fahrer mit Foto-Upload, GPS und Materialerfassung.",
    color: "text-green-400",
    bg: "bg-green-500/10"
  },
  {
    icon: Users,
    title: "Kundenverwaltung",
    description: "Verwalten Sie Ihre Kunden mit SLA-Prioritäten und Vertragsdaten.",
    color: "text-purple-400",
    bg: "bg-purple-500/10"
  },
  {
    icon: BarChart3,
    title: "Auswertungen",
    description: "Detaillierte Berichte über Einsatzzeiten, Materialverbrauch und Fahrerleistung.",
    color: "text-orange-400",
    bg: "bg-orange-500/10"
  },
  {
    icon: Shield,
    title: "Rollenbasiert",
    description: "Separate Ansichten für Disponenten, Fahrer und Administratoren.",
    color: "text-red-400",
    bg: "bg-red-500/10"
  }
];

const stats = [
  { value: "100%", label: "Digital & Papierlos" },
  { value: "Live", label: "GPS-Tracking" },
  { value: "24/7", label: "Einsatzbereit" },
  { value: "SLA", label: "Prioritätsverwaltung" }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://media.base44.com/images/public/69d373dcdb440f6b30848567/2104f3fa8_generated_image.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-background" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-28 md:py-40">
          {/* Logo Badge */}
          <div className="flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-8">
            <Snowflake className="w-5 h-5 text-primary animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-primary font-semibold text-sm tracking-wide">WinterFlow Winterdienst</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight max-w-4xl">
            Winterdienst.<br />
            <span className="text-primary">Digital verwaltet.</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
            Professionelle Auftragsverwaltung für Ihren Winterdienst –
            von der Disposition bis zur Abrechnung, alles in einer Lösung.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="text-base px-8 py-6 rounded-xl shadow-lg shadow-primary/30">
              <Link to="/dashboard">
                Zum Dashboard
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base px-8 py-6 rounded-xl border-white/20 text-white hover:bg-white/10">
              <Link to="/orders">
                Aufträge öffnen
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-card border-y border-border">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-extrabold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold">Alles, was Sie brauchen</h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-xl mx-auto">
            WinterFlow deckt alle Anforderungen moderner Winterdienstbetriebe ab.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.title} className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border-border/60">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="flex justify-center gap-6 mb-8 text-sm text-muted-foreground">
            {["Einfache Bedienung", "Keine Einschränkungen", "Sofort startklar"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Bereit für die Wintersaison?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Starten Sie jetzt und behalten Sie alle Einsätze im Griff.
          </p>
          <Button asChild size="lg" className="text-base px-10 py-6 rounded-xl shadow-lg shadow-primary/30">
            <Link to="/dashboard">
              Jetzt starten
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2">
          <Snowflake className="w-4 h-4 text-primary" />
          <span>WinterFlow Winterdienst-Management © {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}