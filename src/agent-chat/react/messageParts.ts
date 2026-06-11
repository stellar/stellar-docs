import type { UIMessage } from "ai";

/** Collect every non-empty text segment of a message, in order. */
export function textParts(message: UIMessage): string[] {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => (part as { text: string }).text)
    .filter((text) => text.trim().length > 0);
}

/**
 * The agent emits short status lines ("Let me find that…") before each tool
 * call, then the real answer as the final text run. Return only the text that
 * comes after the last tool call so we show the answer, not the chatter.
 */
export function answerParts(message: UIMessage): string[] {
  let lastToolIndex = -1;
  message.parts.forEach((part, index) => {
    if (part.type.startsWith("tool-") || part.type === "dynamic-tool") {
      lastToolIndex = index;
    }
  });
  return message.parts
    .map((part, index) => ({ part, index }))
    .filter(({ part, index }) => part.type === "text" && index > lastToolIndex)
    .map(({ part }) => (part as { text: string }).text)
    .filter((text) => text.trim().length > 0);
}

export function hasToolCall(message: UIMessage): boolean {
  return message.parts.some(
    (part) => part.type.startsWith("tool-") || part.type === "dynamic-tool",
  );
}

/**
 * Text to show for an assistant message. While it's still streaming, the
 * pre-tool status chatter ("Let me find that…") would otherwise flash in and
 * then vanish once a tool call arrives, so (when `hideUntilTool`) we reveal
 * nothing until a tool call has happened. Once streaming finishes, show the
 * final answer regardless.
 */
export function visibleAnswer(
  message: UIMessage,
  streaming: boolean,
  hideUntilTool: boolean,
): string[] {
  if (streaming && hideUntilTool && !hasToolCall(message)) {
    return [];
  }
  return answerParts(message);
}
