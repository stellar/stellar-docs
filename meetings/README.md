# Developer Meetings

This folder contains the meeting posts and a helper script to generate new
meeting pages from a YouTube video ID (11 characters).

## Script

`meetings/new-meeting.py`

What it does:

- Downloads YouTube captions (VTT) via `yt_dlp`.
- Builds a transcript with 1-minute blocks.
- Adds punctuation and spellcheck.
- Creates a new `meetings/YYYY-MM-DD.mdx` page with front-matter and YouTube
  embed.

What it doesn't do:

- Draft a perfect description.
- Add a helpful resources section.
- Pull the actual meeting date when different from video upload date.
- Handle days when there are multiple meetings to put together.

### Requirements

Python 3.9+ and a virtual environment.

### Setup

```bash
python -m venv .venv
.\.venv\Scripts\activate
pip install yt_dlp webvtt-py deepmultilingualpunctuation language_tool_python
```

Spellcheck requires Java (used by `language_tool_python`). If Java isn’t
installed, spellcheck will be skipped with a warning.

Java install (any platform):

- Install a [recent JDK](https://www.oracle.com/java/technologies/downloads)
  (Java 17+ recommended).
- Make sure `java` is on your PATH (`java -version` should work).

### Basic usage

Run and answer the prompts:

```bash
python meetings/add-transcript-box.py
```

<!-- removable -->

Or pass values directly:

```bash
python meetings/add-transcript-box.py \
  --video VIDEO_ID \
  --authors name-slug \
  --tags developer
```

This will:

- Download captions into memory (no `transcripts_out/` file by default)
- Create `meetings/YYYY-MM-DD.mdx` using the YouTube upload date

## Notes

- `--authors` must match IDs in `meetings/authors.yml`.
- Use `--no-create-page` to skip MDX generation and only export captions.
- Use `--save-txt` to also write `transcripts_out/VIDEO_ID.en.txt` or use
  `--keep-vtt` to keep raw closed-caption files.
