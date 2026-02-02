#!/usr/bin/env python3
import argparse
import datetime as dt
import json
import pathlib
import re
import subprocess
import sys
from typing import Dict, Iterator, List, Optional, Tuple

YOUTUBE_ID_RE = re.compile(r"(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|\/|$)")
VTT_TIME_RE = re.compile(r"^(\d{2}):(\d{2}):(\d{2})\.(\d{3})$")
_PUNCTUATION_MODEL = None
_LANGUAGE_TOOL = None
_STOPWORDS = {
    "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "from", "has", "have", "he", "her",
    "his", "how", "i", "if", "in", "is", "it", "its", "me", "my", "not", "of", "on", "or", "our",
    "she", "so", "that", "the", "their", "them", "they", "this", "to", "up", "us", "we", "were",
    "what", "when", "where", "which", "who", "will", "with", "you", "your",
}
_SUMMARY_KEYWORDS = {
    "cap", "caps", "protocol", "upgrade", "validator", "ledger", "freeze", "ttl", "extension",
    "host", "function", "functions", "address", "strkey", "soroban", "muxedaddress",
    "network", "config", "vote", "voting", "contract", "contracts", "sdk",
}

def extract_video_id(url_or_id: str) -> Optional[str]:
    s = url_or_id.strip()
    if len(s) == 11 and re.fullmatch(r"[0-9A-Za-z_-]{11}", s):
        return s
    m = YOUTUBE_ID_RE.search(s)
    return m.group(1) if m else None

def read_list(path: pathlib.Path) -> Iterator[str]:
    with path.open(encoding="utf-8") as f:
        for line in f:
            clean = line.strip()
            if clean and not clean.startswith("#"):
                yield clean

def vtt_to_text(vtt_path: pathlib.Path) -> str:
    import webvtt  # pip install webvtt-py
    parts = []
    for cue in webvtt.read(str(vtt_path)):
        parts.append(cue.text.strip())
    return "\n".join(filter(None, parts)) + "\n"

def _parse_vtt_time(ts: str) -> float:
    m = VTT_TIME_RE.match(ts)
    if not m:
        return 0.0
    hours, minutes, seconds, millis = (int(x) for x in m.groups())
    return hours * 3600 + minutes * 60 + seconds + (millis / 1000.0)

def _clean_caption_text(text: str) -> str:
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

def _format_timestamp(seconds: int) -> str:
    mins = seconds // 60
    secs = seconds % 60
    return f"{mins:02d}:{secs:02d}"

def _yaml_escape(value: str) -> str:
    return value.replace("\\", "\\\\").replace("\"", "\\\"")

def _punctuate_text(text: str, enabled: bool) -> str:
    if not enabled:
        return text
    try:
        from deepmultilingualpunctuation import PunctuationModel  # type: ignore
    except Exception:
        print("warning: deepmultilingualpunctuation not installed; skipping punctuation", file=sys.stderr)
        return text
    global _PUNCTUATION_MODEL
    if _PUNCTUATION_MODEL is None:
        try:
            _PUNCTUATION_MODEL = PunctuationModel()
        except Exception as exc:
            print(f"warning: punctuation model failed; skipping punctuation ({exc})", file=sys.stderr)
            return text
    return _PUNCTUATION_MODEL.restore_punctuation(text)

def _spellcheck_text(text: str, enabled: bool) -> str:
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
    global _LANGUAGE_TOOL
    if _LANGUAGE_TOOL is None:
        try:
            _LANGUAGE_TOOL = language_tool_python.LanguageTool("en-US")
        except Exception as exc:
            print(f"warning: spellcheck init failed; skipping spellcheck ({exc})", file=sys.stderr)
            return text
    return _LANGUAGE_TOOL.correct(text)

def _dedupe_repeated_phrases(text: str) -> str:
    tokens = text.split()
    if len(tokens) < 6:
        return text
    max_window = 8
    max_passes = 3
    for _ in range(max_passes):
        i = 0
        changed = False
        while i < len(tokens):
            window = min(max_window, (len(tokens) - i) // 2)
            matched = False
            for n in range(window, 1, -1):
                a = tokens[i:i + n]
                b = tokens[i + n:i + 2 * n]
                if len(b) < n:
                    continue
                norm_a = [re.sub(r"^\W+|\W+$", "", t).lower() for t in a]
                norm_b = [re.sub(r"^\W+|\W+$", "", t).lower() for t in b]
                if norm_a == norm_b and any(norm_a):
                    del tokens[i + n:i + 2 * n]
                    changed = True
                    matched = True
                    break
            if not matched:
                i += 1
        if not changed:
            break
    return " ".join(tokens)

def _split_sentences(text: str) -> List[str]:
    parts = re.split(r"(?<=[.!?])\s+", text.strip())
    return [p.strip() for p in parts if p.strip()]

def _tokenize(text: str) -> List[str]:
    return [
        w.lower()
        for w in re.findall(r"[A-Za-z0-9']+", text)
        if len(w) > 2 and w.lower() not in _STOPWORDS
    ]

def _normalize_sentence(sentence: str) -> str:
    sentence = re.sub(r"\s+", " ", sentence).strip()
    if sentence and sentence[-1] not in ".!?":
        sentence += "."
    return sentence[0].upper() + sentence[1:] if sentence else sentence

def _extract_summary_items(sentence: str) -> List[str]:
    items: List[str] = []
    for token in re.findall(r"[A-Za-z0-9-]+", sentence):
        lower = token.lower()
        if re.fullmatch(r"CAP-?\d+", token, flags=re.IGNORECASE):
            items.append(token.upper())
            continue
        if token.isupper() and len(token) > 2:
            items.append(token)
            continue
        if lower in _SUMMARY_KEYWORDS:
            items.append(token)
            continue
        if token[0].isupper() and lower not in _STOPWORDS:
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

def _synthesize_point(sentence: str) -> str:
    items = _extract_summary_items(sentence)
    if items:
        return f"Discussion focused on {', '.join(items)}."
    return _normalize_sentence(sentence)

def summarize_key_points(blocks: List[Tuple[int, str]], max_points: int) -> List[str]:
    if not blocks or max_points <= 0:
        return []

    text = " ".join(block for _, block in blocks)
    sentences = _split_sentences(text)
    if not sentences:
        return []

    freqs: Dict[str, int] = {}
    for sentence in sentences:
        for token in _tokenize(sentence):
            freqs[token] = freqs.get(token, 0) + 1

    scored: List[Tuple[int, float, str, set]] = []
    for idx, sentence in enumerate(sentences):
        lowered = sentence.lower()
        filler_hits = len(re.findall(r"\b(yeah|okay|ok|um|uh|like|you know|sort of|kind of)\b", lowered))
        tokens = _tokenize(sentence)
        if len(tokens) < 5 or len(tokens) > 30:
            continue
        if filler_hits >= 2:
            continue
        if len(sentence) < 50:
            continue
        score = sum(freqs.get(t, 0) for t in tokens) / max(len(tokens), 1)
        keyword_bonus = sum(1 for t in tokens if t in _SUMMARY_KEYWORDS) * 0.6
        score += keyword_bonus
        scored.append((idx, score, sentence, set(tokens)))

    if not scored:
        fallback = _normalize_sentence(sentences[0])
        return [fallback] if fallback else []

    scored.sort(key=lambda x: (-x[1], x[0]))
    picked: List[str] = []
    picked_sets: List[set] = []
    picked_norm: set = set()
    for _, _, sentence, token_set in scored:
        if len(picked) >= max_points:
            break
        too_similar = False
        for prev_set in picked_sets:
            if not prev_set:
                continue
            overlap = len(prev_set & token_set) / max(len(prev_set | token_set), 1)
            if overlap > 0.6:
                too_similar = True
                break
        if too_similar:
            continue
        synthesized = _synthesize_point(sentence)
        synth_norm = re.sub(r"\s+", " ", synthesized).strip().lower()
        if synth_norm in picked_norm:
            continue
        picked.append(synthesized)
        picked_norm.add(synth_norm)
        picked_sets.append(token_set)
    return picked

def vtt_to_minute_blocks(vtt_path: pathlib.Path, block_seconds: int, punctuate: bool, spellcheck: bool) -> List[Tuple[int, str]]:
    import webvtt  # pip install webvtt-py
    buckets: Dict[int, List[str]] = {}
    for cue in webvtt.read(str(vtt_path)):
        start_s = _parse_vtt_time(cue.start)
        minute_bucket = int(start_s // block_seconds) * block_seconds
        clean = _clean_caption_text(cue.text)
        if not clean:
            continue
        items = buckets.setdefault(minute_bucket, [])
        if not items or items[-1] != clean:
            items.append(clean)

    blocks: List[Tuple[int, str]] = []
    last_norm: Optional[str] = None
    for bucket in sorted(buckets.keys()):
        joined = " ".join(buckets[bucket]).strip()
        if not joined:
            continue
        joined = _punctuate_text(joined, punctuate)
        joined = _spellcheck_text(joined, spellcheck)
        joined = _dedupe_repeated_phrases(joined)
        norm = re.sub(r"\s+", " ", joined).strip().lower()
        if norm and norm == last_norm:
            continue
        blocks.append((bucket, joined))
        last_norm = norm
    return blocks

def fetch_metadata(video_id: str, args: argparse.Namespace) -> Dict[str, str]:
    cmd = [
        sys.executable,
        "-m",
        "yt_dlp",
        "--skip-download",
        "--dump-single-json",
        f"https://www.youtube.com/watch?v={video_id}",
    ]
    if args.cookies:
        cmd.extend(["--cookies", args.cookies])
    if args.remote_components:
        cmd.extend(["--remote-components", args.remote_components])
    if args.js_runtime:
        cmd.extend(["--js-runtimes", args.js_runtime])
    if args.impersonate:
        cmd.extend(["--impersonate", args.impersonate])
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode:
        print(f"{video_id}: yt-dlp metadata failed ({proc.returncode})\n{proc.stderr}", file=sys.stderr)
        return {}
    try:
        return json.loads(proc.stdout)
    except Exception:
        return {}

def build_mdx(
    video_id: str,
    title: str,
    description: str,
    authors: List[str],
    tags: List[str],
    blocks: List[Tuple[int, str]],
    summary_points: List[str],
) -> str:
    safe_title = _yaml_escape(title)
    safe_description = _yaml_escape(description)
    front_matter_lines = [
        "---",
        f"title: \"{safe_title}\"",
        f"description: \"{safe_description}\"",
        "authors:",
    ]
    for author in authors:
        front_matter_lines.append(f"  - {author}")
    front_matter_lines.append(f"tags: [{', '.join(tags)}]")
    front_matter_lines.append("---")
    front_matter = "\n".join(front_matter_lines)

    transcript_lines = []
    prev_ended_sentence = True
    for offset, text in blocks:
        cleaned_text = text
        if cleaned_text and not prev_ended_sentence:
            cleaned_text = cleaned_text[0].lower() + cleaned_text[1:]
        transcript_lines.append(f"[{_format_timestamp(offset)}] {cleaned_text}")
        transcript_lines.append("")
        prev_ended_sentence = bool(re.search(r"[.!?]$", text.strip()))

    transcript_body = "\n".join(transcript_lines).rstrip()
    summary_block = ""
    if summary_points:
        summary_lines = [f"- {point}" for point in summary_points] + [""]
        summary_block = "\n".join(summary_lines)
    return (
        f"{front_matter}\n\n"
        "import YouTube from \"@site/src/components/YouTube\";\n\n"
        f"<YouTube ID=\"{video_id}\" />\n\n"
        f"{summary_block}\n\n"
        "<details>\n"
        "  <summary>Video Transcript</summary>\n\n"
        f"{transcript_body}\n\n"
        "</details>\n"
    )

def fetch_captions(video_id: str, out_dir: pathlib.Path, args: argparse.Namespace) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
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
        str(out_dir / f"{video_id}.%(ext)s"),
        f"https://www.youtube.com/watch?v={video_id}",
    ]
    if args.cookies:
        cmd.extend(["--cookies", args.cookies])
    if args.remote_components:
        cmd.extend(["--remote-components", args.remote_components])
    if args.js_runtime:
        cmd.extend(["--js-runtimes", args.js_runtime])
    if args.impersonate:
        cmd.extend(["--impersonate", args.impersonate])

    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode:
        print(f"{video_id}: yt-dlp failed ({proc.returncode})\n{proc.stderr}", file=sys.stderr)
        return

    vtt_files = list(out_dir.glob(f"{video_id}*.vtt"))
    if not vtt_files:
        print(f"{video_id}: no captions", file=sys.stderr)
        return

    vtt_path = max(vtt_files, key=lambda p: p.stat().st_mtime)
    if not args.create_page or args.save_txt:
        txt_path = out_dir / f"{video_id}.{args.lang}.txt"
        txt_path.write_text(vtt_to_text(vtt_path), encoding="utf-8")
        print(f"{video_id}: saved {txt_path}")

    if args.create_page:
        if not args.authors:
            args.authors = "carsten-jacobsen"
        metadata = fetch_metadata(video_id, args)
        title = args.title or metadata.get("title") or f"Meeting {video_id}"
        description = args.description or metadata.get("description", "")
        if description:
            description = description.strip().replace("\n", " ")
            description = re.sub(r"\s+", " ", description)[:180]
        tags = [t.strip() for t in (args.tags or "developer").split(",") if t.strip()]
        authors = [a.strip() for a in args.authors.split(",") if a.strip()]

        upload_date = metadata.get("upload_date")
        date_str = args.date or (f"{upload_date[:4]}-{upload_date[4:6]}-{upload_date[6:]}" if upload_date else None)
        if not date_str:
            date_str = dt.date.today().isoformat()

        blocks = vtt_to_minute_blocks(
            vtt_path,
            block_seconds=args.block_seconds,
            punctuate=args.punctuate,
            spellcheck=args.spellcheck,
        )
        summary_points = [] if args.no_summary else summarize_key_points(blocks, args.summary_points)
        if (not args.description) and (not description) and summary_points:
            description = summary_points[0]
            description = description.strip().replace("\n", " ")
            description = re.sub(r"\s+", " ", description)[:180]
        if not description:
            description = "Stellar developer meeting transcript."

        meetings_dir = pathlib.Path(args.meetings_dir)
        meetings_dir.mkdir(parents=True, exist_ok=True)
        out_path = meetings_dir / f"{date_str}.mdx"
        if out_path.exists() and not args.overwrite:
            print(f"{video_id}: {out_path} exists (use --overwrite to replace)", file=sys.stderr)
            return
        out_path.write_text(
            build_mdx(video_id, title, description, authors, tags, blocks, summary_points),
            encoding="utf-8",
        )
        print(f"{video_id}: wrote {out_path}")

    if args.create_page and not args.keep_vtt:
        for vtt_file in vtt_files:
            try:
                vtt_file.unlink()
            except OSError:
                pass
        try:
            if out_dir.exists() and not any(out_dir.iterdir()):
                out_dir.rmdir()
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
    parser.add_argument("--remote-components")
    parser.add_argument("--js-runtime")
    parser.add_argument("--impersonate")
    parser.add_argument("--create-page", action="store_true", default=True, help="Create meetings mdx page with transcript")
    parser.add_argument("--no-create-page", action="store_false", dest="create_page", help="Only export captions to text")
    parser.add_argument("--save-txt", action="store_true", help="Also save a plain text transcript")
    parser.add_argument("--keep-vtt", action="store_true", help="Keep downloaded VTT files")
    parser.add_argument("--meetings-dir", default="meetings")
    parser.add_argument("--title")
    parser.add_argument("--description")
    parser.add_argument("--authors", help="Comma-separated author ids from meetings/authors.yml")
    parser.add_argument("--tags", help="Comma-separated tags (default: developer)")
    parser.add_argument("--date", help="YYYY-MM-DD; defaults to upload date")
    parser.add_argument("--overwrite", action="store_true")
    parser.add_argument("--block-seconds", type=int, default=60)
    parser.add_argument("--punctuate", action="store_true", default=True)
    parser.add_argument("--no-punctuate", action="store_false", dest="punctuate")
    parser.add_argument("--spellcheck", action="store_true", default=True)
    parser.add_argument("--no-spellcheck", action="store_false", dest="spellcheck")
    parser.add_argument("--summary-points", type=int, default=4, help="Number of summary bullets to include")
    parser.add_argument("--no-summary", action="store_true", help="Skip summary generation")
    args = parser.parse_args()

    if not args.video and not args.list:
        args.video = input("YouTube video ID or URL: ").strip() or None
    if args.create_page and not args.authors:
        args.authors = input("Authors (comma-separated, from authors.yml): ").strip() or None
    if args.create_page and not args.tags:
        args.tags = input("Tags (comma-separated, default: developer): ").strip() or "developer"

    inputs = [args.video] if args.video else list(read_list(pathlib.Path(args.list)))
    video_ids = [vid for vid in (extract_video_id(item) for item in inputs) if vid]
    if not video_ids:
        parser.error("no valid video IDs found")

    out_dir = pathlib.Path(args.out)
    for vid in video_ids:
        fetch_captions(vid, out_dir, args)

if __name__ == "__main__":
    main()
