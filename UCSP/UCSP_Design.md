# Unified Cyber Security Platform (UCSP) - Návrh Frameworku

## 1. Architektura Frameworku (UCSP)

UCSP je navržen jako třívrstvý framework, který zajišťuje integraci nástrojů KSP (Kyberstráž Procesů) a WSA (Windows Security Auditor). Architektura podporuje sběr dat, jejich korelaci a jednotnou vizualizaci pro efektivní kybernetickou bezpečnost.

### Vrstva 1: Zdroje dat (Agenty)
Tato vrstva zahrnuje agenty nasazené na koncových bodech, které sbírají data z KSP a WSA. Agenty používají standardizované protokoly pro přenos dat do backendu.

| Komponenta | Technologie/Protokol | Popis |
|------------|----------------------|-------|
| KSP Agent | Sysmon (Windows Event Logs), ETW (Event Tracing for Windows) | Sbírá události procesů, síťové aktivity a anomálie v reálném čase. Data se odesílají přes HTTPS/REST API nebo Message Queue (např. RabbitMQ) do backendu. |
| WSA Agent | PowerShell skripty, WMI (Windows Management Instrumentation), WinRM | Provádí audity konfigurace (např. Group Policy, Registry). Data se odesílají přes HTTPS/REST API nebo zabezpečený kanál (TLS 1.3). |
| Společné | JSON formát pro standardizaci dat, s metadaty (časové razítko, endpoint ID). | Zajišťuje kompatibilitu mezi agenty; používá heartbeat pro monitorování stavu agentů. |

### Vrstva 2: Korelace a Analýza (Backend)
Backend zpracovává a korelují data z obou nástrojů. Používá databázi pro ukládání a analytické procesy pro detekci hrozeb.

| Komponenta | Technologie | Popis |
|------------|-------------|-------|
| Databáze | Elasticsearch nebo PostgreSQL s TimescaleDB | Ukládá strukturovaná data z KSP (procesní události) a WSA (konfigurační výsledky). Podporuje full-text vyhledávání a časové řady pro historickou analýzu. |
| Korelační Procesy | SIEM logika (např. ELK Stack s pravidly), Machine Learning (MLflow pro modely) | Koreluje události: Např. anomálie z KSP (vysoké skóre procesu) s riziky z WSA (slabá konfigurace). Používá pravidla jako "IF WSA detekuje slabé heslo AND KSP detekuje neobvyklý login THEN zvýšit prioritu incidentu". |
| Analytické Moduly | Python s knihovnami (Scikit-learn, Pandas) | Provádí globální trénink modelů na datech z více endpointů; detekuje zero-day malware pomocí unsupervised learning (např. Isolation Forest). |

### Vrstva 3: Vizualizace (Dashboard)
Dashboard poskytuje jednotné uživatelské rozhraní pro vizualizaci dat z KSP a WSA.

| Komponenta | Technologie | Popis |
|------------|-------------|-------|
| UI Framework | React.js s D3.js nebo Grafana | Sjednocuje data do interaktivních dashboardů: Mapa endpointů, časové grafy incidentů, detailní pohledy na rizika. |
| API Gateway | RESTful API (Express.js) nebo GraphQL | Zajišťuje přístup k datům z backendu; podporuje real-time aktualizace přes WebSockets. |
| Bezpečnost UI | OAuth 2.0, RBAC (Role-Based Access Control) | Omezení přístupu na základě rolí (admin, analyst); šifrování dat v přenosu. |

## 2. Specifikace Nástroje KSP (Endpoint Detection & Response)

KSP se integruje do UCSP jako agent pro monitorování koncových bodů, odesílající data do backendu pro korelaci.

### Datové body
KSP odesílá klíčové události do backendu ve formátu JSON.

| Datový bod | Popis | Příklad |
|------------|-------|---------|
| Hash procesu | SHA-256 hash spustitelného souboru. | "hash": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3" |
| PID/PPID | ID procesu a rodičovského procesu. | "pid": 1234, "ppid": 567 |
| Skóre anomálie | Číselné skóre (0-100) založené na behaviorálních modelech. | "anomaly_score": 85 |
| Metadata | Čas, endpoint ID, typ události (např. "process_start"). | "timestamp": "2023-10-01T12:00:00Z", "endpoint_id": "WS001" |

### Behaviorální Modely
Backend UCSP využívá data z KSP pro globální trénink ML modelů.

| Aspekt | Popis |
|--------|-------|
| Trénink | Modely se trénují na agregovaných datech z více endpointů (např. clustering pro detekci zero-day malware). Používá federované učení pro zachování soukromí. |
| Detekce | Modely identifikují anomálie napříč sítí; např. neobvyklý proces na jednom endpointu se porovná s baseline z ostatních. |
| Aktualizace | Modely se přetrénovávají denně na základě nových dat; používá A/B testing pro validaci. |

### Zpětná vazba
Systém se učí z uživatelských potvrzení pro zlepšení přesnosti.

| Aspekt | Popis |
|--------|-------|
| Označení | Uživatel označí událost jako "Legitimní" nebo "Útok" v dashboardu. |
| Učení | Backend aktualizuje modely (např. supervised learning) a šíří aktualizace na všechny KSP agenty přes push notifikace. |
| Šíření | Změny se aplikují globálně; např. nový whitelist pro legitimní procesy se synchronizuje přes backend. |

## 3. Specifikace Nástroje WSA (Configuration Audit & Remediation)

WSA se integruje jako agent pro audit konfigurace, odesílající data pro rizikové hodnocení.

### Datové body
WSA odesílá výsledky auditů do backendu.

| Datový bod | Popis | Příklad |
|------------|-------|---------|
| Výsledek heslové politiky | Stav kontroly (pass/fail) s detaily. | "password_policy": {"complexity": "fail", "length": "pass"} |
| Stav UAC | Úroveň User Account Control. | "uac_level": "disabled" |
| Riziko konfigurace | Skóre (0-100) pro celkovou konfiguraci. | "config_risk_score": 70 |
| Metadata | Endpoint ID, čas auditu. | "endpoint_id": "WS001", "audit_time": "2023-10-01T12:00:00Z" |

### Risk Scoring
UCSP vypočítá celkové riziko endpointu kombinací skóre z KSP a WSA.

| Aspekt | Popis |
|--------|-------|
| Vzorec | Celkové riziko = (KSP_skóre * 0.6) + (WSA_skóre * 0.4) + Korelační bonus (např. +10 pokud oba vysoké). |
| Kategorizace | Nízké (0-30), Střední (31-70), Vysoké (71-100). |
| Aktualizace | Skóre se přepočítává real-time při nových datech; dashboard zobrazuje trendy. |

### Vizualizace oprava
UI prezentuje akce pro rychlou nápravu.

| Aspekt | Popis |
|--------|-------|
| "Opravit jedním kliknutím" | Tlačítko v dashboardu spustí skript na endpointu (např. PowerShell pro změnu politiky). |
| Oprávnění | Používá WinRM s kerberos autentizací; admin role potřebná pro vzdálený přístup. |
| Potvrzení | UI zobrazuje progress a výsledky; rollback možnost při selhání. |

## 4. Korelace a Jednotná Vizualizace

Klíčový prvek vizualizace je "Mapa Rizik Endpointů", která spojuje data z KSP a WSA do interaktivní mapy.

### Korelační scénář
Příklad spojení událostí do kritického incidentu.

| Krok | Popis |
|------|-------|
| Detekce WSA | WSA detekuje slabou heslovou politiku (skóre 80). |
| Detekce KSP | KSP detekuje neobvyklou aktivitu procesu (skóre anomálie 90, PID 1234). |
| Korelace | Backend spojí události: "Slabá konfigurace umožnila potenciální kompromitaci účtu". Vytvoří incident s ID, prioritou "Vysoká". |
| Vizualizace | Na mapě endpointů: Červený bod pro endpoint, tooltip s detaily ("Podezření na kompromitaci účtu kvůli slabé konfiguraci"). Uživatel může kliknout pro detailní pohled (grafy, akce nápravy). |
