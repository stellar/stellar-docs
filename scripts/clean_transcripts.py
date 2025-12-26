#!/usr/bin/env python3
"""
Normalize transcripts by stripping filler words.

Run this from the repository root to rewrite every transcript file
in `transcripts_out` and its subfolders.
"""

from __future__ import annotations

import re
from pathlib import Path


FILLER_PATTERN = re.compile(r"\b(?:um+|uh+|crap)\b", re.IGNORECASE)


def clean_text(text: str) -> str:
    """Remove filler tokens and collapse the leftover whitespace."""
    cleaned = FILLER_PATTERN.sub("", text)
    cleaned = re.sub(r"[ \t]{2,}", " ", cleaned)
    cleaned = re.sub(r"[ \t]*\n[ \t]*", "\n", cleaned)
    return cleaned


def main() -> None:
    repo_root = Path(__file__).resolve().parents[1]
    transcripts_root = repo_root / "transcripts_out"
    for path in transcripts_root.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix.lower() not in {".txt", ".vtt"}:
            continue

        original = path.read_text(encoding="utf-8")
        cleaned = clean_text(original)
        if cleaned == original:
            continue
        path.write_text(cleaned, encoding="utf-8")


if __name__ == "__main__":
    main()
