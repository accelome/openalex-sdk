const OPENALEX_URL_PREFIXES = [
  "https://openalex.org/",
  "https://ror.org/",
  "https://orcid.org/",
  "https://doi.org/",
  "https://pubmed.ncbi.nlm.nih.gov/",
  "https://www.wikidata.org/entity/",
  "https://en.wikipedia.org/wiki/",
];

/**
 * Extract the short ID from an OpenAlex URL.
 *
 * "https://openalex.org/W4400948944" → "W4400948944"
 * "https://ror.org/0161xgx34"       → "0161xgx34"
 * "https://orcid.org/0000-0001..."   → "0000-0001..."
 *
 * Returns the input unchanged if it's not a recognized URL.
 */
export function extractId(value: string): string {
  for (const prefix of OPENALEX_URL_PREFIXES) {
    if (value.startsWith(prefix)) {
      return value.slice(prefix.length);
    }
  }
  return value;
}

/**
 * Recursively walk a parsed JSON response and shorten all OpenAlex-style
 * URL strings to their short ID form.
 */
export function shortenIds<T>(data: T): T {
  if (typeof data === "string") {
    return extractId(data) as T;
  }
  if (Array.isArray(data)) {
    return data.map(shortenIds) as T;
  }
  if (data !== null && typeof data === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      out[key] = shortenIds(value);
    }
    return out as T;
  }
  return data;
}
