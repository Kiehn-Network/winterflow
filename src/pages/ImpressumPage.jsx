import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Snowflake } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Button variant="ghost" asChild className="mb-8 gap-2">
          <Link to="/"><ArrowLeft className="w-4 h-4" /> Zurück zur Startseite</Link>
        </Button>

        <h1 className="text-3xl font-bold mb-8">Impressum</h1>

        <div className="space-y-8 text-sm leading-relaxed text-foreground">
          <section>
            <p className="text-muted-foreground mb-2">Angaben gemäß § 5 TMG und § 18 MStV</p>
            <h2 className="font-semibold text-base mb-1">Einzelunternehmen</h2>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">Betreiber</h2>
            <p>Léon Kiehn</p>
            <p>Einzelunternehmen – Kiehn Dienstleistungen</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">Anschrift</h2>
            <p>Hardingstraße 6</p>
            <p>21481 Lauenburg</p>
            <p>Deutschland</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">Kontakt</h2>
            <p>E-Mail: <a href="mailto:service@kiehn-systeme.de" className="text-primary hover:underline">service@kiehn-systeme.de</a></p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">Verantwortlich für Inhalte</h2>
            <p>Verantwortlich gemäß § 18 Abs. 2 MStV:</p>
            <p>Léon Kiehn, Hardingstraße 6, 21481 Lauenburg</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">Geltungsbereich</h2>
            <p className="mb-2">Dieses Impressum gilt für folgende Domains:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>kiehn-systeme.de</li>
              <li>kiehn-dienstleistungen.de</li>
              <li>niftly.de</li>
              <li>alarmdesk-software.de</li>
            </ul>
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