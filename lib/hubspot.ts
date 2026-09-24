// Reads HubSpot's own first-party tracking cookie so it can be forwarded to
// CB intake for lead attribution. Returns undefined (not an empty string)
// when the cookie isn't present — e.g. before HubSpot's tracking script is
// live on this site — so callers can omit the key entirely rather than
// sending a meaningless empty value.
export default function getHubspotutkCookie(): string | undefined {
  return document.cookie
    .split('; ')
    .find((c) => c.startsWith('hubspotutk='))
    ?.split('=')[1];
}
