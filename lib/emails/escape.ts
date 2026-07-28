/** Escape HTML special characters so admin-authored text renders as plain text in email HTML */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/** Convert plain text line breaks to HTML <br> tags (after escaping) */
export function nl2br(text: string): string {
  return escapeHtml(text).replace(/\n/g, "<br>");
}

/** Log-safe masked email: keeps domain, masks local part */
export function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at <= 0) return "[redacted]";
  const local = email.slice(0, at);
  const domain = email.slice(at);
  const visible = local.length > 2 ? local[0] + "*".repeat(Math.min(local.length - 2, 4)) : "**";
  return visible + domain;
}
