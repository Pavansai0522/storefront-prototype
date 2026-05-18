const JOINER = ' · ';

/** Split stored `Client.timings` into weekday vs Sunday lines when joined with ` · `. */
export function parseStoreTimings(stored: string): { weekdays: string; sunday: string } {
  const s = stored.trim();
  if (!s) {
    return { weekdays: '', sunday: '' };
  }
  const idx = s.lastIndexOf(JOINER);
  if (idx === -1) {
    return { weekdays: s, sunday: '' };
  }
  return {
    weekdays: s.slice(0, idx).trim(),
    sunday: s.slice(idx + JOINER.length).trim(),
  };
}

export function joinStoreTimings(weekdays: string, sunday: string): string {
  const w = weekdays.trim();
  const u = sunday.trim();
  if (w && u) {
    return `${w}${JOINER}${u}`;
  }
  return w || u;
}
