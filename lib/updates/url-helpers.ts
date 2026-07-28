// Canonical URL format: /?topic=TOPIC#stay-updated (query string BEFORE hash)
export function stayUpdatedUrl(topic?: string): string {
  if (!topic) return "/#stay-updated";
  return `/?topic=${encodeURIComponent(topic)}#stay-updated`;
}

export function parseTopicFromSearch(search: string): string | null {
  try {
    const params = new URLSearchParams(search);
    const topic = params.get("topic");
    return topic && topic.length > 0 ? topic : null;
  } catch {
    return null;
  }
}
