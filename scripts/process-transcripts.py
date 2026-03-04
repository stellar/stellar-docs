#!/usr/bin/env python3
"""Process transcripts with shared clean + normalize logic."""

from __future__ import annotations

import argparse
import pathlib
import sys

from transcript_core import cleanTranscript, normalizeTranscript


def parseArgs() -> argparse.Namespace:
  parser = argparse.ArgumentParser(
    description="Process transcript files by running clean + normalize."
  )
  parser.add_argument("input", nargs="?", help="Input transcript path. Reads stdin when omitted.")
  parser.add_argument("-o", "--output", help="Output path. Writes to stdout when omitted.")
  parser.add_argument(
    "--dedupe-adjacent",
    action="store_true",
    help="When cleaning, drop adjacent duplicate lines.",
  )
  parser.add_argument(
    "--sentence-case",
    action="store_true",
    help="When normalizing, capitalize sentence starts when text is mostly lowercase.",
  )
  return parser.parse_args()


def readInput(path: str | None) -> str:
  if path:
    return pathlib.Path(path).read_text(encoding="utf-8", errors="replace")
  return sys.stdin.read()


def writeOutput(path: str | None, text: str) -> None:
  if path:
    pathlib.Path(path).write_text(text, encoding="utf-8")
    return
  sys.stdout.write(text)


def main() -> int:
  args = parseArgs()
  text = readInput(args.input)

  text = cleanTranscript(text, dedupe=args.dedupe_adjacent)
  text = normalizeTranscript(text, sentenceCase=args.sentence_case)

  writeOutput(args.output, text)
  return 0


if __name__ == "__main__":
  raise SystemExit(main())
