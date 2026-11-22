import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/roomly/app";
import { pageHead } from "@/lib/roomly";
import { Download, ArrowLeft, ExternalLink } from "lucide-react";
import c1 from "../../docs/C1-karta-produktu.md?raw";
import c2 from "../../docs/C2-dostep-i-audyt.md?raw";
import c3 from "../../docs/C3-odpowiedzialnosc.md?raw";
import c4 from "../../docs/C4-wersjonowanie-i-powrot.md?raw";
import audit from "../../docs/audyt-demo.md?raw";
import history from "../../docs/dziennik-wersji.md?raw";
export const Route = createFileRoute("/materialy")({
  head: () => pageHead("Materiały akademickie"),
  component: Materials,
});
const documents = [
  { name: "C1 · Karta produktu", body: c1 },
  { name: "C2 · Dostęp i audyt", body: c2 },
  { name: "C3 · Odpowiedzialność", body: c3 },
  { name: "C4 · Wersjonowanie", body: c4 },
  { name: "Audyt demo", body: audit },
  { name: "Dziennik wersji", body: history },
];
function Materials() {
  const [selected, setSelected] = useState(0);
  const doc = documents[selected];
  return (
    <main>
      <header className="topbar">
        <Brand />
        <Button variant="ghost" asChild>
          <Link to="/">
            <ArrowLeft />
            Wróć do Roomly
          </Link>
        </Button>
      </header>
      <div className="pricing-section">
        <h1>Materiały projektu</h1>
        <p className="page-subtitle">Roomly · Wprowadzenie do chmur obliczeniowych · WSB Merito</p>
        <section className="py-8 border-b border-border">
          <h2>Prototypy dydaktyczne</h2>
          <div className="grid sm:grid-cols-3 gap-5 mt-5">
            {[1, 2, 3].map((v) => (
              <article className="stat-card" key={v}>
                <h3 className="text-lg font-semibold">v{v}</h3>
                <p className="text-xs text-muted-foreground leading-6 my-3">
                  {v === 1
                    ? "Sale, rezerwacje i wybór roli."
                    : v === 2
                      ? "Dodane rezerwacje z kontrolą konfliktów."
                      : "Dodane zarządzanie salami."}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/prototypy/v${v}.html`} target="_blank" rel="noreferrer">
                      <ExternalLink />
                      Otwórz
                    </a>
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <a href={`/prototypy/v${v}.html`} download={`v${v}.html`}>
                      <Download />
                      Pobierz
                    </a>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="py-8">
          <h2>Dokumentacja i audyt</h2>
          <div className="flex flex-wrap gap-2 my-5">
            {documents.map((d, i) => (
              <Button
                variant={selected === i ? "secondary" : "ghost"}
                size="sm"
                key={d.name}
                onClick={() => setSelected(i)}
              >
                {d.name}
              </Button>
            ))}
          </div>
          {doc && <pre className="document-body">{doc.body}</pre>}
        </section>
      </div>
    </main>
  );
}
