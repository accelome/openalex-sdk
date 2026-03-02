import { describe, test, expect, mock, beforeEach, afterEach } from "bun:test";
import { OpenAlexClient } from "../src/client.js";
import { NotFoundError, ValidationError, RateLimitError } from "../src/errors.js";

function mockFetch(fn: (...args: any[]) => Promise<Response>) {
  globalThis.fetch = mock(fn) as unknown as typeof fetch;
}

const mockWork = {
  id: "https://openalex.org/W2741809807",
  doi: "https://doi.org/10.7717/peerj.4375",
  title: "The state of OA",
  display_name: "The state of OA",
  publication_year: 2018,
  publication_date: "2018-02-13",
  type: "article",
  cited_by_count: 382,
};

const mockListResponse = {
  meta: { count: 100, db_response_time_ms: 12, page: 1, per_page: 25, next_cursor: null, groups_count: null, cost_usd: 0.0001 },
  results: [mockWork],
  group_by: [],
};

describe("WorksEndpoint", () => {
  let client: OpenAlexClient;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    client = new OpenAlexClient({ apiKey: "test-key" });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe("get", () => {
    test("fetches a work by ID", async () => {
      mockFetch(() =>
        Promise.resolve(new Response(JSON.stringify(mockWork), { status: 200 })),
      );

      const work = await client.works.get("W2741809807");
      expect(work.id).toBe("https://openalex.org/W2741809807");
      expect(work.title).toBe("The state of OA");
    });

    test("includes api_key in query string", async () => {
      mockFetch((input: string) => {
        expect(input).toContain("api_key=test-key");
        return Promise.resolve(new Response(JSON.stringify(mockWork), { status: 200 }));
      });

      await client.works.get("W2741809807");
    });

    test("encodes select as comma-separated", async () => {
      mockFetch((input: string) => {
        expect(input).toContain("select=id%2Ctitle%2Cdoi");
        return Promise.resolve(new Response(JSON.stringify(mockWork), { status: 200 }));
      });

      await client.works.get("W2741809807", { select: ["id", "title", "doi"] });
    });

    test("throws ValidationError for empty ID", async () => {
      expect(client.works.get("")).rejects.toThrow(ValidationError);
    });

    test("throws NotFoundError for 404", async () => {
      mockFetch(() =>
        Promise.resolve(
          new Response(JSON.stringify({ error: "Not found" }), { status: 404 }),
        ),
      );

      expect(client.works.get("W0000000000")).rejects.toThrow(NotFoundError);
    });

    test("throws RateLimitError for 429", async () => {
      mockFetch(() =>
        Promise.resolve(
          new Response(JSON.stringify({ error: "Rate limited" }), {
            status: 429,
            headers: { "Retry-After": "60" },
          }),
        ),
      );

      try {
        await client.works.get("W2741809807");
        expect.unreachable("Should have thrown");
      } catch (err) {
        expect(err).toBeInstanceOf(RateLimitError);
        expect((err as RateLimitError).retryAfter).toBe(60);
      }
    });
  });

  describe("list", () => {
    test("fetches a list of works", async () => {
      mockFetch(() =>
        Promise.resolve(new Response(JSON.stringify(mockListResponse), { status: 200 })),
      );

      const response = await client.works.list({ filter: "publication_year:2023" });
      expect(response.results).toHaveLength(1);
      expect(response.meta.count).toBe(100);
    });

    test("includes filter in query string", async () => {
      mockFetch((input: string) => {
        expect(input).toContain("filter=publication_year%3A2023");
        return Promise.resolve(new Response(JSON.stringify(mockListResponse), { status: 200 }));
      });

      await client.works.list({ filter: "publication_year:2023" });
    });

    test("encodes sort with sort_order", async () => {
      mockFetch((input: string) => {
        expect(input).toContain("sort=cited_by_count%3Adesc");
        return Promise.resolve(new Response(JSON.stringify(mockListResponse), { status: 200 }));
      });

      await client.works.list({ sort: "cited_by_count", sort_order: "desc" });
    });

    test("encodes sort without sort_order", async () => {
      mockFetch((input: string) => {
        expect(input).toContain("sort=cited_by_count");
        expect(input).not.toContain("sort_order");
        return Promise.resolve(new Response(JSON.stringify(mockListResponse), { status: 200 }));
      });

      await client.works.list({ sort: "cited_by_count" });
    });

    test("throws ValidationError for invalid per_page", async () => {
      expect(client.works.list({ per_page: 0 })).rejects.toThrow(ValidationError);
      expect(client.works.list({ per_page: 201 })).rejects.toThrow(ValidationError);
    });

    test("throws ValidationError for cursor + page", async () => {
      expect(client.works.list({ cursor: "*", page: 1 })).rejects.toThrow(
        ValidationError,
      );
    });

    test("works with no params", async () => {
      mockFetch(() =>
        Promise.resolve(new Response(JSON.stringify(mockListResponse), { status: 200 })),
      );

      const response = await client.works.list();
      expect(response.results).toHaveLength(1);
    });
  });
});
