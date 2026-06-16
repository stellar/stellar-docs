import { describe, it, expect } from "vitest";
import type { UIMessage } from "ai";

import { buildCompletionsUrl, sanitizeMessages } from "./createAgentTransport";

const CONFIG = {
  appId: "VNSJF5AWIZ",
  agentId: "bf6c7577-d445-4132-9ad8-c349a0560621",
  apiKey: "key",
};

function msg(role: "user" | "assistant", parts: unknown[]): UIMessage {
  return { id: "m1", role, parts } as UIMessage;
}

describe("buildCompletionsUrl", () => {
  it("targets the Agent Studio endpoint with ai-sdk-5 compatibility and streaming", () => {
    expect(buildCompletionsUrl(CONFIG)).toBe(
      "https://vnsjf5awiz.algolia.net/agent-studio/1/agents/bf6c7577-d445-4132-9ad8-c349a0560621/completions?compatibilityMode=ai-sdk-5&stream=true",
    );
  });

  it("honors host and stream overrides", () => {
    expect(
      buildCompletionsUrl({ ...CONFIG, host: "https://example.com", stream: false }),
    ).toBe(
      "https://example.com/agent-studio/1/agents/bf6c7577-d445-4132-9ad8-c349a0560621/completions?compatibilityMode=ai-sdk-5&stream=false",
    );
  });
});

describe("sanitizeMessages", () => {
  // Regression: a failed tool call (state output-error) in history made Agent
  // Studio emit a `tool_use` block without a `tool_result`, so the LLM rejected
  // the whole conversation and every later turn failed.
  it("rewrites errored tool parts into regular outputs carrying the error", () => {
    const messages = [
      msg("assistant", [
        { type: "text", text: "Looking that up…" },
        {
          type: "tool-getPage",
          toolCallId: "toolu_123",
          state: "output-error",
          input: { url: "/docs" },
          errorText: "fetch failed",
        },
        { type: "text", text: "Here is the answer." },
      ]),
    ];

    const [out] = sanitizeMessages(messages);
    const tool = out.parts[1] as Record<string, unknown>;
    expect(tool.state).toBe("output-available");
    expect(tool.output).toEqual({ error: "fetch failed" });
    expect(tool).not.toHaveProperty("errorText");
    // Non-tool parts pass through untouched.
    expect(out.parts[0]).toEqual({ type: "text", text: "Looking that up…" });
    expect(out.parts[2]).toEqual({ type: "text", text: "Here is the answer." });
  });

  it("defaults the output error text when errorText is missing", () => {
    const [out] = sanitizeMessages([
      msg("assistant", [
        { type: "dynamic-tool", toolCallId: "t1", state: "output-error", input: {} },
      ]),
    ]);
    expect((out.parts[0] as Record<string, unknown>).output).toEqual({
      error: "Tool call failed.",
    });
  });

  it("drops tool parts that never produced an output (stopped streams)", () => {
    const [out] = sanitizeMessages([
      msg("assistant", [
        { type: "tool-search", toolCallId: "t1", state: "input-streaming" },
        { type: "tool-search", toolCallId: "t2", state: "input-available", input: {} },
        { type: "text", text: "answer" },
      ]),
    ]);
    expect(out.parts).toEqual([{ type: "text", text: "answer" }]);
  });

  it("passes successful tool parts and full conversations through unchanged", () => {
    const messages = [
      msg("user", [{ type: "text", text: "What is a trustline?" }]),
      msg("assistant", [
        { type: "step-start" },
        {
          type: "tool-algolia_search_index_docs_replica_agent",
          toolCallId: "t1",
          state: "output-available",
          input: { query: "trustline" },
          output: { hits: [] },
        },
        { type: "text", text: "A trustline is…" },
      ]),
      msg("user", [{ type: "text", text: "How do I create one?" }]),
    ];
    expect(sanitizeMessages(messages)).toEqual(messages);
  });
});
