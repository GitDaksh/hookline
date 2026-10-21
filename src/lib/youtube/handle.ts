/** A way to find one channel: by its @handle or by its channel ID (UC…). */
export type ChannelRef = { kind: "handle"; handle: string } | { kind: "id"; id: string };

const CHANNEL_ID = /^UC[\w-]{22}$/;
// YouTube handles: 3 to 30 letters (any language), numbers, underscores, hyphens or periods.
const HANDLE = /^[\p{L}\p{M}\p{N}_.-]{3,30}$/u;
const YOUTUBE_LINK = /^(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/([^?#]+)/i;

/**
 * Understands what someone typed: "@mkbhd", "mkbhd", "youtube.com/@mkbhd",
 * "https://www.youtube.com/channel/UC…" or a bare channel ID. Returns null if it can't.
 */
export function parseChannelInput(input: string): ChannelRef | null {
  let value = input.trim();
  if (!value) return null;

  const link = YOUTUBE_LINK.exec(value);
  if (link) {
    const [first, second] = (link[1] ?? "").split("/");
    if (first?.startsWith("@")) value = first;
    else if (first === "channel" && second) value = second;
    // Old-style links (youtube.com/c/name, /user/name). Most of these names became handles.
    else if ((first === "c" || first === "user") && second) value = `@${second}`;
    else return null;
  }

  value = safeDecode(value);

  if (value.startsWith("@")) {
    const handle = value.slice(1);
    return HANDLE.test(handle) ? { kind: "handle", handle: handle.toLowerCase() } : null;
  }
  if (CHANNEL_ID.test(value)) return { kind: "id", id: value };
  return HANDLE.test(value) ? { kind: "handle", handle: value.toLowerCase() } : null;
}

/** The Hookline page for a channel, like /youtube/mkbhd. */
export function channelPath(ref: ChannelRef): string {
  return `/youtube/${encodeURIComponent(ref.kind === "handle" ? ref.handle : ref.id)}`;
}

/** How to show a ref to people: "@mkbhd", or the channel ID. */
export function describeChannelRef(ref: ChannelRef): string {
  return ref.kind === "handle" ? `@${ref.handle}` : ref.id;
}

/** Decodes %-escapes (like %40 for @) and leaves anything else untouched. */
export function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
