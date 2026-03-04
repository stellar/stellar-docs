#!/usr/bin/env python3
"""Shared transcript processing functions used by scripts and meeting tooling."""

from __future__ import annotations

import re
from typing import Iterable, List, Tuple

TIMESTAMP_RE = re.compile(r"^\s*\[(\d{1,2}:\d{2}(?::\d{2})?)\]\s*(.*)$")


def removeControlChars(text: str) -> str:
  text = text.replace("\ufeff", "")
  text = text.replace("\u200b", "").replace("\u200c", "").replace("\u200d", "")
  return re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", text)


def cleanTextBody(text: str) -> str:
  text = text.replace("\r\n", "\n").replace("\r", "\n")
  text = removeControlChars(text)
  text = re.sub(r"<[^>]+>", "", text)
  text = re.sub(r"[ \t]+", " ", text)
  text = re.sub(r"\n{3,}", "\n\n", text)
  return text.strip() + ("\n" if text else "")


def normalizeLine(line: str) -> str:
  line = re.sub(r"\s+", " ", line.strip())
  if not line:
    return ""
  ts = TIMESTAMP_RE.match(line)
  if ts:
    stamp, body = ts.groups()
    body = body.strip()
    return f"[{stamp}] {body}" if body else f"[{stamp}]"
  return line


def dedupeAdjacent(lines: Iterable[str]) -> List[str]:
  out: List[str] = []
  previousKey: str | None = None
  for line in lines:
    key = line.lower()
    if previousKey is not None and key == previousKey:
      continue
    out.append(line)
    previousKey = key
  return out


def cleanTranscript(rawText: str, dedupe: bool) -> str:
  cleaned = cleanTextBody(rawText)
  lines = [normalizeLine(ln) for ln in cleaned.split("\n")]
  lines = [ln for ln in lines if ln]
  if dedupe:
    lines = dedupeAdjacent(lines)
  return "\n".join(lines).strip() + ("\n" if lines else "")


def normalizeTerms(text: str) -> str:
  text = re.sub(
    r"\b(cap|sep|slp)s?\b",
    lambda m: m.group(1).upper() + ("s" if m.group(0).lower().endswith("s") else ""),
    text,
    flags=re.IGNORECASE,
  )
  text = re.sub(r"\bprotocol\s+(\d+)\b", r"Protocol \1", text, flags=re.IGNORECASE)
  text = re.sub(r"\bstella?r\b", "Stellar", text, flags=re.IGNORECASE)
  text = re.sub(r"\bsor[oa]b[oa]n\b", "Soroban", text, flags=re.IGNORECASE)
  text = re.sub(r"\bopen\s*(?:zeppelin|zepplin|zepelin|zappelin|rubin)\b", "OpenZeppelin", text, flags=re.IGNORECASE)
  return text


def dedupeRepeatedWords(text: str) -> str:
  previous = None
  current = text
  while previous != current:
    previous = current
    current = re.sub(r"\b(\w+)(\s+\1\b)+", r"\1", current, flags=re.IGNORECASE)
  return current


def dedupeRepeatedPhrases(text: str) -> str:
  tokens = text.split()
  if len(tokens) < 6:
    return text
  i = 0
  while i < len(tokens):
    maxWindow = min(8, (len(tokens) - i) // 2)
    removed = False
    for width in range(maxWindow, 1, -1):
      left = tokens[i : i + width]
      right = tokens[i + width : i + (2 * width)]
      if len(right) < width:
        continue
      normLeft = [re.sub(r"^\W+|\W+$", "", t).lower() for t in left]
      normRight = [re.sub(r"^\W+|\W+$", "", t).lower() for t in right]
      if normLeft == normRight and any(normLeft):
        del tokens[i + width : i + (2 * width)]
        removed = True
        break
    if not removed:
      i += 1
  return " ".join(tokens)


def applySentenceCase(text: str) -> str:
  text = text.strip()
  if not text:
    return text
  if sum(1 for ch in text if ch.isupper()) > max(2, len(text) // 8):
    return text
  text = text[0].upper() + text[1:]
  return re.sub(r"([.!?]\s+)([a-z])", lambda m: m.group(1) + m.group(2).upper(), text)


def normalizeTranscript(text: str, sentenceCase: bool) -> str:
  out: List[str] = []
  for line in text.splitlines():
    line = line.strip()
    if not line:
      continue
    prefix = ""
    body = line
    match = re.match(r"^\s*(\[\d{1,2}:\d{2}(?::\d{2})?\])\s*(.*)$", line)
    if match:
      prefix = f"{match.group(1)} "
      body = match.group(2).strip()
    body = re.sub(r"\s+", " ", body).strip()
    if not body:
      continue
    body = normalizeTerms(body)
    body = dedupeRepeatedWords(body)
    body = dedupeRepeatedPhrases(body)
    if sentenceCase:
      body = applySentenceCase(body)
    out.append(f"{prefix}{body}".strip())
  return "\n".join(out).strip() + ("\n" if out else "")


def processCaptionText(text: str) -> str:
  text = cleanTextBody(text).strip()
  text = re.sub(r"AGT;+", "", text)
  text = re.sub(r"\b(?:um+|uh+|erm+|hmm+|mm+)\b[,.]?", "", text, flags=re.IGNORECASE)
  text = re.sub(r"\b(sorond|soron|saran|orb[áa]n)\b", "Soroban", text, flags=re.IGNORECASE)
  text = normalizeTerms(text)
  text = re.sub(r"\b(sorond|soron|saran|soroban|orb[áa]n|soro?b[oa]n)\b", "Soroban", text, flags=re.IGNORECASE)
  text = text.replace("\n", " ")
  text = re.sub(r"\s+", " ", text).strip()
  return text
