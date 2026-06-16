import { describe, it, expect } from "vitest";
import type { UIMessage } from "ai";

import {
  textParts,
  answerParts,
  hasToolCall,
  visibleAnswer,
} from "./messageParts";

function msg(parts: unknown[]): UIMessage {
  return { id: "m1", role: "assistant", parts } as UIMessage;
}

const TOOL = {
  type: "tool-algolia_search_index_docs_replica_agent",
  toolCallId: "t1",
  state: "output-available",
  input: {},
  output: {},
};

describe("textParts", () => {
  it("collects non-empty text segments in order", () => {
    expect(
      textParts(msg([{ type: "text", text: "a" }, TOOL, { type: "text", text: " " }, { type: "text", text: "b" }])),
    ).toEqual(["a", "b"]);
  });
});

describe("answerParts", () => {
  it("returns only text after the last tool call (drops status chatter)", () => {
    expect(
      answerParts(
        msg([
          { type: "text", text: "Let me find that…" },
          TOOL,
          { type: "text", text: "Searching more…" },
          { ...TOOL, toolCallId: "t2" },
          { type: "text", text: "The real answer." },
        ]),
      ),
    ).toEqual(["The real answer."]);
  });

  it("returns all text when there are no tool calls", () => {
    expect(answerParts(msg([{ type: "text", text: "plain answer" }]))).toEqual([
      "plain answer",
    ]);
  });

  it("recognizes dynamic-tool parts as tool calls", () => {
    expect(
      answerParts(
        msg([
          { type: "text", text: "chatter" },
          { type: "dynamic-tool", toolCallId: "t1", state: "output-available" },
          { type: "text", text: "answer" },
        ]),
      ),
    ).toEqual(["answer"]);
  });
});

describe("visibleAnswer", () => {
  const streamingNoTool = msg([{ type: "text", text: "Let me find that…" }]);
  const streamingWithTool = msg([
    { type: "text", text: "Let me find that…" },
    TOOL,
    { type: "text", text: "answer so far" },
  ]);

  it("hides pre-tool chatter while streaming when hideUntilTool is on", () => {
    expect(visibleAnswer(streamingNoTool, true, true)).toEqual([]);
  });

  it("shows streamed text once a tool call has happened", () => {
    expect(visibleAnswer(streamingWithTool, true, true)).toEqual([
      "answer so far",
    ]);
  });

  it("shows text while streaming when hideUntilTool is off (no-tool agents)", () => {
    expect(visibleAnswer(streamingNoTool, true, false)).toEqual([
      "Let me find that…",
    ]);
  });

  it("always shows the final answer once streaming ends", () => {
    expect(visibleAnswer(streamingNoTool, false, true)).toEqual([
      "Let me find that…",
    ]);
  });
});

describe("hasToolCall", () => {
  it("detects tool-* and dynamic-tool parts", () => {
    expect(hasToolCall(msg([TOOL]))).toBe(true);
    expect(hasToolCall(msg([{ type: "dynamic-tool" }]))).toBe(true);
    expect(hasToolCall(msg([{ type: "text", text: "x" }]))).toBe(false);
  });
});
