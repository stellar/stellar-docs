#!/usr/bin/env python3
from pathlib import Path

TRANSCRIPTS_DIR = Path("transcripts_out")
OUT_DIR = TRANSCRIPTS_DIR / "long_context"

def join_segments(segments):
    buffer = []
    for segment in segments:
        buffer.append(segment.strip())
        joined = " ".join(buffer)
        if len(joined) > 80 or segment.endswith(".") or segment.endswith("!") or segment.endswith("?"):
            yield joined
            buffer = []
    if buffer:
        yield " ".join(buffer)

def normalize(sentence):
    sentence = sentence.strip()
    if not sentence:
        return ""
    sentence = sentence[0].upper() + sentence[1:]
    if sentence[-1] not in ".!?":
        sentence += "."
    return sentence

def rebuild(path):
    data = path.read_text(encoding="utf-8").splitlines()
    segments = [line for line in (seg for seg in data) if line.strip()]
    sentences = [normalize(s) for s in join_segments(segments)]
    if not sentences:
        return
    out_path = OUT_DIR / f"{path.stem}.long.txt"
    out_path.parent.mkdir(exist_ok=True)
    out_path.write_text(" ".join(sentences) + "\n", encoding="utf-8")
    print("rewrote", out_path)

def main():
    for path in sorted(TRANSCRIPTS_DIR.glob("*.en.txt")):
        rebuild(path)

if __name__ == "__main__":
    main()
