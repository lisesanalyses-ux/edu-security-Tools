from dataclasses import dataclass
from pathlib import Path
from typing import Optional

@dataclass
class FileInfo:
    path: Path
    size: int
    extension: str
    mtime: float
    proposed_path: Optional[Path] = None
    category: Optional[str] = None
