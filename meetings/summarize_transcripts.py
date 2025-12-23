#!/usr/bin/env python3
"""
Generate lightweight summaries and speaker suggestions for meeting notes
based on the downloaded transcript files.

This script does not update any MDX automatically. Instead, it writes a
JSON helper file (`meeting_summaries.json`) that can be used to review
topics/authors before editing the posts manually.
"""

from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parent.parent
MEETING_DIR = ROOT / "meetings"
TRANSCRIPT_DIR = ROOT / "transcripts_out"
VIDEOS_TXT = MEETING_DIR / "videos.txt"
OUTPUT_JSON = MEETING_DIR / "meeting_summaries.json"

STOPWORDS = {
    "the",
    "and",
    "that",
    "this",
    "with",
    "from",
    "have",
    "will",
    "they",
    "been",
    "about",
    "into",
    "their",
    "there",
    "your",
    "here",
    "just",
    "where",
    "when",
    "what",
    "would",
    "could",
    "should",
    "were",
    "them",
    "then",
    "than",
    "because",
    "ever",
    "over",
    "very",
    "every",
    "more",
    "most",
    "much",
    "many",
    "some",
    "like",
    "also",
    "into",
    "only",
    "well",
    "back",
    "take",
    "takes",
    "going",
    "really",
    "gonna",
    "think",
    "talk",
    "talking",
    "know",
    "want",
    "need",
    "said",
    "saying",
    "still",
    "yeah",
    "okay",
    "right",
    "kind",
    "sort",
    "that",
    "it's",
    "its",
    "i'm",
    "we're",
    "you're",
    "they're",
    "don't",
    "doesn't",
    "can't",
    "won't",
}

TRANSLATION_TABLE = str.maketrans({"“": '"', "”": '"', "’": "'", "–": "-", "—": "-"})


YOUTUBE_ID_RE = re.compile(r'<YouTube ID="([^"]+)"')


def read_video_ids() -> list[str]:
    videos: list[str] = []
    seen: set[str] = set()

    for line in VIDEOS_TXT.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if line not in seen:
            videos.append(line)
            seen.add(line)

    for path in MEETING_DIR.glob("*.mdx"):
        text = path.read_text(encoding="utf-8")
        for match in YOUTUBE_ID_RE.findall(text):
            if match not in seen:
                videos.append(match)
                seen.add(match)

    return videos


def build_meeting_index() -> dict[str, Path]:
    mapping: dict[str, Path] = {}
    for path in MEETING_DIR.glob("*.mdx"):
        text = path.read_text(encoding="utf-8")
        for match in YOUTUBE_ID_RE.findall(text):
            mapping[match] = path
    return mapping


def split_sentences(text: str) -> list[str]:
    raw_sentences = re.split(r"(?<=[.!?])\s+", text)
    return [s.strip() for s in raw_sentences if s.strip()]


def normalize_word(word: str) -> str:
    return re.sub(r"[^\w-]+", "", word.lower())


def extract_keywords(text: str, max_count: int = 10) -> list[str]:
    words = [
        w
        for w in (normalize_word(token) for token in re.split(r"\s+", text))
        if w and len(w) > 3 and w not in STOPWORDS
    ]
    freq = Counter(words)
    return [word for word, _ in freq.most_common(max_count)]


def extract_speakers(raw_text: str, max_count: int = 5) -> list[str]:
    candidates = re.findall(r"\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b", raw_text)
    counts = Counter(candidates)
    speakers = []
    for name, _ in counts.most_common():
        normalized = " ".join(part.capitalize() for part in name.split())
        if normalized not in speakers:
            speakers.append(normalized)
        if len(speakers) >= max_count:
            break
    return speakers


def derive_summary(text: str) -> str:
    sentences = split_sentences(text)
    if not sentences:
        return ""
    # Prefer the opening comments but keep it concise
    chosen = sentences[:3]
    return " ".join(chosen)


def collapse_repeated_lines(text: str) -> str:
    collapsed: list[str] = []
    previous = ""
    for line in text.splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        if stripped == previous:
            continue
        collapsed.append(stripped)
        previous = stripped
    return " ".join(collapsed)


def summarize_transcript(transcript_path: Path) -> dict[str, Iterable[str] | str]:
    raw_text = transcript_path.read_text(encoding="utf-8").translate(
        TRANSLATION_TABLE
    )
    normalized = collapse_repeated_lines(raw_text)
    summary = derive_summary(normalized)
    keywords = extract_keywords(normalized, max_count=12)
    speakers = extract_speakers(raw_text, max_count=5)
    return {"summary": summary, "keywords": keywords, "speakers": speakers}


def main() -> None:
    output: dict[str, dict[str, Iterable[str] | str]] = {}
    meeting_index = build_meeting_index()
    missing_transcripts: list[str] = []

    for video_id in read_video_ids():
        transcript_path = TRANSCRIPT_DIR / f"{video_id}.en.txt"
        if not transcript_path.exists():
            missing_transcripts.append(video_id)
            continue

        meeting_file = meeting_index.get(video_id)
        key = meeting_file.name if meeting_file else video_id

        try:
            output[key] = summarize_transcript(transcript_path)
        except Exception as exc:  # pragma: no cover - debugging helper
            print(f"Failed to summarize {video_id}: {exc}")

    OUTPUT_JSON.write_text(
        json.dumps(
            {
                "generated": len(output),
                "missing_transcripts": missing_transcripts,
                "data": output,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    print(
        f"Wrote {len(output)} summaries to {OUTPUT_JSON.relative_to(ROOT)} "
        f"(missing transcripts: {len(missing_transcripts)})"
    )


if __name__ == "__main__":
    main()
