import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Snowflake } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Button variant="ghost" asChild className="mb-8 gap-2">
          <Link to="/"><ArrowLeft className="w-4 h-4" /> Zurück zur Startseite</Link>
        </Button>

        <h1 className="text-3xl font-bold mb-8">Datenschutzerklärung</h1>

        <div className="space-y-8 text-sm leading-relaxed text-foreground">
          <section>
            <h2 className="font-semibold text-base mb-2">1. Verantwortlicher</h2>
            <p>Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:</p>
            <p className="mt-2">Léon Kiehn<br />Einzelunternehmen – Kiehn Dienstleistungen<br />Hardingstraße 6<br />21481 Lauenburg<br />E-Mail: <a href="mailto:service@kiehn-systeme.de" className="text-primary hover:underline">service@kiehn-systeme.de</a></p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">2. Erhebung und Speicherung personenbezogener Daten</h2>
            <p>Beim Besuch unserer Website werden automatisch Informationen allgemeiner Natur erfasst (sog. Server-Logfiles). Diese beinhalten u. a. den verwendeten Browsertyp, das Betriebssystem, den Referrer sowie Datum und Uhrzeit des Zugriffs. Diese Daten sind nicht bestimmten Personen zuordenbar und werden nicht mit anderen Datenquellen zusammengeführt.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">3. Nutzung der App-Funktionen</h2>
            <p>Zur Nutzung der WinterFlow-Plattform ist eine Registrierung erforderlich. Dabei werden folgende Daten verarbeitet:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-muted-foreground">
              <li>Name und E-Mail-Adresse</li>
              <li>Standortdaten (bei Nutzung der Fahrerfunktion)</li>
              <li>Auftragsbezogene Daten (Adressen, Notizen, Fotos)</li>
            </ul>
            <p className="mt-2">Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">4. Weitergabe von Daten</h2>
            <p>Eine Übermittlung Ihrer persönlichen Daten an Dritte findet grundsätzlich nicht statt, es sei denn, dies ist zur Vertragserfüllung erforderlich oder Sie haben ausdrücklich eingewilligt.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">5. Cookies</h2>
            <p>Diese Website verwendet technisch notwendige Cookies, die für den Betrieb der Seite erforderlich sind. Es werden keine Tracking- oder Analyse-Cookies eingesetzt.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">6. Ihre Rechte</h2>
            <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung sowie Datenübertragbarkeit. Zur Geltendmachung Ihrer Rechte wenden Sie sich bitte an: <a href="mailto:service@kiehn-systeme.de" className="text-primary hover:underline">service@kiehn-systeme.de</a></p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">7. Beschwerderecht</h2>
            <p>Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten zu beschweren.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">8. Aktualität</h2>
            <p className="text-muted-foreground">Stand: April 2026</p>
          </section>
        </div>
      </div>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2">
          <Snowflake className="w-4 h-4 text-primary" />
          <span>WinterFlow Winterdienst-Management © {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}