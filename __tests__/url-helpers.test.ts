import { describe, it, expect } from "vitest";
import { stayUpdatedUrl, parseTopicFromSearch } from "@/lib/updates/url-helpers";

describe("stayUpdatedUrl", () => {
  it("returns /#stay-updated when called with no argument", () => {
    expect(stayUpdatedUrl()).toBe("/#stay-updated");
  });

  it("returns /#stay-updated when called with undefined", () => {
    expect(stayUpdatedUrl(undefined)).toBe("/#stay-updated");
  });

  it("returns /#stay-updated when called with an empty string", () => {
    expect(stayUpdatedUrl("")).toBe("/#stay-updated");
  });

  it("encodes the topic and appends #stay-updated", () => {
    expect(stayUpdatedUrl("entertainment")).toBe("/?topic=entertainment#stay-updated");
  });

  it("percent-encodes special characters in the topic", () => {
    expect(stayUpdatedUrl("a b")).toBe("/?topic=a%20b#stay-updated");
  });

  it("encodes ampersands in the topic", () => {
    expect(stayUpdatedUrl("food & crafts")).toBe("/?topic=food%20%26%20crafts#stay-updated");
  });
});

describe("parseTopicFromSearch", () => {
  it("returns null for an empty search string", () => {
    expect(parseTopicFromSearch("")).toBeNull();
  });

  it("returns null when ?topic is absent", () => {
    expect(parseTopicFromSearch("?page=1")).toBeNull();
  });

  it("returns the topic value when present", () => {
    expect(parseTopicFromSearch("?topic=general")).toBe("general");
  });

  it("returns null when topic is an empty string", () => {
    expect(parseTopicFromSearch("?topic=")).toBeNull();
  });

  it("decodes percent-encoded values", () => {
    expect(parseTopicFromSearch("?topic=food%20%26%20crafts")).toBe("food & crafts");
  });

  it("handles multiple query params and finds topic", () => {
    expect(parseTopicFromSearch("?page=2&topic=livestock&ref=nav")).toBe("livestock");
  });

  it("returns null gracefully for a completely malformed string", () => {
    // URLSearchParams is very forgiving, so this should not throw
    const result = parseTopicFromSearch("%%invalid%%");
    expect(result === null || typeof result === "string").toBe(true);
  });
});
