import calendar
from pathlib import Path
from datetime import datetime
from .models.file_info import FileInfo

class FileClassifier:
    # Definice rodin (parent folders)
    CATEGORIES = {
        "Dokumenty": [".pdf", ".docx", ".xlsx", ".doc", ".xls", ".txt", ".rtf"],
        "Obrázky": [".jpg", ".png", ".gif", ".jpeg", ".bmp", ".tiff", ".webp"],
        "Video a Audio": [".mp4", ".avi", ".mkv", ".mov", ".wmv", ".mp3", ".wav", ".flac", ".aac", ".ogg"],
        "Archivy a Instalátory": [".zip", ".rar", ".7z", ".tar", ".gz", ".exe", ".msi", ".dmg"],
        "Neznámý/Ke kontrole": []  # vše ostatní
    }

    @staticmethod
    def classify_file(file_info: FileInfo) -> str:
        """Rozhodne kategorii souboru na základě přípony."""
        ext = file_info.extension.lower()
        for category, extensions in FileClassifier.CATEGORIES.items():
            if ext in extensions:
                return category
        return "Neznámý/Ke kontrole"

    @staticmethod
    def generate_subfolder_name(category: str, mtime: float) -> str:
        """Vygeneruje podřízenou složku na základě času modifikace."""
        dt = datetime.fromtimestamp(mtime)
        year = dt.year
        month_name = calendar.month_name[dt.month]
        return f"{category}/{year}/{month_name}"

    @classmethod
    def process_file(cls, file_info: FileInfo, base_output_dir: Path):
        """Zpracuje soubor: klasifikuje a navrhne cestu."""
        category = cls.classify_file(file_info)

        # Generování podřízené složky
        subfolder = cls.generate_subfolder_name(category, file_info.mtime)

        # Plná navrhovaná cesta
        proposed_path = base_output_dir / subfolder / file_info.path.name

        # Aktualizace FileInfo
        file_info.category = category
        file_info.proposed_path = proposed_path

        return file_info
