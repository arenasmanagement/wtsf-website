"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CATEGORIES = [
  { value: "entertainment", label: "Entertainment" },
  { value: "tickets",       label: "Tickets & Promotions" },
  { value: "exhibits",      label: "Exhibits" },
  { value: "livestock",     label: "Livestock" },
  { value: "pageants",      label: "Pageants" },
  { value: "vendors",       label: "Vendors" },
  { value: "volunteers",    label: "Volunteers" },
  { value: "general",       label: "General Fair News" },
] as const;

type Category = (typeof CATEGORIES)[number]["value"];

interface Announcement {
  id: string;
  title: string;
  category: Category;
  summary: string;
  published: boolean;
  published_at: string | null;
  emails_sent: number;
  send_status: string;
  created_at: string;
}

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  draft:   { bg: "#F5EDD4", text: "#5C4A32", label: "Draft" },
  sending: { bg: "#DBEAFE", text: "#1E40AF", label: "Sending…" },
  sent:    { bg: "#D1FAE5", text: "#065F46", label: "Sent" },
  error:   { bg: "#FEE2E2", text: "#991B1B", label: "Error" },
};

const CAT_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.label]));

export default function UpdatesAdminDashboard() {
  const router = useRouter();

  // List state
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm]     = useState(false);
  const [title, setTitle]           = useState("");
  const [category, setCategory]     = useState<Category>("general");
  const [summary, setSummary]       = useState("");
  const [body, setBody]             = useState("");
  const [publish, setPublish]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError]   = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Preview state
  const [preview, setPreview]       = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/updates/admin/announcements");
    if (res.status === 401) { router.push("/exhibits/admin"); return; }
    const json = await res.json();
    setAnnouncements(json.data ?? []);
    setSubscriberCount(json.subscriberCount ?? 0);
    setLoading(false);
  }, [router]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleLogout() {
    await fetch("/api/exhibits/admin/auth", { method: "DELETE" });
    router.push("/exhibits/admin");
  }

  async function handlePublishDraft(id: string) {
    if (!confirm("Publish this announcement and send emails now?")) return;
    const res = await fetch(`/api/updates/admin/announcements/${id}`, { method: "PATCH" });
    const json = await res.json();
    if (!res.ok) {
      alert(json.error ?? "Failed to publish");
    } else {
      await fetchData();
    }
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!title.trim() || !summary.trim() || !body.trim()) {
      setFormError("All fields are required.");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/updates/admin/announcements", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ title, category, summary, body, publish }),
    });
    const json = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setFormError(json.error ?? "Failed to create announcement");
      return;
    }

    const msg = publish
      ? `Announcement published. ${json.emailsSent ?? 0} email(s) sent.`
      : "Announcement saved as draft.";
    setFormSuccess(msg);

    // Reset form
    setTitle(""); setSummary(""); setBody(""); setPublish(false); setShowForm(false);
    await fetchData();
  }

  const formattedDate = (iso: string) =>
    new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/Chicago",
    }).format(new Date(iso)) + " CT";

  return (
    <div style={{ backgroundColor: "#F5EDD4" }} className="min-h-screen">

      {/* ── Header ───────────────────────────────────── */}
      <div style={{ backgroundColor: "#2C4A2E" }} className="px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#D4A827" }}>
              Staff Dashboard · WTSF 2026
            </p>
            <h1
              className="text-xl font-bold italic"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5EDD4" }}
            >
              Fair Updates
            </h1>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/exhibits/admin/dashboard"
              className="px-4 py-2 text-xs font-medium border transition-opacity hover:opacity-70"
              style={{ borderColor: "rgba(245,237,212,0.3)", color: "#A8BFA9" }}
            >
              ← Exhibits
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-xs font-medium border transition-opacity hover:opacity-70"
              style={{ borderColor: "rgba(245,237,212,0.3)", color: "#A8BFA9" }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Stats ─────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Confirmed Subscribers", value: subscriberCount },
            { label: "Total Announcements",   value: announcements.length },
            { label: "Published",             value: announcements.filter((a) => a.published).length },
            { label: "Drafts",                value: announcements.filter((a) => !a.published).length },
          ].map((s) => (
            <div key={s.label} className="p-5" style={{ backgroundColor: "#fff", border: "1px solid #E8DFC8" }}>
              <p className="text-xs font-bold tracking-wide uppercase mb-1" style={{ color: "#8B7355" }}>
                {s.label}
              </p>
              <p className="text-3xl font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "#2C4A2E" }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Success banner ────────────────────────── */}
        {formSuccess && (
          <div
            className="mb-6 p-4 text-sm flex items-center justify-between"
            style={{ backgroundColor: "#D1FAE5", border: "1px solid #6EE7B7", color: "#065F46" }}
          >
            <span>{formSuccess}</span>
            <button onClick={() => setFormSuccess(null)} className="text-lg leading-none">&times;</button>
          </div>
        )}

        {/* ── Create announcement ───────────────────── */}
        <div className="mb-8">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 text-sm font-bold tracking-wider uppercase transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#D4A827", color: "#1A1A1A", letterSpacing: "0.08em" }}
            >
              + Create Announcement
            </button>
          ) : (
            <div className="p-6 sm:p-8" style={{ backgroundColor: "#fff", border: "1px solid #E8DFC8" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "#2C4A2E" }}>
                  New Announcement
                </h2>
                <button
                  onClick={() => { setShowForm(false); setFormError(null); setPreview(false); }}
                  className="text-sm"
                  style={{ color: "#8B7355" }}
                >
                  Cancel
                </button>
              </div>

              {formError && (
                <div
                  className="mb-5 p-3 text-sm"
                  role="alert"
                  style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}
                >
                  {formError}
                </div>
              )}

              {!preview ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-bold tracking-wide uppercase mb-1.5" style={{ color: "#5C4A32" }}>
                      Title <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Entertainment Lineup Announced"
                      maxLength={200}
                      className="w-full border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C4A2E] bg-white"
                      style={{ borderColor: "#D4C9A8" }}
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold tracking-wide uppercase mb-1.5" style={{ color: "#5C4A32" }}>
                      Category <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category)}
                      className="w-full border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C4A2E] bg-white"
                      style={{ borderColor: "#D4C9A8" }}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs" style={{ color: "#8B7355" }}>
                      Subscribers who opted into <strong>{CAT_LABEL[category]}</strong> will receive this email.
                    </p>
                  </div>

                  {/* Summary */}
                  <div>
                    <label className="block text-xs font-bold tracking-wide uppercase mb-1.5" style={{ color: "#5C4A32" }}>
                      Short Summary <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <textarea
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="One or two sentences that appear prominently in the email."
                      maxLength={500}
                      rows={2}
                      className="w-full border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C4A2E] bg-white resize-none"
                      style={{ borderColor: "#D4C9A8" }}
                      required
                    />
                  </div>

                  {/* Body */}
                  <div>
                    <label className="block text-xs font-bold tracking-wide uppercase mb-1.5" style={{ color: "#5C4A32" }}>
                      Full Message <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Full announcement text. Use blank lines to separate paragraphs."
                      maxLength={5000}
                      rows={8}
                      className="w-full border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C4A2E] bg-white resize-y"
                      style={{ borderColor: "#D4C9A8" }}
                      required
                    />
                  </div>

                  {/* Publish checkbox */}
                  <div
                    className="p-4 flex items-start gap-3"
                    style={{ backgroundColor: publish ? "#F0FFF4" : "#FDFAF3", border: `1px solid ${publish ? "#6EE7B7" : "#E8DFC8"}` }}
                  >
                    <input
                      id="publish"
                      type="checkbox"
                      checked={publish}
                      onChange={(e) => setPublish(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-[#2C4A2E]"
                    />
                    <div>
                      <label htmlFor="publish" className="text-sm font-bold cursor-pointer" style={{ color: "#2C4A2E" }}>
                        Publish and send emails now
                      </label>
                      <p className="text-xs mt-0.5" style={{ color: "#5C4A32" }}>
                        {publish
                          ? `This will immediately send to all confirmed ${CAT_LABEL[category]} subscribers.`
                          : "Leave unchecked to save as a draft and publish later."}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setPreview(true)}
                      className="px-5 py-2.5 text-xs font-bold tracking-wider uppercase border transition-opacity hover:opacity-70"
                      style={{ borderColor: "#D4C9A8", color: "#5C4A32" }}
                    >
                      Preview Email
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 text-sm font-bold tracking-wider uppercase transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
                      style={{
                        backgroundColor: publish ? "#D4A827" : "#2C4A2E",
                        color: publish ? "#1A1A1A" : "#D4A827",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {submitting && (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                      )}
                      {submitting ? "Processing…" : publish ? "Publish & Send" : "Save Draft"}
                    </button>
                  </div>
                </form>
              ) : (
                /* Preview panel */
                <div>
                  <div
                    className="p-5 mb-5"
                    style={{ backgroundColor: "#FDFAF3", border: "1px solid #E8DFC8" }}
                  >
                    <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#D4A827" }}>
                      West Tennessee State Fair 2026 · {CAT_LABEL[category]}
                    </p>
                    <h3 className="text-xl font-bold italic mb-3" style={{ fontFamily: "var(--font-playfair)", color: "#2C4A2E" }}>
                      {title || "(No title)"}
                    </h3>
                    <p className="text-sm italic mb-4 pb-4" style={{ color: "#5C4A32", borderBottom: "1px solid #E8DFC8" }}>
                      {summary || "(No summary)"}
                    </p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#3D3026" }}>
                      {body || "(No body)"}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setPreview(false)}
                      className="px-5 py-2.5 text-xs font-bold tracking-wider uppercase border"
                      style={{ borderColor: "#D4C9A8", color: "#5C4A32" }}
                    >
                      ← Edit
                    </button>
                    <button
                      onClick={handleSubmit as never}
                      disabled={submitting}
                      className="px-6 py-2.5 text-sm font-bold tracking-wider uppercase disabled:opacity-60"
                      style={{
                        backgroundColor: publish ? "#D4A827" : "#2C4A2E",
                        color: publish ? "#1A1A1A" : "#D4A827",
                      }}
                    >
                      {publish ? "Publish & Send" : "Save Draft"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Announcements history ─────────────────── */}
        <div>
          <h2 className="text-lg font-bold italic mb-4" style={{ fontFamily: "var(--font-playfair)", color: "#2C4A2E" }}>
            Announcement History
          </h2>

          {loading ? (
            <div className="flex justify-center py-16">
              <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#2C4A2E" strokeWidth="4" />
                <path className="opacity-75" fill="#2C4A2E" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
          ) : announcements.length === 0 ? (
            <div
              className="text-center py-12"
              style={{ backgroundColor: "#fff", border: "1px solid #E8DFC8", color: "#8B7355" }}
            >
              No announcements yet. Create one above.
            </div>
          ) : (
            <div style={{ border: "1px solid #E8DFC8", backgroundColor: "#fff" }}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: "#2C4A2E" }}>
                      {["Title", "Category", "Created", "Published", "Emails Sent", "Status", ""].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-bold tracking-widest uppercase"
                          style={{ color: "#D4A827", whiteSpace: "nowrap" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {announcements.map((a, i) => {
                      const st = STATUS_STYLE[a.send_status] ?? STATUS_STYLE.draft;
                      return (
                        <tr
                          key={a.id}
                          style={{
                            backgroundColor: i % 2 === 0 ? "#FDFAF3" : "#fff",
                            borderBottom: "1px solid #E8DFC8",
                          }}
                        >
                          <td className="px-4 py-3 font-medium" style={{ color: "#1A1A1A", maxWidth: 260 }}>
                            {a.title}
                          </td>
                          <td className="px-4 py-3 text-xs" style={{ color: "#5C4A32", whiteSpace: "nowrap" }}>
                            {CAT_LABEL[a.category] ?? a.category}
                          </td>
                          <td className="px-4 py-3 text-xs" style={{ color: "#5C4A32", whiteSpace: "nowrap" }}>
                            {formattedDate(a.created_at)}
                          </td>
                          <td className="px-4 py-3 text-xs" style={{ color: "#5C4A32", whiteSpace: "nowrap" }}>
                            {a.published_at ? formattedDate(a.published_at) : <span style={{ color: "#D4C9A8" }}>—</span>}
                          </td>
                          <td className="px-4 py-3 text-center font-bold" style={{ color: "#2C4A2E" }}>
                            {a.published ? a.emails_sent : <span style={{ color: "#D4C9A8" }}>—</span>}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className="px-2 py-1 text-xs font-bold"
                              style={{ backgroundColor: st.bg, color: st.text }}
                            >
                              {st.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {!a.published && (
                              <button
                                onClick={() => handlePublishDraft(a.id)}
                                className="text-xs font-bold tracking-wide uppercase underline hover:no-underline"
                                style={{ color: "#D4A827" }}
                              >
                                Publish
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
