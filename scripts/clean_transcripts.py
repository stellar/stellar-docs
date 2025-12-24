#!/usr/bin/env python3
import pathlib
from typing import Iterable, List

RAW_DIR = pathlib.Path("transcripts_out")
OUT_DIR = RAW_DIR / "pretty"


def read_segments(path: pathlib.Path) -> List[str]:
    """Return non-empty segments from a transcript file."""
    raw = path.read_text(encoding="utf-8")
    segments = [line.strip() for line in raw.splitlines() if line.strip()]
    return segments


def pretty_line(segment: str) -> str:
    """Capitalize and punctuate a single transcript segment."""
    content = segment.strip()
    if not content:
        return ""
    content = content[0].upper() + content[1:]
    if content[-1] not in ".!?":
        content += "."
    return content


def pretty_content(segments: Iterable[str]) -> str:
    """Join prettified segments into readable paragraphs."""
    lines = [pretty_line(seg) for seg in segments if seg]
    return " ".join(lines)


def clean_first_n(n: int = 10) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    transcripts = sorted(RAW_DIR.glob("*.en.txt"))[:n]
    for path in transcripts:
        content = pretty_content(read_segments(path))
        target = OUT_DIR / f"{path.stem}.pretty.txt"
        target.write_text(content + "\n", encoding="utf-8")
        print(f"Wrote {target}")


if __name__ == "__main__":
    clean_first_n()
