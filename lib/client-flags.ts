/**
 * Browser-side markers for the public site.
 *
 * Once someone has sent an enquiry the site offers "Open dashboard" instead of
 * "Start a project" — read from the navbar, the home page and the closing band,
 * so they agree. Only a flag is kept: the dashboard code itself stays in the
 * client's own records, never in the browser.
 */
export const HAS_PROJECT_KEY = "elephants-foot:has-project";

/** True when this browser has sent an enquiry before. */
export function hasProjectFlag() {
  try {
    return window.localStorage.getItem(HAS_PROJECT_KEY) === "1";
  } catch {
    // Storage can be blocked (private windows, strict settings). The plain
    // "Start a project" link still works, so this stays a soft failure.
    return false;
  }
}

/** Fired in this tab when the flag is set — `storage` only reaches other tabs. */
export const PROJECT_FLAG_EVENT = "elephants-foot:project";

/** Remembers that this browser sent an enquiry. */
export function rememberProject() {
  try {
    window.localStorage.setItem(HAS_PROJECT_KEY, "1");
  } catch {
    // Same as above: nothing here is load-bearing.
  }
  window.dispatchEvent(new Event(PROJECT_FLAG_EVENT));
}
