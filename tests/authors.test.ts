import { describe, test, expect, mock, beforeEach, afterEach } from "bun:test";
import { OpenAlexClient } from "../src/client.js";
import { NotFoundError, ValidationError } from "../src/errors.js";

function mockFetch(fn: (...args: any[]) => Promise<Response>) {
  globalThis.fetch = mock(fn) as unknown as typeof fetch;
}

const mockAuthor = {
  id: "https://openalex.org/A5023888391",
  orcid: "https://orcid.org/0000-0001-6187-6610",
  display_name: "Jason Priem",
  works_count: 38,
  cited_by_count: 2135,
};

const mockListResponse = {
  meta: { count: 50, db_response_time_ms: 8, page: 1, per_page: 25, next_cursor: null, groups_count: null, cost_usd: 0.0001 },
  results: [mockAuthor],
  group_by: [],
};

describe("AuthorsEndpoint", () => {
  let client: OpenAlexClient;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    client = new OpenAlexClient({ apiKey: "test-key" });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe("get", () => {
    test("fetches an author by OpenAlex ID", async () => {
      mockFetch(() =>
        Promise.resolve(new Response(JSON.stringify(mockAuthor), { status: 200 })),
      );

      const author = await client.authors.get("A5023888391");
      expect(author.display_name).toBe("Jason Priem");
    });

    test("fetches an author by ORCID", async () => {
      mockFetch((input: string) => {
        expect(input).toContain("/authors/https%3A%2F%2Forcid.org%2F0000-0001-6187-6610");
        return Promise.resolve(new Response(JSON.stringify(mockAuthor), { status: 200 }));
      });

      await client.authors.get("https://orcid.org/0000-0001-6187-6610");
    });

    test("throws ValidationError for empty ID", async () => {
      expect(client.authors.get("")).rejects.toThrow(ValidationError);
    });

    test("throws NotFoundError for 404", async () => {
      mockFetch(() =>
        Promise.resolve(
          new Response(JSON.stringify({ error: "Not found" }), { status: 404 }),
        ),
      );

      expect(client.authors.get("A0000000000")).rejects.toThrow(NotFoundError);
    });
  });

  describe("list", () => {
    test("fetches a list of authors", async () => {
      mockFetch(() =>
        Promise.resolve(new Response(JSON.stringify(mockListResponse), { status: 200 })),
      );

      const response = await client.authors.list({ search: "Jason Priem" });
      expect(response.results).toHaveLength(1);
      expect(response.meta.count).toBe(50);
    });

    test("encodes sort with sort_order", async () => {
      mockFetch((input: string) => {
        expect(input).toContain("sort=works_count%3Adesc");
        return Promise.resolve(new Response(JSON.stringify(mockListResponse), { status: 200 }));
      });

      await client.authors.list({ sort: "works_count", sort_order: "desc" });
    });

    test("supports group_by", async () => {
      const groupedResponse = {
        ...mockListResponse,
        group_by: [{ key: "US", key_display_name: "United States", count: 10 }],
      };

      mockFetch((input: string) => {
        expect(input).toContain("group_by=last_known_institutions.country_code");
        return Promise.resolve(new Response(JSON.stringify(groupedResponse), { status: 200 }));
      });

      const response = await client.authors.list({
        group_by: "last_known_institutions.country_code",
      });
      expect(response.group_by).toHaveLength(1);
    });
  });
});
