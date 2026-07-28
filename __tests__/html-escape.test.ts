import { describe, it, expect } from "vitest";
import { escapeHtml, nl2br, maskEmail } from "@/lib/emails/escape";

describe("escapeHtml", () => {
  it("returns plain text unchanged", () => {
    expect(escapeHtml("Hello World")).toBe("Hello World");
  });

  it("escapes ampersands", () => {
    expect(escapeHtml("A & B")).toBe("A &amp; B");
  });

  it("escapes less-than and greater-than", () => {
    expect(escapeHtml("<script>alert(1)</script>")).toBe(
      "&lt;script&gt;alert(1)&lt;/script&gt;"
    );
  });

  it("escapes double quotes", () => {
    expect(escapeHtml(`He said "hello"`)).toBe("He said &quot;hello&quot;");
  });

  it("escapes single quotes", () => {
    expect(escapeHtml("it's a test")).toBe("it&#x27;s a test");
  });

  it("handles multiple special chars in one string", () => {
    expect(escapeHtml(`<b class="x">O'Reilly & Co</b>`)).toBe(
      "&lt;b class=&quot;x&quot;&gt;O&#x27;Reilly &amp; Co&lt;/b&gt;"
    );
  });

  it("escapes an empty string without error", () => {
    expect(escapeHtml("")).toBe("");
  });
});

describe("nl2br", () => {
  it("converts newlines to <br> and escapes HTML", () => {
    expect(nl2br("line1\nline2")).toBe("line1<br>line2");
  });

  it("escapes < in content before converting newlines", () => {
    expect(nl2br("<b>bold</b>\nnext")).toBe("&lt;b&gt;bold&lt;/b&gt;<br>next");
  });

  it("handles empty string", () => {
    expect(nl2br("")).toBe("");
  });
});

describe("maskEmail", () => {
  it("masks a normal email address", () => {
    const masked = maskEmail("subscriber@example.com");
    expect(masked).toContain("@example.com");
    expect(masked).not.toContain("subscriber");
  });

  it("leaves only the first char of the local part visible", () => {
    const masked = maskEmail("john@example.com");
    expect(masked.startsWith("j")).toBe(true);
    expect(masked).toContain("@example.com");
  });

  it("returns [redacted] for an email with no local part", () => {
    expect(maskEmail("@example.com")).toBe("[redacted]");
  });

  it("returns [redacted] for a string with no @", () => {
    expect(maskEmail("notanemail")).toBe("[redacted]");
  });

  it("handles very short local parts", () => {
    const masked = maskEmail("a@b.com");
    expect(masked).toContain("@b.com");
  });
});
