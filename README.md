# florianmachnow.ai

Verkaufsseite für die freiberufliche KI-Beratung von Florian Machnow.
Statische Website ohne Build-Schritt, ohne Framework, ohne Tracking.

**Stand:** 27. Juli 2026 · **Status:** fertig zum Deploy, offene Punkte siehe [Abschnitt 9](#9-offene-punkte).

---

## 1. Zielsetzung

| | |
|---|---|
| **Primäres Ziel** | Gebuchtes Erstgespräch über den eingebetteten Cal.com-Kalender |
| **Zielgruppe** | Marketing- und Kommunikationsabteilungen in Unternehmen, Ansprechpartner auf Leitungsebene |
| **Positionierung** | „Der Operator, nicht der Berater“ — die KI-Umstellung wurde selbst verantwortet, nicht empfohlen |
| **Sichtbarkeit** | Bewusst **nicht** in Suchmaschinen. Traffic kommt ausschließlich über direkte Verlinkung, LinkedIn, E-Mail und Empfehlung |
| **Sprachen** | Deutsch (Original) und Englisch (`/en/`) |

### Messaging in einem Satz
> Ich habe eine Marketing-Organisation auf KI umgestellt. Nicht als Konzept. In der laufenden Produktion.

### Dramaturgie der Startseite
`Hero → Proof-Leiste → 01 Ausgangslage → 02 Belege → 03 Leistungen (3 Stufen) → 04 Arbeitsfelder → 05 Ablauf → 06 Person → 07 FAQ → 08 Termin`

Jede Sektion endet entweder mit einem Beleg oder einem Weg zum Kalender. Es gibt genau eine Handlungsaufforderung: Termin buchen.

---

## 2. Dateistruktur

```
florianmachnow-ai/
├── index.html                  Startseite Deutsch
├── impressum.html              Impressum (§ 5 DDG)
├── datenschutz.html            Datenschutzerklärung (Art. 13 DSGVO)
├── danke.html                  Bestätigungsseite nach Buchung
├── en/
│   ├── index.html              Startseite Englisch
│   ├── legal-notice.html       Impressum EN (Übersetzung, DE ist maßgeblich)
│   ├── privacy.html            Datenschutz EN (Übersetzung, DE ist maßgeblich)
│   └── thank-you.html          Bestätigungsseite EN
├── assets/
│   ├── css/style.css           Komplettes Design-System, eine Datei
│   ├── js/main.js              Consent-Gate für Cal.com, Footer-Jahr. Sonst nichts.
│   └── img/
│       ├── florian-machnow.jpg PLATZHALTER, bitte ersetzen
│       ├── og-image.png        Vorschaubild für LinkedIn, Slack, WhatsApp
│       ├── icon-192.png
│       └── icon-512.png
├── favicon.svg                 Browser-Icon (modern)
├── favicon.ico                 Browser-Icon (Fallback, 16/32/48/64)
├── apple-touch-icon.png        Homescreen-Icon iOS
├── site.webmanifest            PWA-Manifest
├── robots.txt                  Vollständiger Ausschluss inkl. KI-Crawler
├── _headers                    Header-Fallback (falls ohne netlify.toml deployt)
├── _redirects                  Saubere URLs ohne .html
├── netlify.toml                Deploy- und Header-Konfiguration
└── README.md                   Diese Datei
```

---

## 3. Deployment

Repository: `https://github.com/machnowf-debug/AI_Consultant.git`

### 3.1 Erstmalig ins Repo bringen

```bash
cd florianmachnow-ai
git init
git branch -M main
git add .
git commit -m "feat: Website florianmachnow.ai"
git remote add origin https://github.com/machnowf-debug/AI_Consultant.git
git push -u origin main
```

Falls das Repo bereits Inhalte hat, lieber über einen Branch und Pull Request:

```bash
git checkout -b feat/website
git push -u origin feat/website
```

### 3.2 Netlify verbinden

1. Netlify → **Add new site → Import an existing project → GitHub → AI_Consultant**
2. Build-Einstellungen: **Build command leer lassen**, **Publish directory `.`**
   (steht bereits in `netlify.toml`, Netlify übernimmt es automatisch)
3. Deploy starten

### 3.3 Domain florianmachnow.ai verbinden

1. Netlify → **Domain management → Add domain → `florianmachnow.ai`**
2. Beim Domain-Registrar die Nameserver auf Netlify umstellen **oder** folgende Records setzen:

   | Typ | Name | Wert |
   |---|---|---|
   | A | `@` | `75.2.60.5` (Netlify Load Balancer) |
   | CNAME | `www` | `<dein-site-name>.netlify.app` |

3. Netlify stellt anschließend automatisch ein Let's-Encrypt-Zertifikat aus. HTTPS erzwingen aktivieren.
4. In `netlify.toml` ist `Strict-Transport-Security` gesetzt. Erst aktivieren, wenn das Zertifikat steht.

> **Hinweis:** Die Netlify-IP kann sich ändern. Der offizielle Weg über Netlify DNS ist stabiler und wird empfohlen.

---

## 4. Cal.com einrichten

Der Kalender ist eingebaut, aber der Link muss noch auf deinen echten Cal.com-Account zeigen.

**Genau eine Stelle anpassen:** `assets/js/main.js`, ganz oben:

```js
window.SITE_CONFIG = {
  calLink: 'florianmachnow/erstgespraech',   // ← hier deinen Cal.com-Slug eintragen
  ...
};
```

Zusätzlich der Fallback-Link im Markup (falls JavaScript deaktiviert ist):
* `index.html` → Suche nach `cal.com/florianmachnow/erstgespraech`
* `en/index.html` → dieselbe Stelle

### Empfohlene Cal.com-Einstellungen

| Einstellung | Empfehlung | Begründung |
|---|---|---|
| Event-Titel | „Erstgespräch, 30 Minuten“ | Deckt sich mit der Seite |
| Dauer | 30 Minuten | Wie auf der Seite versprochen |
| Puffer | 15 Minuten danach | Zeit für die Kurznotizen |
| Buchungsfragen | Unternehmen, Rolle, „Wo klemmt es aktuell?“ | Qualifiziert den Lead vor dem Call |
| Mindestvorlauf | 12 Stunden | Verhindert Überraschungstermine |
| Redirect nach Buchung | `https://florianmachnow.ai/danke` | Aktiviert die Danke-Seite |
| Kalender-Sync | Google Calendar verbinden | Verhindert Doppelbuchungen |
| Standort | Google Meet oder Teams | Vorab festlegen |

---

## 5. Datenschutz- und Consent-Konzept

* **Kein Cookie-Banner beim Seitenaufruf.** Es wird nichts geladen, was zustimmungspflichtig wäre.
* **Keine externen Schriftarten.** Die Typografie nutzt ausschließlich Systemschriften (Georgia für Überschriften, System-Sans für Fließtext). Das ist der Grund, warum keine Google-Fonts-Problematik entsteht.
* **Kein Tracking.** Kein Analytics, keine Pixel, keine Social-Plugins.
* **Cal.com lädt erst nach Klick.** Vorher steht nur ein statischer Hinweis. Rechtsgrundlage: Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG.
* **Die Einwilligung** wird ausschließlich lokal im Browser gespeichert (`localStorage`, Schlüssel `fm-cal-consent-v1`) und kann über „Einwilligung widerrufen“ im Seitenfuß gelöscht werden.

### Wenn später doch Statistik gewünscht ist
Empfehlung: **Plausible** oder **Umami**, EU-gehostet und cookiefrei. Dann sind zwei Änderungen nötig:
1. Script-Tag einbauen und `script-src` in `netlify.toml` sowie `_headers` um die Domain erweitern
2. Abschnitt in beiden Datenschutzerklärungen ergänzen

Ein Cookie-Banner wird dadurch **nicht** nötig. Bei Google Analytics dagegen schon.

---

## 6. Suchmaschinen-Ausschluss

Dreifach abgesichert, weil `robots.txt` allein nicht zuverlässig ist:

1. `robots.txt` mit `Disallow: /` für alle Bots, zusätzlich namentlich für GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Bytespider und weitere KI-Crawler
2. `<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex, noai, noimageai">` auf **jeder** Seite
3. HTTP-Header `X-Robots-Tag: noindex, nofollow` über `netlify.toml` und `_headers`

Es existiert bewusst **keine** `sitemap.xml`.

**Konsequenz, die du kennen solltest:** Die Seite bekommt keinen organischen Traffic. Jeder Besuch muss aktiv von dir erzeugt werden, über LinkedIn-Profil, E-Mail-Signatur, Angebote und Empfehlungen. Wenn sich das ändern soll, siehe Abschnitt 8.

---

## 7. Inhalte pflegen

Alles liegt direkt im HTML. Es gibt kein CMS, keinen Build und keine Abhängigkeiten.

| Was ändern | Wo |
|---|---|
| Überschrift, Claims, Zahlen | `index.html` und `en/index.html`, Sektion `<!-- HERO -->` und `<!-- BELEGE -->` |
| Leistungen und Stufen | Sektion `<!-- LEISTUNGEN -->` bzw. `<!-- SERVICES -->` |
| FAQ-Einträge | Sektion `<!-- FAQ -->`, ein `<details>`-Block je Frage |
| Farben und Typografie | `assets/css/style.css`, Block `:root` ganz oben |
| Cal.com-Link | `assets/js/main.js`, `SITE_CONFIG.calLink` |
| Portraitfoto | `assets/img/florian-machnow.jpg` überschreiben, gleiches Seitenverhältnis 4:5 |

### Farbwerte
| Variable | Wert | Verwendung |
|---|---|---|
| `--ink` | `#0E0E0E` | Text, Buttons, dunkle Sektionen |
| `--accent` | `#B5451F` | Akzent, Nummerierung, Hover |
| `--sand` | `#F5F3EE` | Flächen zur Rhythmisierung |
| `--line` | `#DDD9D2` | Haarlinien des Rasters |

### Lokal ansehen
```bash
cd florianmachnow-ai
python3 -m http.server 8000
# Browser: http://localhost:8000
```

---

## 8. Bewusste Entscheidungen (und was sie kosten)

| Entscheidung | Vorteil | Preis |
|---|---|---|
| Keine Kundenlogos, anonymisierte Referenzen | Ehrlich, kein Konflikt mit früheren Arbeitgebern | Weniger unmittelbare Autorität als eine Logo-Wand |
| Keine Preise auf der Seite | Mehr Erstgespräche, mehr Verhandlungsspielraum | Auch unqualifizierte Anfragen kommen durch |
| `noindex` | Volle Kontrolle darüber, wer die Seite sieht | Null organischer Traffic, jeder Besuch muss erarbeitet werden |
| Kein CMS, reines HTML | Extrem schnell, wartungsarm, keine Sicherheitslücken | Änderungen laufen über Code, nicht über einen Editor |
| Systemschriften statt Webfonts | Kein Consent-Thema, sofortiger Seitenaufbau | Typografie sieht auf Windows minimal anders aus als auf macOS |
| Kleinunternehmerregelung im Impressum | Korrekt zum jetzigen Status | Muss geändert werden, sobald die Grenze gerissen wird (siehe unten) |

---

## 9. Offene Punkte

Diese Liste wird bei jeder Änderung aktualisiert.

### Blockierend vor dem Livegang
- [ ] **Cal.com-Account anlegen** und Slug in `assets/js/main.js` eintragen, sonst zeigt der Kalender ins Leere
- [ ] **E-Mail-Adresse `kontakt@florianmachnow.ai` einrichten**. Sie steht im Impressum, in der Datenschutzerklärung und an drei Stellen auf der Startseite. Ohne funktionierendes Postfach ist das Impressum unvollständig.
- [ ] **Portraitfoto liefern** und `assets/img/florian-machnow.jpg` ersetzen. Aktuell liegt dort ein Platzhalter. Empfehlung: 1600 × 2000 px, natürliches Licht, ruhiger Hintergrund, kein Studio-Look.
- [ ] **Telefonnummer im Impressum entscheiden.** Aktuell steht dort nur eine E-Mail-Adresse. Das ist nach aktueller Rechtsprechung zulässig, solange eine schnelle elektronische Kontaktaufnahme möglich ist. Wenn du die Nummer aus dem Lebenslauf (+49 176 41642968) aufnehmen willst, ergänze sie in `impressum.html` und `en/legal-notice.html`.

### Fachlich zu prüfen
- [ ] **Kalenderanbieter bestätigen.** In beiden Datenschutzerklärungen steht Google Workspace (Google Ireland Limited). Falls du einen anderen Anbieter nutzt, muss die Passage „Kalender- und E-Mail-Anbieter“ angepasst werden.
- [ ] **Auftragsverarbeitungsverträge abschließen** mit Netlify und Cal.com. Beide Anbieter stellen sie im Konto bereit. Die Datenschutzerklärung behauptet aktuell, dass sie bestehen.
- [ ] **Claim „über 100 Mio. Impressions“ belegen.** Der Lebenslauf spricht von neunstelligen Views im ersten Jahr für Organic Social insgesamt. Auf der Seite steht „Impressions auf Creatives, die mit KI produziert wurden“. Prüfe, ob diese Zuordnung sauber ist, und leg dir für das Erstgespräch eine Herleitung zurecht.
- [ ] **Claim „−85 % Produktionskosten bei 2 bis 3× Output“** ebenfalls mit Rechenweg hinterlegen. Genau das wird die erste Rückfrage im Erstgespräch sein.
- [ ] **Kleinunternehmerregelung.** Bei Enterprise-Honoraren ist die Grenze schnell überschritten. Sobald du regelbesteuert bist, muss der Abschnitt „Umsatzsteuer“ im Impressum durch die USt-IdNr. ersetzt werden.
- [ ] **Rechtstexte anwaltlich prüfen lassen.** Impressum und Datenschutzerklärung sind sorgfältig und nach aktuellem Stand erstellt, ersetzen aber keine Rechtsberatung.

### Optional, wenn die ersten Kunden da sind
- [ ] Zwei bis drei echte Fallstudien als Unterseiten ergänzen
- [ ] Ein Testimonial, sobald das erste Mandat abgeschlossen ist
- [ ] LinkedIn-Profillink in den Seitenfuß
- [ ] Entscheiden, ob der `noindex` fällt. Wenn ja: `robots.txt` und Meta-Tags anpassen, `X-Robots-Tag` entfernen, `sitemap.xml` ergänzen

---

## 10. Änderungshistorie

| Datum | Änderung |
|---|---|
| 2026-07-27 | Erstversion: Onepager DE und EN, Rechtsseiten, Cal.com-Consent-Gate, Icons, Deploy-Konfiguration, Suchmaschinen-Ausschluss |
