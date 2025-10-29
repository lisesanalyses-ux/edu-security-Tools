#!/usr/bin/env python3
"""
File Organizer - Non-AI File Classification Tool

Tento nástroj organizuje súbory na základe ich prípony bez použitia AI modelov.
Používa jednoduché pravidlá pre klasifikáciu a organizáciu súborov do kategórií.

Použitie:
    python main.py <adresár> [--dry-run] [--verbose]

Argumenty:
    adresár     - vstupný adresár na organizáciu
    --dry-run   - len zobrazenie návrhov bez skutočného presunu súborov
    --verbose   - podrobné výpisy
"""

import argparse
import calendar
import os
import shutil
from datetime import datetime
from pathlib import Path
from typing import List

class FileInfo:
    def __init__(self, path: Path):
        self.path = path
        self.size = path.stat().st_size
        self.extension = path.suffix.lower()
        self.mtime = path.stat().st_mtime
        self.category = None
        self.proposed_path = None

class FileClassifier:
    # Definície kategórií na základe prípon
    CATEGORIES = {
        "Dokumenty": [".pdf", ".docx", ".xlsx", ".doc", ".xls", ".txt", ".rtf", ".pptx", ".ppt"],
        "Obrázky": [".jpg", ".png", ".gif", ".jpeg", ".bmp", ".tiff", ".webp", ".svg", ".ico"],
        "Video_a_Audio": [".mp4", ".avi", ".mkv", ".mov", ".wmv", ".mp3", ".wav", ".flac", ".aac", ".ogg"],
        "Archivy_a_Instalatorky": [".zip", ".rar", ".7z", ".tar", ".gz", ".exe", ".msi", ".dmg", ".iso"],
        "Nežiadúce_súbory": [".tmp", ".bak", ".log", ".cache", ".temp"],  # súbory na ignorovanie
        "Neznámy_Ke_kontrole": []  # všetko ostatné
    }

    @staticmethod
    def classify_file(file_info: FileInfo) -> str:
        """Rozhodne kategóriu súboru na základe prípony."""
        ext = file_info.extension.lower()

        # Skontroluj, či je prípona v nežiadúcich súboroch
        if ext in FileClassifier.CATEGORIES["Nežiadúce_súbory"]:
            return "Nežiadúce_súbory"

        for category, extensions in FileClassifier.CATEGORIES.items():
            if ext in extensions:
                return category

        return "Neznámy_Ke_kontrole"

    @staticmethod
    def generate_subfolder_name(category: str, mtime: float) -> str:
        """Vygeneruje podadresár na základe času modifikácie."""
        dt = datetime.fromtimestamp(mtime)
        year = dt.year
        month_name = calendar.month_name[dt.month]
        return f"{category}/{year}/{month_name}"

class FileOrganizer:
    def __init__(self, dry_run: bool = False, verbose: bool = False):
        self.dry_run = dry_run
        self.verbose = verbose
        self.classifier = FileClassifier()
        self.files_processed = 0
        self.files_moved = 0

    def scan_directory(self, directory: Path) -> List[FileInfo]:
        """Skenuje adresár a získava informácie o súboroch."""
        file_infos = []

        if self.verbose:
            print(f"Prehľadávanie adresára: {directory}")

        for root, dirs, files in os.walk(directory):
            for file in files:
                file_path = Path(root) / file

                # Preskočí veľmi malé súbory alebo adresáre (napríklad .git)
                if file_path.name.startswith('.') and not file_path.suffix:
                    continue

                try:
                    file_info = FileInfo(file_path)
                    file_infos.append(file_info)
                    self.files_processed += 1

                    if self.verbose:
                        print(f"Nájdený súbor: {file_path}")

                except (OSError, PermissionError):
                    print(f"Chyba pri čítaní súboru: {file_path}")

        if self.verbose:
            print(f"Celkom nájdených súborov: {len(file_infos)}")

        return file_infos

    def organize_files(self, input_directory: Path, output_directory: Path):
        """Hlavná funkcia na organizáciu súborov."""
        if not input_directory.exists() or not input_directory.is_dir():
            print(f"Chyba: Vstupný adresár '{input_directory}' neexistuje alebo nie je adresár.")
            return

        # Ak nie je určený výstupný adresár, použije podadresár v vstupnom
        if not output_directory:
            output_directory = input_directory / "Organizované"

        if self.dry_run:
            print("=== DRY RUN - len simulácia ===")
        else:
            print(f"Organizujem súbory z '{input_directory}' do '{output_directory}'")

        # Skenovanie súborov
        file_infos = self.scan_directory(input_directory)

        # Procesovanie každý súbor
        for file_info in file_infos:
            # Vynechať súbory, ktoré sú v výstupnom adresári
            try:
                file_info.path.relative_to(output_directory)
                continue
            except ValueError:
                pass

            # Klasifikácia
            category = self.classifier.classify_file(file_info)

            # Ak je to nežiadúci súbor, preskočí sa
            if category == "Nežiadúce_súbory":
                if self.verbose:
                    print(f"Preskakovanie nežiadúceho súboru: {file_info.path}")
                continue

            # Generovanie podadresára
            subfolder = self.classifier.generate_subfolder_name(category, file_info.mtime)

            # Plná navrhovaná cesta
            proposed_path = output_directory / subfolder / file_info.path.name

            # Aktualizácia FileInfo
            file_info.category = category
            file_info.proposed_path = proposed_path

            # Presun súboru
            self._move_file(file_info)

        # Zhrnutie
        print(f"\n=== Hotovo ===")
        print(f"Spracovaných súborov: {self.files_processed}")
        print(f"Presunutých súborov: {self.files_moved}")

    def _move_file(self, file_info: FileInfo):
        """Presunie súbor na nové miesto."""
        src = file_info.path
        dst = file_info.proposed_path

        if self.dry_run:
            print(f"[DRY] {src} -> {dst}")
            return

        try:
            # Vytvor adresár ak neexistuje
            dst.parent.mkdir(parents=True, exist_ok=True)

            # Presun súboru
            shutil.move(str(src), str(dst))
            self.files_moved += 1

            if self.verbose:
                print(f"Presunutý: {src} -> {dst}")

        except Exception as e:
            print(f"Chyba pri presúvaní súboru {src}: {e}")

def main():
    parser = argparse.ArgumentParser(
        description="Nástroj na organizáciu súborov bez použitia AI modelov",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("directory", help="Vstupný adresár na organizáciu")
    parser.add_argument("--output", "-o", help="Výstupný adresár (štandardne podadresár 'Organizované')")
    parser.add_argument("--dry-run", action="store_true", help="Len simulácia bez skutočného presunu")
    parser.add_argument("--verbose", "-v", action="store_true", help="Podrobné výpisy")

    args = parser.parse_args()

    input_dir = Path(args.directory)
    output_dir = Path(args.output) if args.output else None

    organizer = FileOrganizer(dry_run=args.dry_run, verbose=args.verbose)
    organizer.organize_files(input_dir, output_dir)

if __name__ == "__main__":
    main()
