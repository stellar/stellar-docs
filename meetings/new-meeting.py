#!/usr/bin/env python3
import argparse
import datetime as dt
import json
import pathlib
import re
import subprocess
import sys
import webvtt
from typing import Dict, Iterator, List, Optional, Tuple

PUNCTUATION_MODEL = None
LANGUAGE_TOOL = None
STOPWORDS = {
  "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "from", "has", "have", "he", "her",
  "his", "how", "i", "if", "in", "is", "it", "its", "me", "my", "not", "of", "on", "or", "our",
  "she", "so", "that", "the", "their", "them", "they", "this", "to", "up", "us", "we", "were",
  "what", "when", "where", "which", "who", "will", "with", "you", "your",
}
SUMMARY_KEYWORDS = {
  "cap", "caps", "protocol", "upgrade", "validator", "ledger", "freeze", "ttl", "extension",
  "host", "function", "functions", "address", "strkey", "soroban", "muxedaddress",
  "network", "config", "vote", "voting", "contract", "contracts", "sdk",
}

youtubeIdRE = re.compile(r"(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|\/|$)")
vttTimeRE = re.compile(r"^(\d{2}):(\d{2}):(\d{2})\.(\d{3})$")

def extractVideoId(urlOrId: str) -> Optional[str]:
  s = urlOrId.strip()
  if len(s) == 11 and re.fullmatch(r"[0-9A-Za-z_-]{11}", s):
    return s
  m = youtubeIdRE.search(s)
  return m.group(1) if m else None

def readList(path: pathlib.Path) -> Iterator[str]:
  with path.open(encoding="utf-8") as f:
    for line in f:
      clean = line.strip()
      if clean and not clean.startswith("#"):
        yield clean

def vttToText(vttPath: pathlib.Path) -> str:
  parts = []
  for cue in webvtt.read(str(vttPath)):
    parts.append(cue.text.strip())
  return "\n".join(filter(None, parts)) + "\n"

def parseVttTime(ts: str) -> float:
  m = vttTimeRE.match(ts)
  if not m:
    return 0.0
  hours, minutes, seconds, millis = (int(x) for x in m.groups())
  return hours * 3600 + minutes * 60 + seconds + (millis / 1000.0)

def cleanCaptionText(text: str) -> str:
  text = re.sub(r"<[^>]+>", "", text)
  text = re.sub(r"AGT;+", "", text)
  text = re.sub(r"\b(?:um+|uh+|erm+|hmm+|mm+)\b[,.]?", "", text, flags=re.IGNORECASE)
  text = re.sub(r"\b(cap|sep|slp)s?\b", lambda m: m.group(1).upper() + ("s" if m.group(0).lower().endswith("s") else ""), text)
  text = re.sub(r"\bprotocol\s+(\d+)\b", lambda m: f"Protocol {m.group(1)}", text, flags=re.IGNORECASE)
  text = re.sub(r"\bstella?r\b", "Stellar", text, flags=re.IGNORECASE)
  text = re.sub(r"\bopen\s*(?:zeppelin|zepplin|zepelin|rubin)\b", "OpenZeppelin", text, flags=re.IGNORECASE)
  text = re.sub(r"\b(sorond|soron|soran|soroban|orb[áa]n|soro?b[oa]n)\b", "Soroban", text, flags=re.IGNORECASE)
  text = text.replace("\n", " ")
  text = re.sub(r"\s+", " ", text)
  return text.strip()

def formatTimestamp(seconds: int) -> str:
  mins = seconds // 60
  secs = seconds % 60
  return f"{mins:02d}:{secs:02d}"

def yamlEscape(value: str) -> str:
  return value.replace("\\", "\\\\").replace("\"", "\\\"")

def punctuateText(text: str, enabled: bool) -> str:
  if not enabled:
    return text
  try:
    from deepmultilingualpunctuation import PunctuationModel  # type: ignore
  except Exception:
    print("warning: deepmultilingualpunctuation not installed; skipping punctuation", file=sys.stderr)
    return text
  global PUNCTUATION_MODEL
  if PUNCTUATION_MODEL is None:
    try:
      PUNCTUATION_MODEL = PunctuationModel()
    except Exception as exc:
      print(f"warning: punctuation model failed; skipping punctuation ({exc})", file=sys.stderr)
      return text
  return PUNCTUATION_MODEL.restore_punctuation(text)

def spellcheckText(text: str, enabled: bool) -> str:
  if not enabled:
    return text
  try:
    import language_tool_python  # type: ignore
  except Exception:
    print("warning: language_tool_python not installed; skipping spellcheck", file=sys.stderr)
    return text
  if len(text) > 12000:
    print("warning: text too long for spellcheck; skipping", file=sys.stderr)
    return text
  global LANGUAGE_TOOL
  if LANGUAGE_TOOL is None:
    try:
      LANGUAGE_TOOL = language_tool_python.LanguageTool("en-US")
    except Exception as exc:
      print(f"warning: spellcheck init failed; skipping spellcheck ({exc})", file=sys.stderr)
      return text
  return LANGUAGE_TOOL.correct(text)

def dedupeRepeatedPhrases(text: str) -> str:
  tokens = text.split()
  if len(tokens) < 6:
    return text
  maxWindow = 8
  maxPasses = 3
  for _ in range(maxPasses):
    i = 0
    changed = False
    while i < len(tokens):
      window = min(maxWindow, (len(tokens) - i) // 2)
      matched = False
      for n in range(window, 1, -1):
        a = tokens[i:i + n]
        b = tokens[i + n:i + 2 * n]
        if len(b) < n:
          continue
        normA = [re.sub(r"^\W+|\W+$", "", t).lower() for t in a]
        normB = [re.sub(r"^\W+|\W+$", "", t).lower() for t in b]
        if normA == normB and any(normA):
          del tokens[i + n:i + 2 * n]
          changed = True
          matched = True
          break
      if not matched:
        i += 1
    if not changed:
      break
  return " ".join(tokens)

def splitSentences(text: str) -> List[str]:
  parts = re.split(r"(?<=[.!?])\s+", text.strip())
  return [p.strip() for p in parts if p.strip()]

def tokenize(text: str) -> List[str]:
  return [
    w.lower()
    for w in re.findall(r"[A-Za-z0-9']+", text)
    if len(w) > 2 and w.lower() not in STOPWORDS
  ]

def normalizeSentence(sentence: str) -> str:
  sentence = re.sub(r"\s+", " ", sentence).strip()
  if sentence and sentence[-1] not in ".!?":
    sentence += "."
  return sentence[0].upper() + sentence[1:] if sentence else sentence

def extractSummaryItems(sentence: str) -> List[str]:
  items: List[str] = []
  for token in re.findall(r"[A-Za-z0-9-]+", sentence):
    lower = token.lower()
    if re.fullmatch(r"CAP-?\d+", token, flags=re.IGNORECASE):
      items.append(token.upper())
      continue
    if token.isupper() and len(token) > 2:
      items.append(token)
      continue
    if lower in SUMMARY_KEYWORDS:
      items.append(token)
      continue
    if token[0].isupper() and lower not in STOPWORDS:
      items.append(token)
  seen = set()
  deduped: List[str] = []
  for item in items:
    key = item.lower()
    if key in seen:
      continue
    seen.add(key)
    deduped.append(item)
  return deduped[:7]

def synthesizePoint(sentence: str) -> str:
  items = extractSummaryItems(sentence)
  if items:
    return f"Discussion focused on {', '.join(items)}."
  return normalizeSentence(sentence)

def extractResourceLinks(blocks: List[Tuple[int, str]]) -> List[Tuple[str, str]]:
  matches: List[Tuple[str, str]] = []
  seen = set()
  for _, block in blocks:
    for match in re.finditer(r"\b(CAP|SEP)[- ]?(\d{1,4})\b", block, flags=re.IGNORECASE):
      kind = match.group(1).upper()
      number = int(match.group(2))
      key = (kind, number)
      if key in seen:
        continue
      seen.add(key)
      slug = f"{number:04d}"
      if kind == "CAP":
        url = f"https://github.com/stellar/stellar-protocol/blob/master/core/cap-{slug}.md"
      else:
        url = f"https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-{slug}.md"
      matches.append((f"{kind}-{number}", url))
  return matches

def summarizeKeyPoints(blocks: List[Tuple[int, str]], maxPoints: int) -> List[str]:
  if not blocks or maxPoints <= 0:
    return []

  text = " ".join(block for _, block in blocks)
  sentences = splitSentences(text)
  if not sentences:
    return []

  freqs: Dict[str, int] = {}
  for sentence in sentences:
    for token in tokenize(sentence):
      freqs[token] = freqs.get(token, 0) + 1

  scored: List[Tuple[int, float, str, set]] = []
  for idx, sentence in enumerate(sentences):
    lowered = sentence.lower()
    fillerHits = len(re.findall(r"\b(yeah|okay|ok|um|uh|like|you know|sort of|kind of)\b", lowered))
    tokens = tokenize(sentence)
    if len(tokens) < 5 or len(tokens) > 30:
      continue
    if fillerHits >= 2:
      continue
    if len(sentence) < 50:
      continue
    score = sum(freqs.get(t, 0) for t in tokens) / max(len(tokens), 1)
    keywordBonus = sum(1 for t in tokens if t in SUMMARY_KEYWORDS) * 0.6
    score += keywordBonus
    scored.append((idx, score, sentence, set(tokens)))

  if not scored:
    fallback = normalizeSentence(sentences[0])
    return [fallback] if fallback else []

  scored.sort(key=lambda x: (-x[1], x[0]))
  picked: List[str] = []
  pickedSets: List[set] = []
  pickedNorm: set = set()
  for _, _, sentence, tokenSet in scored:
    if len(picked) >= maxPoints:
      break
    tooSimilar = False
    for prevSet in pickedSets:
      if not prevSet:
        continue
      overlap = len(prevSet & tokenSet) / max(len(prevSet | tokenSet), 1)
      if overlap > 0.6:
        tooSimilar = True
        break
    if tooSimilar:
      continue
    synthesized = synthesizePoint(sentence)
    synthNorm = re.sub(r"\s+", " ", synthesized).strip().lower()
    if synthNorm in pickedNorm:
      continue
    picked.append(synthesized)
    pickedNorm.add(synthNorm)
    pickedSets.append(tokenSet)
  return picked

def vttToMinuteBlocks(vttPath: pathlib.Path, blockSeconds: int, punctuate: bool, spellcheck: bool) -> List[Tuple[int, str]]:
  buckets: Dict[int, List[str]] = {}
  for cue in webvtt.read(str(vttPath)):
    startS = parseVttTime(cue.start)
    minuteBucket = int(startS // blockSeconds) * blockSeconds
    clean = cleanCaptionText(cue.text)
    if not clean:
      continue
    items = buckets.setdefault(minuteBucket, [])
    if not items or items[-1] != clean:
      items.append(clean)

  blocks: List[Tuple[int, str]] = []
  lastNorm: Optional[str] = None
  for bucket in sorted(buckets.keys()):
    joined = " ".join(buckets[bucket]).strip()
    if not joined:
      continue
    joined = punctuateText(joined, punctuate)
    joined = spellcheckText(joined, spellcheck)
    joined = dedupeRepeatedPhrases(joined)
    norm = re.sub(r"\s+", " ", joined).strip().lower()
    if norm and norm == lastNorm:
      continue
    blocks.append((bucket, joined))
    lastNorm = norm
  return blocks

def fetchMetadata(videoId: str, args: argparse.Namespace) -> Dict[str, str]:
  cmd = [
    sys.executable,
    "-m",
    "yt_dlp",
    "--skip-download",
    "--dump-single-json",
    f"https://www.youtube.com/watch?v={videoId}",
  ]
  if args.cookies:
    cmd.extend(["--cookies", args.cookies])
  if args.remoteComponents:
    cmd.extend(["--remote-components", args.remoteComponents])
  if args.jsRuntime:
    cmd.extend(["--js-runtimes", args.jsRuntime])
  if args.impersonate:
    cmd.extend(["--impersonate", args.impersonate])
  proc = subprocess.run(cmd, capture_output=True, text=True)
  if proc.returncode:
    print(f"{videoId}: yt-dlp metadata failed ({proc.returncode})\n{proc.stderr}", file=sys.stderr)
    return {}
  try:
    return json.loads(proc.stdout)
  except Exception:
    return {}

def buildMdx(
  videoId: str,
  title: str,
  description: str,
  authors: List[str],
  tags: List[str],
  blocks: List[Tuple[int, str]],
  summaryPoints: List[str],
  resourceLinks: List[Tuple[str, str]],
) -> str:
  safeTitle = yamlEscape(title)
  safeDescription = yamlEscape(description)
  frontMatterLines = [
    "---",
    f"title: \"{safeTitle}\"",
    f"description: \"{safeDescription}\"",
    "authors:",
  ]
  for author in authors:
    frontMatterLines.append(f"  - {author}")
  frontMatterLines.append(f"tags: [{', '.join(tags)}]")
  frontMatterLines.append("---")
  frontMatter = "\n".join(frontMatterLines)

  transcriptLines = []
  prevEndedSentence = True
  for offset, text in blocks:
    cleanedText = text
    if cleanedText and not prevEndedSentence:
      cleanedText = cleanedText[0].lower() + cleanedText[1:]
    transcriptLines.append(f"[{formatTimestamp(offset)}] {cleanedText}")
    transcriptLines.append("")
    prevEndedSentence = bool(re.search(r"[.!?]$", text.strip()))

  transcriptBody = "\n".join(transcriptLines).rstrip()
  summaryBlock = ""
  if summaryPoints:
    summaryLines = [f"- {point}" for point in summaryPoints] + [""]
    summaryBlock = "\n".join(summaryLines)
  resourcesBlock = ""
  if resourceLinks:
    resourceLines = [f"- [{label}]({url})" for label, url in resourceLinks]
    resourcesBlock = "\n".join(resourceLines) + "\n"
  return (
    f"{frontMatter}\n\n"
    "import YouTube from \"@site/src/components/YouTube\";\n\n"
    f"<YouTube ID=\"{videoId}\" />\n\n"
    f"### Key Points\n\n"
    f"{summaryBlock}\n\n"
    f"### Resources\n\n"
    f"{resourcesBlock}\n\n"
    "<details>\n"
    "  <summary>Video Transcript</summary>\n\n"
    f"{transcriptBody}\n\n"
    "</details>\n"
  )

def fetchCaptions(videoId: str, outDir: pathlib.Path, args: argparse.Namespace) -> None:
  outDir.mkdir(parents=True, exist_ok=True)
  cmd = [
    sys.executable,
    "-m",
    "yt_dlp",
    "--skip-download",
    "--write-subs",
    "--write-auto-subs",
    "--sub-langs",
    args.lang,
    "--sub-format",
    "vtt",
    "-o",
    str(outDir / f"{videoId}.%(ext)s"),
    f"https://www.youtube.com/watch?v={videoId}",
  ]
  if args.cookies:
    cmd.extend(["--cookies", args.cookies])
  if args.remoteComponents:
    cmd.extend(["--remote-components", args.remoteComponents])
  if args.jsRuntime:
    cmd.extend(["--js-runtimes", args.jsRuntime])
  if args.impersonate:
    cmd.extend(["--impersonate", args.impersonate])

  proc = subprocess.run(cmd, capture_output=True, text=True)
  if proc.returncode:
    print(f"{videoId}: yt-dlp failed ({proc.returncode})\n{proc.stderr}", file=sys.stderr)
    return

  vttFiles = list(outDir.glob(f"{videoId}*.vtt"))
  if not vttFiles:
    print(f"{videoId}: no captions", file=sys.stderr)
    return

  vttPath = max(vttFiles, key=lambda p: p.stat().st_mtime)
  if not args.createPage or args.saveTxt:
    txtPath = outDir / f"{videoId}.{args.lang}.txt"
    txtPath.write_text(vttToText(vttPath), encoding="utf-8")
    print(f"{videoId}: saved {txtPath}")

  if args.createPage:
    if not args.authors:
      args.authors = "carsten-jacobsen"
    metadata = fetchMetadata(videoId, args)
    title = args.title or metadata.get("title") or f"Meeting {videoId}"
    description = args.description or metadata.get("description", "")
    if description:
      description = description.strip().replace("\n", " ")
      description = re.sub(r"\s+", " ", description)[:180]
    tags = [t.strip() for t in (args.tags or "developer").split(",") if t.strip()]
    authors = [a.strip() for a in args.authors.split(",") if a.strip()]

    uploadDate = metadata.get("upload_date")
    dateStr = args.date or (f"{uploadDate[:4]}-{uploadDate[4:6]}-{uploadDate[6:]}" if uploadDate else None)
    if not dateStr:
      dateStr = dt.date.today().isoformat()

    blocks = vttToMinuteBlocks(
      vttPath,
      blockSeconds=args.blockSeconds,
      punctuate=args.punctuate,
      spellcheck=args.spellcheck,
    )
    summaryPoints = [] if args.noSummary else summarizeKeyPoints(blocks, args.summaryPoints)
    resourceLinks = extractResourceLinks(blocks)
    if (not args.description) and (not description) and summaryPoints:
      description = summaryPoints[0]
      description = description.strip().replace("\n", " ")
      description = re.sub(r"\s+", " ", description)[:180]
    if not description:
      description = "Stellar developer meeting transcript."

    meetingsDir = pathlib.Path(args.meetingsDir)
    meetingsDir.mkdir(parents=True, exist_ok=True)
    outPath = meetingsDir / f"{dateStr}.mdx"
    if outPath.exists() and not args.overwrite:
      print(f"{videoId}: {outPath} exists (use --overwrite to replace)", file=sys.stderr)
      return
    outPath.write_text(
      buildMdx(videoId, title, description, authors, tags, blocks, summaryPoints, resourceLinks),
      encoding="utf-8",
    )
    print(f"{videoId}: wrote {outPath}")

  if args.createPage and not args.keepVtt:
    for vttFile in vttFiles:
      try:
        vttFile.unlink()
      except OSError:
        pass
    try:
      if outDir.exists() and not any(outDir.iterdir()):
        outDir.rmdir()
    except OSError:
      pass

def main() -> None:
  parser = argparse.ArgumentParser(description="Export YouTube captions to text")
  group = parser.add_mutually_exclusive_group(required=False)
  group.add_argument("--video", help="YouTube URL or ID")
  group.add_argument("--list", help="File with one URL/ID per line")
  parser.add_argument("--lang", default="en")
  parser.add_argument("--out", default="transcripts_out")
  parser.add_argument("--cookies", help="Path to cookies.txt for authenticated captions")
  parser.add_argument("--remote-components", dest="remoteComponents")
  parser.add_argument("--js-runtime", dest="jsRuntime")
  parser.add_argument("--impersonate")
  parser.add_argument("--create-page", action="store_true", default=True, dest="createPage", help="Create meetings mdx page with transcript")
  parser.add_argument("--no-create-page", action="store_false", dest="createPage", help="Only export captions to text")
  parser.add_argument("--save-txt", action="store_true", dest="saveTxt", help="Also save a plain text transcript")
  parser.add_argument("--keep-vtt", action="store_true", dest="keepVtt", help="Keep downloaded VTT files")
  parser.add_argument("--meetings-dir", default="meetings", dest="meetingsDir")
  parser.add_argument("--title")
  parser.add_argument("--description")
  parser.add_argument("--authors", help="Comma-separated speaker slugs from meetings/authors.yml")
  parser.add_argument("--tags", help="Comma-separated tags (default: developer)")
  parser.add_argument("--date", help="YYYY-MM-DD; defaults to upload date")
  parser.add_argument("--overwrite", action="store_true")
  parser.add_argument("--block-seconds", type=int, default=60, dest="blockSeconds")
  parser.add_argument("--punctuate", action="store_true", default=True)
  parser.add_argument("--no-punctuate", action="store_false", dest="punctuate")
  parser.add_argument("--spellcheck", action="store_true", default=True)
  parser.add_argument("--no-spellcheck", action="store_false", dest="spellcheck")
  parser.add_argument("--summary-points", type=int, default=4, dest="summaryPoints", help="Number of summary bullets to include")
  parser.add_argument("--no-summary", action="store_true", dest="noSummary", help="Skip summary generation")
  args = parser.parse_args()

  if not args.video and not args.list:
    args.video = input("YouTube video ID or URL: ").strip() or None
  if args.createPage and not args.authors:
    args.authors = input("Speakers (comma-separated, from authors.yml): ").strip() or None
  if args.createPage and not args.tags:
    args.tags = input("Tags (comma-separated, default: developer): ").strip() or "developer"

  inputs = [args.video] if args.video else list(readList(pathlib.Path(args.list)))
  videoIds = [vid for vid in (extractVideoId(item) for item in inputs) if vid]
  if not videoIds:
    parser.error("no valid video IDs found")

  outDir = pathlib.Path(args.out)
  for vid in videoIds:
    fetchCaptions(vid, outDir, args)

if __name__ == "__main__":
  main()
