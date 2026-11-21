// Where to go after logging in or signing up: the page the visitor asked for, if it is
// a path inside this site, otherwise the home page.
export function nextPath() {
  const next = new URLSearchParams(window.location.search).get("next");
  const safe = next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\");
  return safe ? next : "/";
}