# florianmachnow.de

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
florianmachnow-de/
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
│       ├── florian-machnow.jpg Portraet, 1200 x 1500 px, 4:5
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

### 3.1 Projekt an einen dauerhaften Ort kopieren

Der Ordner liegt aktuell im Ausgabeverzeichnis der Cowork-Sitzung. Dieser Pfad ist sitzungsgebunden und
sollte kein Git-Arbeitsverzeichnis sein. Also zuerst umziehen:

```bash
mkdir -p ~/Projekte

cp -R "/Users/florian/Library/Application Support/Claude/local-agent-mode-sessions/e6532d41-fe4a-4c59-befd-6e7e9240e062/e12108ca-6572-4292-a212-9da72df6331d/local_a815e5cb-fe83-42c5-85eb-e1ffbb84aa7e/outputs/florianmachnow-de" ~/Projekte/

cd ~/Projekte/florianmachnow-de
```

Die Anführungszeichen sind nötig, weil `Application Support` ein Leerzeichen enthält.
Ab hier ist `~/Projekte/florianmachnow-de` dein Arbeitsverzeichnis. Alle weiteren Befehle laufen dort.

### 3.2 Erstmalig ins Repo bringen

> **Wichtig:** Im Ordner liegt bereits ein `.git`-Verzeichnis aus der Erstellungsumgebung.
> Es enthält verwaiste Lock-Dateien und muss einmal gelöscht werden, sonst meldet Git,
> es laufe bereits ein anderer Prozess.

```bash
cd ~/Projekte/florianmachnow-de
rm -rf .git

git init
git branch -M main
git add .
git commit -m "feat: Website florianmachnow.de"
git remote add origin https://github.com/machnowf-debug/AI_Consultant.git
git push -u origin main
```

**Falls der Push abgelehnt wird** („Updates were rejected“), liegen im Repo bereits Commits.
Dann entweder zusammenführen:

```bash
git pull --rebase origin main
git push -u origin main
```

oder sauberer über einen eigenen Branch mit Pull Request:

```bash
git checkout -b feat/website
git push -u origin feat/website
```

### 3.3 Netlify verbinden

1. Netlify → **Add new site → Import an existing project → GitHub → AI_Consultant**
2. Build-Einstellungen: **Build command leer lassen**, **Publish directory `.`**
   (steht bereits in `netlify.toml`, Netlify übernimmt es automatisch)
3. Deploy starten

### 3.4 Domain florianmachnow.de verbinden (DNS bei STRATO)

> **Wichtig, bevor du irgendetwas anfasst:** Stelle die Nameserver **nicht** auf Netlify um.
> Dein Postfach `kontakt@florianmachnow.de` liegt bei STRATO und hängt an den dortigen MX-Einträgen.
> Wechselst du die Nameserver, sind die MX-Records weg und die E-Mail-Zustellung bricht ab.
> Lass die DNS-Verwaltung bei STRATO und setze dort nur zwei Einträge.

1. Netlify → **Domain management → Add a domain → `florianmachnow.de`**.
   Netlify zeigt dir danach den Namen deiner Site, etwa `florianmachnow.netlify.app`. Den brauchst du gleich.
2. STRATO → **Domainverwaltung → florianmachnow.de → Verwaltung → DNS-Einstellungen**.
   Dort **nur** diese beiden Einträge anlegen oder ändern:

   | Typ | Name | Wert | Wirkung |
   |---|---|---|---|
   | A | `@` (leer lassen) | `75.2.60.5` | florianmachnow.de zeigt auf Netlify |
   | CNAME | `www` | `<dein-site-name>.netlify.app` | www leitet auf dieselbe Seite |

   Die MX-Einträge und den TXT-Eintrag mit dem SPF-Record **unverändert lassen**.
3. Warten. STRATO übernimmt Änderungen meist in 15 bis 60 Minuten, in Einzelfällen bis 24 Stunden.
   Prüfen mit `dig florianmachnow.de +short` oder auf dnschecker.org.
4. Netlify → **Domain management → HTTPS**. Sobald der A-Record greift, stellt Netlify automatisch ein
   Let's-Encrypt-Zertifikat aus. Danach **Force HTTPS** aktivieren.
5. Netlify → **Domain management** → `www.florianmachnow.de` als Weiterleitung auf die Hauptdomain setzen,
   damit es die Seite nur unter einer Adresse gibt.

> **Zwei Hinweise:** Die Netlify-IP `75.2.60.5` ist die offizielle Adresse des Load Balancers. Falls Netlify sie
> ändert, steht die aktuelle immer in der Netlify-Dokumentation unter „Configure external DNS“.
> Der Header `Strict-Transport-Security` ist in `netlify.toml` gesetzt. Er greift erst, wenn das Zertifikat
> ausgestellt ist, also nichts überstürzen, sondern Schritt 4 abwarten.

### 3.5 Schneller Zwischenweg ohne GitHub

Wenn du die Seite in zwei Minuten live sehen willst, bevor du dich um das Repository kümmerst:

1. `florianmachnow-de-site.zip` bereithalten. Sie liegt eine Ebene über dem Projektordner:

   ```
   /Users/florian/Library/Application Support/Claude/local-agent-mode-sessions/e6532d41-fe4a-4c59-befd-6e7e9240e062/e12108ca-6572-4292-a212-9da72df6331d/local_a815e5cb-fe83-42c5-85eb-e1ffbb84aa7e/outputs/florianmachnow-de-site.zip
   ```

   Im Finder öffnen mit:

   ```bash
   open "/Users/florian/Library/Application Support/Claude/local-agent-mode-sessions/e6532d41-fe4a-4c59-befd-6e7e9240e062/e12108ca-6572-4292-a212-9da72df6331d/local_a815e5cb-fe83-42c5-85eb-e1ffbb84aa7e/outputs"
   ```

2. Auf [app.netlify.com/drop](https://app.netlify.com/drop) gehen
3. Die ZIP-Datei ins Browserfenster ziehen

Netlify vergibt sofort eine Testadresse. `netlify.toml`, `_headers` und `_redirects` sind in der ZIP enthalten,
Header und saubere URLs greifen also von Anfang an. Später verbindest du dieselbe Site einfach mit GitHub,
dann läuft jeder weitere Deploy über `git push`.

---

## 4. Cal.com

Der Kalender ist eingebaut und zeigt auf **`https://cal.com/florian-machnow-cmykql/30min`**.

Falls sich der Link ändert, **genau eine Stelle anpassen:** `assets/js/main.js`, ganz oben:

```js
window.SITE_CONFIG = {
  calLink: 'florian-machnow-cmykql/30min',   // Slug ohne https://cal.com/
  ...
};
```

Zusätzlich der Fallback-Link im Markup (greift, wenn JavaScript deaktiviert ist):
* `index.html` → Suche nach `cal.com/florian-machnow-cmykql/30min`
* `en/index.html` → dieselbe Stelle

### Empfohlene Cal.com-Einstellungen

| Einstellung | Empfehlung | Begründung |
|---|---|---|
| Event-Titel | „Erstgespräch, 30 Minuten“ | Deckt sich mit der Seite |
| Dauer | 30 Minuten | Wie auf der Seite versprochen |
| Puffer | 15 Minuten danach | Zeit für die Kurznotizen |
| Buchungsfragen | Unternehmen, Rolle, „Wo klemmt es aktuell?“ | Qualifiziert den Lead vor dem Call |
| Mindestvorlauf | 12 Stunden | Verhindert Überraschungstermine |
| Kalender-Sync | Google Calendar **und** Outlook verbinden | Verhindert Doppelbuchungen über beide Kalender |
| Standort | Google Meet oder Teams | Vorab festlegen |

### Danke-Seite ohne bezahlten Cal.com-Tarif

Der Redirect nach der Buchung ist bei Cal.com ein kostenpflichtiges Feature. Das brauchst du nicht.
Der Embed sendet ein Ereignis, sobald eine Buchung durch ist, und `assets/js/main.js` hört darauf:

```js
window.Cal('on', { action: 'bookingSuccessful', callback: ... });
```

Danach wird nach 700 Millisekunden auf `/danke.html` weitergeleitet, auf der englischen Seite auf
`/en/thank-you.html`. Die Wartezeit sorgt dafür, dass die Cal.com-Bestätigung kurz sichtbar ist.
Falls Cal.com das Ereignis irgendwann umbenennt, bleibt einfach die Cal.com-Bestätigung stehen.
Es geht nichts kaputt, die Buchung ist in jedem Fall durch.

Zielseiten anpassen: `SITE_CONFIG.thankYouDe` und `SITE_CONFIG.thankYouEn` in `assets/js/main.js`.

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
cd ~/Projekte/florianmachnow-de
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
| Keine Umsatzsteuer-Angabe im Impressum | Kein Hinweis auf Kleinunternehmerstatus, wirkt souveräner | Muss ergänzt werden, sobald eine USt-IdNr. vorliegt |
| Keine Telefonnummer im Impressum | Du steuerst, wer wann durchkommt | Manche Einkaufsabteilungen erwarten eine Nummer |

---

## 9. Offene Punkte

Diese Liste wird bei jeder Änderung aktualisiert.

### Blockierend vor dem Livegang
- [ ] **Auftragsverarbeitungsverträge abschließen** mit Netlify, Cal.com, Google, Microsoft und STRATO. Alle stellen sie im jeweiligen Konto bereit. Die Datenschutzerklärung setzt voraus, dass sie bestehen.

### Eingesetzte Dienstleister (Stand der Datenschutzerklärung)

| Zweck | Anbieter | Sitz | Drittlandtransfer |
|---|---|---|---|
| Hosting der Website | Netlify, Inc. | USA | ja, SCC und DPF |
| Terminbuchung | Cal.com, Inc. | USA | ja, SCC |
| Kalender | Google Ireland Limited | Irland | möglich, SCC und DPF |
| Kalender | Microsoft Ireland Operations Limited | Irland | möglich, SCC und DPF |
| E-Mail-Postfach | STRATO AG | Deutschland | nein |

### Erledigt
- [x] **Domain** auf `florianmachnow.de` umgestellt, inklusive E-Mail-Adresse, Canonical-Tags, OG-Bild und Manifest
- [x] **E-Mail-Postfach** `kontakt@florianmachnow.de` eingerichtet
- [x] **Cal.com-Link** eingetragen: `florian-machnow-cmykql/30min`
- [x] **Danke-Seite ohne Bezahltarif gelöst.** Weiterleitung läuft über das `bookingSuccessful`-Ereignis des Embeds, siehe Abschnitt 4.
- [x] **Dienstleister vollständig benannt.** Beide Datenschutzerklärungen trennen jetzt Kalender (Google und Microsoft Outlook) und E-Mail (STRATO AG, Server in Deutschland, kein Drittlandtransfer), plus ein Absatz zur Weiterleitung nach der Buchung.
- [x] **Umsatzsteuer-Abschnitt aus dem Impressum entfernt.** § 5 DDG verlangt die USt-IdNr. nur, wenn eine vorhanden ist. Ohne USt-IdNr. muss zur Umsatzsteuer nichts gesagt werden, und der Hinweis auf § 19 UStG entfällt. Der Kleinunternehmerhinweis gehört ohnehin auf die Rechnung, nicht ins Impressum.
- [x] **Impressum ohne Telefonnummer**, nur E-Mail. Zulässig, solange eine schnelle elektronische Kontaktaufnahme möglich ist.
- [x] **Portraitfoto** eingesetzt: Business-Porträt vor Glasfassade aus dem Projektwissen, auf 4:5 zugeschnitten, 1200 × 1500 px. Für ein anderes Motiv einfach `assets/img/florian-machnow.jpg` überschreiben, gleiches Seitenverhältnis.
- [x] **Claim „über 100 Mio. Impressions“ geschärft.** Deckt bestätigt Paid und Organic ab, allein über TV, Connected TV und YouTube. Die Beleg-Karte nennt den Kanalmix jetzt explizit, damit die Zahl im Gespräch nicht kleiner wirkt, als sie ist.
- [x] **Vertraulichkeit statt Beweislast.** Da die −85 % belegbar, aber nicht veröffentlichbar sind, verspricht die Seite keine Offenlegung mehr, sondern die Herleitung. Formulierung auf der Startseite und in der FAQ entsprechend angepasst.

### Fachlich zu prüfen
- [ ] **Herleitung der −85 % für das Erstgespräch vorbereiten.** Ohne Kundendaten, aber mit nachvollziehbarem Rechenweg: Kosten je Asset vorher, Kosten je Asset nachher, Mengengerüst. Das wird die erste Rückfrage sein.
- [ ] **Umsatzsteuer.** Sobald du zur Regelbesteuerung wechselst, gehört die USt-IdNr. wieder ins Impressum. Vorlage: `<h2>Umsatzsteuer-Identifikationsnummer</h2>` mit dem Hinweis auf § 27 a UStG, einzufügen in `impressum.html` und `en/legal-notice.html` direkt nach „Kontakt“.
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
| 2026-07-27 | Vollstaendige Pfade in die Deploy-Anleitung aufgenommen, Umzugsschritt nach ~/Projekte ergaenzt, Abschnitte 3.1 bis 3.5 neu nummeriert |
| 2026-07-27 | Deploy-Anleitung auf STRATO-DNS umgeschrieben inkl. Warnung zu den MX-Einträgen, Netlify-Drop-Variante und ZIP-Paket ergänzt |
| 2026-07-27 | STRATO AG als E-Mail-Anbieter in beiden Datenschutzerklärungen ergänzt, Abschnitt in Kalender und E-Mail getrennt, Dienstleister-Übersicht ins README aufgenommen |
| 2026-07-27 | Danke-Seite über `bookingSuccessful`-Ereignis angebunden (kein Cal.com-Bezahltarif nötig), Outlook in beiden Datenschutzerklärungen ergänzt, Umsatzsteuer-Abschnitt aus dem Impressum entfernt, Reichweiten-Claim auf Paid und Organic geschärft, Referenz-Formulierungen auf Vertraulichkeit umgestellt |
| 2026-07-27 | Domain von `florianmachnow.ai` auf `florianmachnow.de` umgestellt, E-Mail auf `kontakt@florianmachnow.de`, echter Cal.com-Link eingetragen, Porträtfoto eingesetzt, OG-Bild mit Porträt neu erzeugt, Projektordner umbenannt |
| 2026-07-27 | Erstversion: Onepager DE und EN, Rechtsseiten, Cal.com-Consent-Gate, Icons, Deploy-Konfiguration, Suchmaschinen-Ausschluss |
