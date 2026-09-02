"""Finding type and severity model shared by all checks."""

from __future__ import annotations

from dataclasses import dataclass

ERROR = "error"
WARNING = "warning"


@dataclass(frozen=True)
class Finding:
    severity: str  # ERROR or WARNING
    code: str  # e.g. "E103"
    path: str  # path relative to the linted project root
    line: int  # 1-based; 0 means "whole file / not line-specific"
    message: str

    def format_text(self) -> str:
        loc = f"{self.path}:{self.line}" if self.line else self.path
        return f"{loc}: [{self.code}] {self.message}"

    def format_github(self) -> str:
        kind = "error" if self.severity == ERROR else "warning"
        loc = f"file={self.path}" + (f",line={self.line}" if self.line else "")
        return f"::{kind} {loc}::[{self.code}] {self.message}"
