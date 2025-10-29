# Implementační Plán File Cleaner & Organizer (FCO)

## 1. Architektura a Technologie

### Platforma a Jazyk
Nástroj bude implementován jako desktopová aplikace v Pythonu 3.8+. Python je vhodnou volbou díky své přenositelnosti, bohaté standardní knihovně pro správu souborů a podpory různých platforem (Windows, macOS, Linux).

### GUI Framework
Zvolený framework: **PyQt6** (nebo PyQt5 jako alternativa).

**Zdůvodnění:**
- **Cross-platformní funkčnost**: PyQt podporuje Windows, macOS a Linux nativně, což zajišťuje konzistentní UX napříč platformami.
- **Jednoduchost a výkon**: PyQt má intuitivní API pro vytváření tabulek, dialogů, tlačítek a vlastních widgetů nezbytných pro nástroj (např. tabulka navrhovaných přesunů, strom složek). Navzdory mírně vyšší složitosti instalace (vyžaduje pip install PyQt6) je vhodnější než Tkinter pro profesionální desktopové aplikace s pokročilým UI (Tkinter je jednodušší, ale méně flexibilní pro složité rozložení a stylování). Kivy je orientován spíše na mobilní a herní aplikace, takže není vhodný pro desktopový nástroj s mnoha formuláři a tabulkami.
- Alternativa: Tkinter pro minimální závislosti, pokud PyQt nepůjde nainstalovat, ale PyQt je doporučen pro požadovaný rozsah funkcí.

### Správa souborů a OS interakce
- **Knihovny**: `os` pro navigaci adresáři, čtení metadat a základní operace; `shutil` pro bezpečné přesuny souborů (atomické operace, zachování atributů).
- **Bezpečnost**: Všechny operace budou podporovat transakční přístup (rollback při chybě).

### Hashování a Duplicity
- **Knihovna**: `hashlib` s SHA-256 algoritmem.
- **Důvod**: SHA-256 poskytuje vysokou spolehlivost pro detekci duplicit (nízká pravděpodobnost kolize), je součástí standardní knihovny a je výpočetně efektivní pro soubory typické velikosti.

## 2. Implementační Fáze a Moduly

Implementace bude rozdělena do čtyř modulů s jasným oddělením zodpovědností (architektura MVC: UI pro prezentační vrstvu, Logic pro obchodní logiku). Každý modul bude samostatný Python modul (.py soubor) pro lepší testovatelnost a údržbu. Integrace přes event-driven systém v GUI.

### A. Modul Sběru Dat a Výběru cíle (UI/DataCollector.py)
**Funkce**: Poskytuje uživatelské rozhraní pro výběr vstupní složky/disku. Zahrnuje file dialog pro procházení adresářů.

**Technický požadavek**:
- Rekurzivní skenování adresáře pomocí `os.walk()` pro efektivní průchod stromu složek.
- Načtení metadat pro každý soubor: `os.path.getsize()` (velikost), `os.path.splitext()` (přípona), `os.path.abspath()` (absolutní cesta), `os.path.getmtime()` (čas modifikace).
- Zpracování výjimek (např. PermissionError pro chráněné složky) s progress barem v GUI pro dlouhé operace.
- Výstup: List objektů `FileInfo` (datová třída s atributy: path, size, extension, mtime).

**Rozhraní**: QtWidgets.QFileDialog pro výběr složky.

### B. Modul Klasifikace a Kategorizace (Core/Classifier.py)
**Rodiny (Parent Folders)**: Definovány jako enum nebo slovník s pravidly.
- **Dokumenty**: `.pdf, .docx, .xlsx` (rozšířitelný seznam).
- **Obrázky**: `.jpg, .png, .gif`.
- **Video a Audio**: `.mp4, .avi, .mp3, .wav`.
- **Archivy a Instalátory**: `.zip, .rar, .exe, .msi`.
- **Neznámý/Ke kontrole**: Vše ostatní nebo soubory bez přípony.

**Pravidla**: Implementována jako funkce `classify_file(file_info)` s if/elif strukturou:
- Kontrola přípony (case-insensitive).
- Dodatečná logika: Pokud velikost > 100MB, preferuj archiv/Video (volitelná heuristika).
- **Požadavek na velikost** ignoruji jako primární pravidlo (hlavní je přípona), ale možno přidat jako sekundární kritérium.

**Podřazené složky**: Automatické generování názvu na základě času modifikace (`datetime.fromtimestamp(file_info.mtime)`):
- Formát: `{Rodina}/{Rok}/{Měsíc}` (např. `Obrázky/2025/Leden`).
- Funkce `generate_subfolder_name(parent, mtime)` pomocí `calendar.month_name`.
- Zajišťuje organizaci bez zbytečného členění (jedna úroveň na typ, měsíc stačí pro časovou organizaci).

**Výstup**: Aktualizuje `file_info` o `proposed_path` a `category`.

### C. Modul Detekce Duplicit (Core/DuplicateDetector.py)
**Dvoufázový algoritmus**:
1. **Skupování podle velikosti**: Vytvoření dictionary `size_groups = defaultdict(list)`; klíč velikost, hodnota list FileInfo. Rychlé a paměťově efektivní pro prvotní filtr.
2. **Hashování**: Pro skupiny s >1 souborem, výpočet SHA-256 pomocí `hashlib.sha256(file.read())`. Skupení podle hashe: `hash_groups = defaultdict(list)`.

**Výstup**:
- Seznam duplicit: List skupin (List[List[FileInfo]]) seřazených podle hashe.
- Optimalizace: Streamování pro velké soubory (čtení po blocích) a cache hashů pro opětovné použití.

**Rozšíření**: Podpora metadata-only hash (bez obsahu) pro rychlejší předběžnou kontrolu, ale ne přesná.

### D. Modul Vizualizace a Akce (GUI/MainWindow.py)
**Vizualizace**:
- **Navrhované přesuny**: QtWidgets.QTableWidget (table s sloupci: Současná cesta | Navrhovaná cesta | Kategorie). Uživatel může editovat navrhovanou cestu (in-place editing) nebo skrýt řádek.
- **Duplicit**: Samostatný tab/zobrazení s QTreeWidget (skupiny jako rodiče, duplikáty jako děti). Pro každou skupinu: Checkbox "Zachovat tuto kopii" (výchozí první podle času), tlačítko "Smazat ostatní" (s potvrzením dialogem).
- Alternativa: QTableView s modelem pro lepší výkon u velkých seznamů.

**Akce na kliknutí**:
// - **Vytvoření rodičovských složek**: Volání `os.makedirs(proposed_path.parent, exist_ok=True)` před přesuny.
// - **Atomický přesun**: `shutil.move(src, dst)` pro schválené soubory. Implementace batch přesunů s progress barem a možností zpětného chodu (restore současné cesty).
- Zabezpečení: Potvrzení dialog před akcí, logování všech operací do souboru.

**Technické detaily**: MVC přístup – GUI volá metody z core modulů, výsledky zobrazuje přes signály/slots v PyQt.

## 3. Závěr a Kontrola

Tento návrh zajišťuje splnění požadavku na přesun souborů do kategorií dle "rodiny" (typ souboru) a podřízených složek (čas), čímž systematicky organizuje disk a odstraňuje duplikáty pro úklid místa. Bezpečnost dat je zajištěna atomickými operacemi (`shutil.move` dovoluje zpětný chod při chybě), explicitním schválením uživatele před každou akcí (např. smazání duplicit pouze po výběru "zachovat kopii"), transakčním přístupem (všechny přesuny v batch s rollback při selhání) a logováním všech změn. Nástroj neprovádí automatické mazání bez potvrzení, čímž minimalizuje riziko ztráty dat. Implementace podporuje škálovatelnost pro velké disky (rekurzivní skenování, progress indikátory) a rozšiřitelnost (přidání nových kategorií bez změny jádra).
