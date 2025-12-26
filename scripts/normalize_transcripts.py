#!/usr/bin/env python3
"""
Capitalize acronyms and guarantee punctuation per sentence in pretty transcripts.

Run this after `scripts/clean_transcripts.py` if you want each sentence to end with
a period (or other terminal punctuation) and ensure the known acronyms stay uppercase.
"""

from __future__ import annotations

import argparse
import pathlib
import re
from typing import Iterable

PRETTY_DIR = pathlib.Path("transcripts_out/pretty")
ACRONYMS = {"cap", "rpc", "sep", "sdf", "sdk", "soroban", "etl"}


def normalize_sentence(sentence: str) -> str:
    sentence = sentence.strip()
    if not sentence:
        return ""
    words = sentence.split()
    for idx, word in enumerate(words):
        cleaned = re.sub(r"[^\w]", "", word)
        if cleaned.lower() in ACRONYMS:
            words[idx] = word.replace(cleaned, cleaned.upper())
        elif idx == 0:
            words[idx] = word[0].upper() + word[1:]
    result = " ".join(words)
    if result[-1] not in ".!?":
        result += "."
    return result


def normalize_file(path: pathlib.Path) -> None:
    text = path.read_text(encoding="utf-8").strip()
    if not text:
        return
    sentences = re.split(r"(?<=[.!?])\s+", text)
    normalized: list[str] = []
    for sentence in sentences:
        if not sentence.strip():
            continue
        normalized_sentence = normalize_sentence(sentence)
        if normalized_sentence:
            normalized.append(normalized_sentence)
    path.write_text("\n".join(normalized) + "\n", encoding="utf-8")


def main(glob_pattern: str, limit: int | None) -> None:
    files = sorted(PRETTY_DIR.glob(glob_pattern))
    if limit:
        files = files[:limit]
    for path in files:
        normalize_file(path)
        print(f"normalized {path}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Normalize pretty transcripts.")
    ap.add_argument("--pattern", default="*.pretty.txt", help="Glob to match (default: *.pretty.txt)")
    ap.add_argument("--limit", type=int, help="Limit how many files to process")
    args = ap.parse_args()
    main(args.pattern, args.limit)

