import { describe, test, expect, mock, beforeEach, afterEach } from "bun:test";
import { OpenAlexClient } from "../src/client.js";
import { NotFoundError, ValidationError } from "../src/errors.js";

function mockFetch(fn: (...args: any[]) => Promise<Response>) {
  globalThis.fetch = mock(fn) as unknown as typeof fetch;
}

const mockInstitution = {
  id: "https://openalex.org/I27837315",
  ror: "https://ror.org/0161xgx34",
  display_name: "University of Oxford",
  country_code: "GB",
  type: "education",
  works_count: 456789,
  cited_by_count: 12345678,
};

const mockListResponse = {
  meta: { count: 200, db_response_time_ms: 10, page: 1, per_page: 25, next_cursor: null, groups_count: null, cost_usd: 0.0001 },
  results: [mockInstitution],
  group_by: [],
};

describe("InstitutionsEndpoint", () => {
  let client: OpenAlexClient;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    client = new OpenAlexClient({ apiKey: "test-key" });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe("get", () => {
    test("fetches an institution by OpenAlex ID", async () => {
      mockFetch(() =>
        Promise.resolve(new Response(JSON.stringify(mockInstitution), { status: 200 })),
      );

      const institution = await client.institutions.get("I27837315");
      expect(institution.display_name).toBe("University of Oxford");
      expect(institution.country_code).toBe("GB");
    });

    test("fetches an institution by ROR", async () => {
      mockFetch((input: string) => {
        expect(input).toContain("/institutions/https%3A%2F%2Fror.org%2F0161xgx34");
        return Promise.resolve(new Response(JSON.stringify(mockInstitution), { status: 200 }));
      });

      await client.institutions.get("https://ror.org/0161xgx34");
    });

    test("throws ValidationError for empty ID", async () => {
      expect(client.institutions.get("")).rejects.toThrow(ValidationError);
    });

    test("throws NotFoundError for 404", async () => {
      mockFetch(() =>
        Promise.resolve(
          new Response(JSON.stringify({ error: "Not found" }), { status: 404 }),
        ),
      );

      expect(client.institutions.get("I0000000000")).rejects.toThrow(NotFoundError);
    });

    test("supports select param", async () => {
      mockFetch((input: string) => {
        expect(input).toContain("select=id%2Cdisplay_name");
        return Promise.resolve(new Response(JSON.stringify(mockInstitution), { status: 200 }));
      });

      await client.institutions.get("I27837315", { select: ["id", "display_name"] });
    });
  });

  describe("list", () => {
    test("fetches a list of institutions", async () => {
      mockFetch(() =>
        Promise.resolve(new Response(JSON.stringify(mockListResponse), { status: 200 })),
      );

      const response = await client.institutions.list({
        filter: "country_code:GB",
      });
      expect(response.results).toHaveLength(1);
      expect(response.meta.count).toBe(200);
    });

    test("supports cursor pagination", async () => {
      const cursorResponse = {
        ...mockListResponse,
        meta: { ...mockListResponse.meta, next_cursor: "abc123" },
      };

      mockFetch((input: string) => {
        expect(input).toContain("cursor=*");
        return Promise.resolve(new Response(JSON.stringify(cursorResponse), { status: 200 }));
      });

      const response = await client.institutions.list({ cursor: "*" });
      expect(response.meta.next_cursor).toBe("abc123");
    });

    test("supports sample param", async () => {
      mockFetch((input: string) => {
        expect(input).toContain("sample=50");
        return Promise.resolve(new Response(JSON.stringify(mockListResponse), { status: 200 }));
      });

      await client.institutions.list({ sample: 50 });
    });
  });
});
