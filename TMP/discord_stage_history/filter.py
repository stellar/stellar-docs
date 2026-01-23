#!/usr/bin/env python3
"""
Filter a DiscordChatExporter JSON export:

Keep only messages where type is "27" or "29" (or numeric 27/29),
and remove the following fields:
- id (everywhere)
- timestampEdited
- callEndedTimestamp
- isPinned
- author.roles
- author.isBot
- author.discriminator
- author.color
- attachments
- embeds
- stickers
- reactions
- mentions
- inlineEmojis

Usage:
  python clean_discord_export.py input.json output.json
"""

from __future__ import annotations

import json
import sys
from typing import Any, Dict, List, Union


DROP_KEYS_GLOBAL = {"id"}  # remove everywhere
DROP_KEYS_MESSAGE = {
  "timestampEdited",
  "callEndedTimestamp",
  "isPinned",
  "attachments",
  "embeds",
  "stickers",
  "reactions",
  "mentions",
  "inlineEmojis",
}
DROP_KEYS_AUTHOR = {"roles", "isBot", "discriminator", "color"}


def remove_ids_everywhere(obj: Any) -> Any:
  """Recursively remove any key named 'id' from dicts/lists."""
  if isinstance(obj, dict):
    out: Dict[str, Any] = {}
    for k, v in obj.items():
      if k in DROP_KEYS_GLOBAL:
        continue
      out[k] = remove_ids_everywhere(v)
    return out
  if isinstance(obj, list):
    return [remove_ids_everywhere(x) for x in obj]
  return obj


def normalize_type(t: Any) -> Union[str, int, None]:
  if t is None:
    return None
  if isinstance(t, int):
    return t
  if isinstance(t, str):
    s = t.strip()
    if s.isdigit():
      try:
        return int(s)
      except ValueError:
        return s
    return s
  return t


def keep_message(msg: Dict[str, Any]) -> bool:
  t = normalize_type(msg.get("type"))
  return t in (27, 29, "27", "29")


def clean_message(msg: Dict[str, Any]) -> Dict[str, Any]:
  # First drop message-level keys
  cleaned = {}
  for k, v in msg.items():
    if k in DROP_KEYS_MESSAGE:
      continue
    cleaned[k] = v

  # Clean author subfields
  author = cleaned.get("author")
  if isinstance(author, dict):
    author2 = {}
    for k, v in author.items():
      if k in DROP_KEYS_AUTHOR:
        continue
      author2[k] = v
    cleaned["author"] = author2

  return cleaned


def extract_messages(data: Any) -> List[Dict[str, Any]]:
  """
  DiscordChatExporter formats vary:
  - { "messages": [ ... ] }
  - [ ... ] (already a list of messages)
  - { ... } with nested structures
  We'll handle the common cases.
  """
  if isinstance(data, dict) and isinstance(data.get("messages"), list):
    return data["messages"]
  if isinstance(data, list):
    # assume list of message objects
    return [m for m in data if isinstance(m, dict)]
  raise ValueError("Unsupported JSON format: expected top-level list or a dict with a 'messages' array.")


def write_output(original: Any, messages_out: List[Dict[str, Any]]) -> Any:
  # Preserve original container shape where possible
  if isinstance(original, dict) and isinstance(original.get("messages"), list):
    out = dict(original)
    out["messages"] = messages_out
    return out
  # otherwise just emit the filtered list
  return messages_out


def main() -> int:
  if len(sys.argv) != 3:
    print("Usage: python clean_discord_export.py input.json output.json", file=sys.stderr)
    return 2

  in_path, out_path = sys.argv[1], sys.argv[2]

  with open(in_path, "r", encoding="utf-8") as f:
    data = json.load(f)

  # Remove ids everywhere first (including nested role ids, mention ids, etc.)
  data_no_ids = remove_ids_everywhere(data)

  # Extract -> filter -> clean messages
  messages = extract_messages(data_no_ids)
  filtered = [clean_message(m) for m in messages if keep_message(m)]

  # Re-wrap output (dict-with-messages vs list)
  out_data = write_output(data_no_ids, filtered)

  with open(out_path, "w", encoding="utf-8") as f:
    json.dump(out_data, f, ensure_ascii=False, indent=2)

  return 0


if __name__ == "__main__":
  raise SystemExit(main())
