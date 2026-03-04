#!/usr/bin/env python3
"""Split transcript files into overlap-aware long-context chunks."""

from __future__ import annotations

import argparse
import json
import pathlib
import re
import sys
from dataclasses import dataclass
from typing import List, Sequence

TIMESTAMP_RE = re.compile(r"^\[(\d{1,2}:\d{2}(?::\d{2})?)\]")


@dataclass
class Chunk:
    index: int
    start_line: int
    end_line: int
    start_timestamp: str | None
    end_timestamp: str | None
    text: str


def parseArgs() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Chunk transcript text into long-context windows."
    )
    parser.add_argument("input", help="Input transcript path.")
    parser.add_argument(
        "-d",
        "--output-dir",
        default="transcripts_out/chunks",
        help="Directory where chunk files are written.",
    )
    parser.add_argument(
        "--max-chars",
        type=int,
        default=12000,
        help="Maximum characters per chunk.",
    )
    parser.add_argument(
        "--overlap-lines",
        type=int,
        default=3,
        help="Number of trailing lines repeated in next chunk.",
    )
    parser.add_argument(
        "--prefix",
        default="chunk",
        help="Chunk filename prefix.",
    )
    return parser.parse_args()


def readLines(path: pathlib.Path) -> List[str]:
    text = path.read_text(encoding="utf-8", errors="replace")
    return [ln.strip() for ln in text.splitlines() if ln.strip()]


def extractTimestamp(line: str) -> str | None:
    match = TIMESTAMP_RE.match(line)
    return match.group(1) if match else None


def makeChunk(index: int, startLine: int, endLine: int, lines: Sequence[str]) -> Chunk:
    segment = list(lines[startLine:endLine])
    return Chunk(
        index=index,
        start_line=startLine + 1,
        end_line=endLine,
        start_timestamp=extractTimestamp(segment[0]) if segment else None,
        end_timestamp=extractTimestamp(segment[-1]) if segment else None,
        text="\n".join(segment) + ("\n" if segment else ""),
    )


def chunkLines(lines: Sequence[str], maxChars: int, overlapLines: int) -> List[Chunk]:
    chunks: List[Chunk] = []
    i = 0
    index = 1
    while i < len(lines):
        current_chars = 0
        j = i
        while j < len(lines):
            line_len = len(lines[j]) + 1
            if j > i and current_chars + line_len > maxChars:
                break
            current_chars += line_len
            j += 1
        if j == i:
            j = i + 1
        chunks.append(makeChunk(index, i, j, lines))
        if j >= len(lines):
            break
        i = max(j - max(overlapLines, 0), i + 1)
        index += 1
    return chunks


def writeChunks(chunks: Sequence[Chunk], outputDir: pathlib.Path, prefix: str) -> None:
    outputDir.mkdir(parents=True, exist_ok=True)
    manifest = []
    for chunk in chunks:
        filename = f"{prefix}_{chunk.index:03d}.txt"
        path = outputDir / filename
        path.write_text(chunk.text, encoding="utf-8")
        manifest.append(
            {
                "index": chunk.index,
                "file": filename,
                "start_line": chunk.start_line,
                "end_line": chunk.end_line,
                "start_timestamp": chunk.start_timestamp,
                "end_timestamp": chunk.end_timestamp,
                "chars": len(chunk.text),
            }
        )
    (outputDir / f"{prefix}_manifest.json").write_text(
        json.dumps(manifest, indent=2),
        encoding="utf-8",
    )


def main() -> int:
    args = parseArgs()
    input_path = pathlib.Path(args.input)
    if not input_path.exists():
        print(f"error: input file not found: {input_path}", file=sys.stderr)
        return 1
    lines = readLines(input_path)
    if not lines:
        print("error: input transcript has no non-empty lines", file=sys.stderr)
        return 1
    chunks = chunkLines(lines, maxChars=max(args.max_chars, 1), overlapLines=args.overlap_lines)
    writeChunks(chunks, pathlib.Path(args.output_dir), args.prefix)
    print(f"wrote {len(chunks)} chunks to {args.output_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
