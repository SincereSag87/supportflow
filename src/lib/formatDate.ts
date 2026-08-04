const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;

  if (diff < MINUTE) {
    return "Just now";
  }

  if (diff < HOUR) {
    const minutes = Math.floor(diff / MINUTE);
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  if (diff < 2 * DAY) {
    return "Yesterday";
  }

  if (diff < 7 * DAY) {
    const days = Math.floor(diff / DAY);
    return `${days} days ago`;
  }

  return new Date(then).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Due dates are stored as plain "YYYY-MM-DD" strings so they bind
// directly to <input type="date"> without timezone conversion.
export function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) {
    return false;
  }

  const today = new Date().toISOString().slice(0, 10);

  return dueDate < today;
}

export function formatDueDate(dueDate: string | null): string {
  if (!dueDate) {
    return "No due date";
  }

  const [year, month, day] = dueDate.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
