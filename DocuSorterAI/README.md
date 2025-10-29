# DocuSorter AI

DocuSorter AI je open-source nástroj pro automatické třídění dokumentů pomocí strojového učení. Nástroj analyzuje obsah dokumentů (PDF, DOCX) a navrhuje jejich přesun do příslušných složek na základě obsahu.

## Funkce

- **Automatická klasifikace**: Analýza textu dokumentů pomocí NLP a ML modelů
- **Podpora formátů**: PDF a DOCX dokumenty
- **Webové rozhraní**: Jednoduché UI pro upload a správu dokumentů
- **Ruční úpravy**: Možnost manuální úpravy navrhovaných kategorií
- **Bezpečnost**: Kontroly oprávnění a zálohování před přesunem

## Požadavky

- Python 3.8+
- Windows/Linux/MacOS

## Instalace

1. Naklonujte repozitář:
```bash
git clone https://github.com/yourusername/docusorter-ai.git
cd docusorter-ai
```

2. Nainstalujte závislosti:
```bash
pip install -r requirements.txt
```

3. Stáhněte český model SpaCy:
```bash
python -m spacy download cs_core_news_sm
```

## Spuštění

1. Spusťte aplikaci:
```bash
python app.py
```

2. Otevřete prohlížeč na `http://localhost:5000`

## Použití

1. **Upload dokumentů**: Vyberte složku s dokumenty k třídění
2. **Klasifikace**: Nástroj analyzuje obsah a navrhne kategorie
3. **Kontrola**: Zkontrolujte navrhované kategorie a upravte je případně
4. **Přesun**: Potvrďte přesun dokumentů do nových složek

## Architektura

- **Backend**: Flask API s ML modely
- **NLP**: SpaCy pro zpracování českého textu
- **ML**: Scikit-learn s TF-IDF a SVC klasifikátorem
- **Frontend**: Bootstrap UI s AJAX

## Licenze

MIT License - volně šiřitelný open-source projekt.

## Příspěvky

Vítejte příspěvky! Prosím vytvořte issue nebo pull request.
