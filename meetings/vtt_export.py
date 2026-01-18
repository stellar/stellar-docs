#!/usr/bin/env python3
import argparse
import re
import subprocess
import sys
from pathlib import Path

YOUTUBE_ID_RE = re.compile(r"(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|\/|$)")

def extract_video_id(url_or_id: str) -> str | None:
  s = url_or_id.strip()
  if len(s) == 11 and re.fullmatch(r"[0-9A-Za-z_-]{11}", s):
    return s
  m = YOUTUBE_ID_RE.search(s)
  return m.group(1) if m else None

def read_list(path: str) -> list[str]:
  out = []
  with open(path, "r", encoding="utf-8") as f:
    for line in f:
      line = line.strip()
      if not line or line.startswith("#"):
        continue
      out.append(line)
  return out

def vtt_to_text(vtt_path: Path) -> str:
  import webvtt
  lines: list[str] = []
  for cue in webvtt.read(str(vtt_path)):
    t = cue.text.strip()
    if t:
      lines.append(t)
  return "\n".join(lines).strip() + "\n"

def fetch_captions(
  video_id: str,
  out_dir: Path,
  lang: str,
  cookies: str | None,
  js_runtime: str | None,
  impersonate: str | None,
  remote_components: str | None,
):
  out_dir.mkdir(parents=True, exist_ok=True)

  before = set(out_dir.glob(f"{video_id}*.vtt"))

  cmd = [
    sys.executable,
    "-m",
    "yt_dlp",
    "--skip-download",
    "--write-subs",
    "--write-auto-subs",
    "--sub-langs", lang,
    "--sub-format", "vtt",
    "-o", str(out_dir / f"{video_id}.%(ext)s"),
    f"https://www.youtube.com/watch?v={video_id}",
  ]

  if cookies:
    insert_at = 3 if len(cmd) >= 3 else len(cmd)
    cmd[insert_at:insert_at] = ["--cookies", cookies]
  if js_runtime:
    cmd.extend(["--js-runtimes", js_runtime])
  if impersonate:
    cmd.extend(["--impersonate", impersonate])
  if remote_components:
    cmd.extend(["--remote-components", remote_components])

  p = subprocess.run(cmd, capture_output=True, text=True)
  if p.returncode != 0:
    return f"yt-dlp_failed: {p.stderr.strip()}", None

  after = set(out_dir.glob(f"{video_id}*.vtt"))
  new_files = sorted(after - before, key=lambda x: x.stat().st_mtime, reverse=True)
  if not new_files:
    return "no_captions", None

  return "ok", new_files[0]

def main():
  ap = argparse.ArgumentParser()
  g = ap.add_mutually_exclusive_group(required=True)
  g.add_argument("--video")
  g.add_argument("--list")
  ap.add_argument("--out", default="transcripts_out")
  ap.add_argument("--lang", default="en")
  ap.add_argument("--cookies", help="Path to cookies.txt")
  ap.add_argument(
    "--remote-components",
    help="Pass through to yt-dlp --remote-components (e.g. 'ejs:github')",
  )
  ap.add_argument(
    "--js-runtime",
    help="Pass through to yt-dlp --js-runtimes (e.g. deno, node)",
  )
  ap.add_argument(
    "--impersonate",
    help="Pass through to yt-dlp --impersonate (see `yt-dlp --list-impersonate-targets`)",
  )

  args = ap.parse_args()

  out_dir = Path(args.out)
  inputs = [args.video] if args.video else read_list(args.list)

  for x in inputs:
    vid = extract_video_id(x)
    if not vid:
      print(f"Skipping (bad ID): {x}")
      continue

    status, vtt_path = fetch_captions(
      vid,
      out_dir,
      args.lang,
      args.cookies,
      args.js_runtime,
      args.impersonate,
      args.remote_components,
    )

    if status != "ok":
      print(f"{vid}: {status}")
      continue

    txt_path = out_dir / f"{vid}.{args.lang}.txt"
    txt_path.write_text(vtt_to_text(vtt_path), encoding="utf-8")
    print(f"{vid}: ok -> {txt_path}")

if __name__ == "__main__":
  main()
