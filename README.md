# openalex-sdk

A typed TypeScript SDK for the [OpenAlex API](https://openalex.org). Covers Works, Authors, and Institutions with full type safety, input validation, and zero runtime dependencies.

Built for [Bun](https://bun.sh).

## Quick start

```bash
bun add @accelome/openalex-sdk
```

```ts
import { OpenAlexClient } from "@accelome/openalex-sdk";

const client = new OpenAlexClient({ apiKey: "your-api-key" });

// Get a work by DOI
const work = await client.works.get("doi:10.7717/peerj.4375");
console.log(work.title, work.cited_by_count);

// Get an author by ORCID
const author = await client.authors.get("https://orcid.org/0000-0001-6187-6610");
console.log(author.display_name, author.summary_stats.h_index);

// Get an institution by ROR
const institution = await client.institutions.get("https://ror.org/0161xgx34");
console.log(institution.display_name, institution.country_code);
```

Get a free API key at [openalex.org/settings/api](https://openalex.org/settings/api).

## Configuration

```ts
const client = new OpenAlexClient({
  apiKey: "your-api-key",       // optional, required for list endpoints
  baseUrl: "https://api.openalex.org", // optional, default shown
  userAgent: "you@example.com", // optional, recommended by OpenAlex for polite pool
});
```

---

## Works

### Get a single work

Accepts OpenAlex IDs, DOIs, PMIDs, and PMCIDs.

```ts
const work = await client.works.get("W2741809807");
const work = await client.works.get("doi:10.7717/peerj.4375");
const work = await client.works.get("pmid:29456894");
```

Return only specific fields with `select`:

```ts
const work = await client.works.get("W2741809807", {
  select: ["id", "title", "doi", "cited_by_count"],
});
```

### List works

```ts
const results = await client.works.list({
  filter: "publication_year:2023,open_access.is_oa:true",
  sort: "cited_by_count",
  sort_order: "desc",
  per_page: 50,
});

console.log(results.meta.count);   // total matching works
console.log(results.results);      // Work[]
```

Available sort fields: `cited_by_count`, `publication_date`, `publication_year`, `relevance_score`, `referenced_works_count`.

#### Cursor pagination

For iterating beyond 10,000 results:

```ts
let cursor: string | null = "*";

while (cursor) {
  const page = await client.works.list({
    filter: "publication_year:2024",
    cursor,
  });

  for (const work of page.results) {
    // process work
  }

  cursor = page.meta.next_cursor;
}
```

#### Group by

```ts
const grouped = await client.works.list({
  filter: "authorships.institutions.id:I27837315",
  group_by: "publication_year",
});

for (const group of grouped.group_by) {
  console.log(group.key, group.count);
}
```

---

## Authors

### Get a single author

```ts
const author = await client.authors.get("A5023888391");
const author = await client.authors.get("https://orcid.org/0000-0001-6187-6610");
```

### List authors

```ts
const results = await client.authors.list({
  search: "machine learning",
  sort: "cited_by_count",
  sort_order: "desc",
  per_page: 10,
});
```

Available sort fields: `works_count`, `cited_by_count`, `summary_stats.h_index`, `summary_stats.i10_index`, `relevance_score`.

---

## Institutions

### Get a single institution

```ts
const inst = await client.institutions.get("I27837315");
const inst = await client.institutions.get("https://ror.org/0161xgx34");
```

### List institutions

```ts
const results = await client.institutions.list({
  filter: "country_code:GB,type:education",
  sort: "works_count",
  sort_order: "desc",
});
```

Available sort fields: `works_count`, `cited_by_count`, `summary_stats.h_index`, `summary_stats.i10_index`, `relevance_score`.

---

## Error handling

All API errors throw typed error classes that extend `OpenAlexError`:

```ts
import { NotFoundError, RateLimitError, ValidationError } from "@accelome/openalex-sdk";

try {
  await client.works.get("W0000000000");
} catch (err) {
  if (err instanceof NotFoundError) {
    console.log("Not found:", err.message);
  } else if (err instanceof RateLimitError) {
    console.log("Rate limited, retry after:", err.retryAfter, "seconds");
  } else if (err instanceof ValidationError) {
    console.log("Invalid input:", err.message);
  }
}
```

| Error class | HTTP status | When |
|---|---|---|
| `BadRequestError` | 400 | Invalid query parameters |
| `ForbiddenError` | 403 | Invalid ID format |
| `NotFoundError` | 404 | Entity does not exist |
| `RateLimitError` | 429 | Budget exceeded |
| `ValidationError` | n/a | Invalid input caught before request |

## Validation

The SDK validates inputs before making API calls:

- Entity IDs must be non-empty strings
- `page` must be a positive integer
- `per_page` must be between 1 and 200
- `cursor` and `page` cannot be used together
- `select` fields must be non-empty strings

Sort fields are enforced at the type level -- your editor will autocomplete valid values and reject invalid ones.

## Development

```bash
bun test          # run tests
bun run typecheck # type check with tsc
```

## Project structure

```
src/
  client.ts          # OpenAlexClient entry point
  http.ts            # Fetch wrapper, URL building, error mapping
  errors.ts          # Error class hierarchy
  validation.ts      # Input validation
  types/             # TypeScript interfaces for all entities and params
  endpoints/         # Works, Authors, Institutions sub-clients
tests/               # Unit tests (bun:test)
```
