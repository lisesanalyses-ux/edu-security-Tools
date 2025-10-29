#!/usr/bin/env python3
"""
Tkinter GUI pro File Classification Organizer (FCO)
Samostatný přenosný nástroj pro organizaci souborů pomocí Tkinter

Tento nástroj poskytuje grafické rozhraní pro organizaci souborů
podle kategorií a data modification bez použití AI.
"""

import tkinter as tk
from tkinter import filedialog, messagebox, ttk, scrolledtext
from pathlib import Path
import threading
import calendar
from datetime import datetime

class FileInfo:
    def __init__(self, path: Path):
        self.path = path
        self.size = path.stat().st_size
        self.extension = path.suffix.lower()
        self.mtime = path.stat().st_mtime
        self.category = None
        self.proposed_path = None

class FileClassifier:
    CATEGORIES = {
        "Dokumenty": [".pdf", ".docx", ".xlsx", ".doc", ".xls", ".txt", ".rtf"],
        "Obrázky": [".jpg", ".png", ".gif", ".jpeg", ".bmp", ".tiff", ".webp"],
        "Video a Audio": [".mp4", ".avi", ".mkv", ".mov", ".wmv", ".mp3", ".wav", ".flac", ".aac", ".ogg"],
        "Archivy a Instalátory": [".zip", ".rar", ".7z", ".tar", ".gz", ".exe", ".msi", ".dmg"],
        "Neznámý/Ke kontrole": []
    }

    @staticmethod
    def classify_file(file_info: FileInfo) -> str:
        ext = file_info.extension.lower()
        for category, extensions in FileClassifier.CATEGORIES.items():
            if ext in extensions:
                return category
        return "Neznámý/Ke kontrole"

    @staticmethod
    def generate_subfolder_name(category: str, mtime: float) -> str:
        dt = datetime.fromtimestamp(mtime)
        year = dt.year
        month_name = calendar.month_name[dt.month]
        return f"{category}/{year}/{month_name}"

class FCOGui:
    def __init__(self, root):
        self.root = root
        self.root.title("File Classification Organizer (FCO)")
        self.root.geometry("1000x700")

        # Proměnné
        self.input_dir = tk.StringVar()
        self.output_dir = tk.StringVar()
        self.classifier = FileClassifier()
        self.file_infos = []

        self.setup_ui()

    def setup_ui(self):
        # Hlavní frame
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.pack(fill=tk.BOTH, expand=True)

        # Titulek
        title_label = ttk.Label(main_frame, text="File Classification Organizer",
                               font=("Arial", 16, "bold"))
        title_label.pack(pady=(0, 10))

        # Popis
        desc_text = "Samostatný přenosný nástroj pro organizaci souborů\nOrganizuje soubory do kategorií podle přípony a data."
        desc_label = ttk.Label(main_frame, text=desc_text, justify=tk.CENTER)
        desc_label.pack(pady=(0, 20))

        # Výběr adresářů
        dir_frame = ttk.LabelFrame(main_frame, text="Výběr adresářů", padding="10")
        dir_frame.pack(fill=tk.X, pady=(0, 10))

        # Vstupní adresář
        input_frame = ttk.Frame(dir_frame)
        input_frame.pack(fill=tk.X, pady=(0, 10))
        ttk.Label(input_frame, text="Vstupní adresář:").pack(side=tk.LEFT)
        ttk.Entry(input_frame, textvariable=self.input_dir, width=50).pack(side=tk.LEFT, padx=(10,5))
        ttk.Button(input_frame, text="Vybrat", command=self.select_input_dir).pack(side=tk.LEFT)

        # Výstupní adresář
        output_frame = ttk.Frame(dir_frame)
        output_frame.pack(fill=tk.X)
        ttk.Label(output_frame, text="Výstupní adresář:").pack(side=tk.LEFT)
        ttk.Entry(output_frame, textvariable=self.output_dir, width=50).pack(side=tk.LEFT, padx=(10,5))
        ttk.Button(output_frame, text="Vybrat", command=self.select_output_dir).pack(side=tk.LEFT)

        # Tlačítka akce
        btn_frame = ttk.Frame(main_frame)
        btn_frame.pack(fill=tk.X, pady=10)

        self.scan_btn = ttk.Button(btn_frame, text="Skenovat soubory",
                                  command=self.scan_files)
        self.scan_btn.pack(side=tk.LEFT, padx=(0,10))

        self.organize_btn = ttk.Button(btn_frame, text="Organizovat soubory",
                                      command=self.organize_files)
        self.organize_btn.pack(side=tk.LEFT)
        self.organize_btn.state(['disabled'])

        # Progress bar
        self.progress = ttk.Progressbar(main_frame, orient=tk.HORIZONTAL, mode='determinate')
        self.progress.pack(fill=tk.X, pady=(10,0))

        # Stavová zpráva
        self.status_label = ttk.Label(main_frame, text="")
        self.status_label.pack(pady=(5,0))

        # Textové pole pro výsledky
        result_frame = ttk.LabelFrame(main_frame, text="Navrhované přesuny", padding="10")
        result_frame.pack(fill=tk.BOTH, expand=True, pady=(10,0))

        self.result_text = scrolledtext.ScrolledText(result_frame, height=15)
        self.result_text.pack(fill=tk.BOTH, expand=True)

    def select_input_dir(self):
        directory = filedialog.askdirectory(title="Vyberte vstupní adresář")
        if directory:
            self.input_dir.set(directory)

    def select_output_dir(self):
        directory = filedialog.askdirectory(title="Vyberte výstupní adresář")
        if directory:
            self.output_dir.set(directory)

    def scan_files(self):
        if not self.input_dir.get():
            messagebox.showerror("Chyba", "Vyberte vstupní adresář!")
            return

        self.scan_btn.state(['disabled'])
        self.progress['value'] = 0
        self.status_label.config(text="Skenování souborů...")
        self.result_text.delete(1.0, tk.END)

        # Spustí skenování v samostaném vlákně
        thread = threading.Thread(target=self._scan_files_thread)
        thread.start()

    def _scan_files_thread(self):
        try:
            input_path = Path(self.input_dir.get())
            self.file_infos = []

            all_files = []
            for root, dirs, files in input_path.walk():
                for file in files:
                    all_files.append(Path(root) / file)

            total = len(all_files)
            self.progress['maximum'] = total

            for i, file_path in enumerate(all_files):
                try:
                    file_info = FileInfo(file_path)
                    category = self.classifier.classify_file(file_info)
                    subfolder = self.classifier.generate_subfolder_name(category, file_info.mtime)

                    if self.output_dir.get():
                        output_path = Path(self.output_dir.get())
                    else:
                        output_path = input_path / "Organizované"

                    proposed_path = output_path / subfolder / file_info.path.name

                    file_info.category = category
                    file_info.proposed_path = proposed_path

                    self.file_infos.append(file_info)

                    # Aktualizuj UI
                    self.root.after(0, lambda fi=file_info: self._add_file_to_results(fi))
                    self.progress['value'] = i + 1

                except Exception as e:
                    print(f"Chyba při zpracování souboru {file_path}: {e}")

            self.root.after(0, self._scan_complete)

        except Exception as e:
            self.root.after(0, lambda: self._scan_error(str(e)))

    def _add_file_to_results(self, file_info):
        # Formátování cesty pro zobrazení
        relative_current = file_info.path.relative_to(Path(self.input_dir.get()).parent / file_info.path.parts[-2])
        proposed_dir = str(file_info.proposed_path.parent)
        proposed_name = file_info.proposed_path.name

        result = f"{file_info.category} -> {proposed_dir}\\{proposed_name}\n"
        result += f"  Současná cesta: {file_info.path}\n"
        result += f"  Velikost: {file_info.size} bytes, Datum: {datetime.fromtimestamp(file_info.mtime).strftime('%Y-%m-%d %H:%M')}\n\n"

        self.result_text.insert(tk.END, result)
        self.result_text.see(tk.END)

    def _scan_complete(self):
        self.scan_btn.state(['!disabled'])
        self.organize_btn.state(['!disabled'])
        self.status_label.config(text=f"Skenování dokončeno. Nalezeno {len(self.file_infos)} souborů.")

    def _scan_error(self, error):
        self.scan_btn.state(['!disabled'])
        self.status_label.config(text="Chyba při skenování!")
        messagebox.showerror("Chyba", f"Chyba při skenování: {error}")

    def organize_files(self):
        if not self.output_dir.get():
            self.output_dir.set(str(Path(self.input_dir.get()) / "Organizované"))

        confirm = messagebox.askyesno("Potvrzení",
                                     f"Skutečně přesunout {len(self.file_infos)} souborů do {self.output_dir.get()}?")
        if not confirm:
            return

        self.organize_btn.state(['disabled'])
        self.progress['value'] = 0
        self.progress['maximum'] = len(self.file_infos)
        self.status_label.config(text="Organizování souborů...")

        thread = threading.Thread(target=self._organize_files_thread)
        thread.start()

    def _organize_files_thread(self):
        try:
            moved = 0
            for i, file_info in enumerate(self.file_infos):
                try:
                    import shutil
                    file_info.proposed_path.parent.mkdir(parents=True, exist_ok=True)
                    shutil.move(str(file_info.path), str(file_info.proposed_path))
                    moved += 1
                    self.root.after(0, lambda: self.status_label.config(text=f"Přesunuto {moved}/{len(self.file_infos)} souborů"))
                except Exception as e:
                    print(f"Chyba při přesunu {file_info.path}: {e}")

                self.progress['value'] = i + 1

            self.root.after(0, self._organize_complete)

        except Exception as e:
            self.root.after(0, lambda: self._organize_error(str(e)))

    def _organize_complete(self):
        self.organize_btn.state(['!disabled'])
        self.status_label.config(text="Organizování dokončeno!")
        messagebox.showinfo("Hotovo", "Soubor latajsem v pořádku organizovány.")

    def _organize_error(self, error):
        self.organize_btn.state(['!disabled'])
        self.status_label.config(text="Chyba při organizování!")
        messagebox.showerror("Chyba", f"Chyba při organizování: {error}")

def main():
    root = tk.Tk()
    app = FCOGui(root)
    root.mainloop()

if __name__ == "__main__":
    main()
