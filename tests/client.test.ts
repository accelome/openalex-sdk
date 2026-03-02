import { describe, test, expect } from "bun:test";
import { OpenAlexClient } from "../src/client.js";
import { WorksEndpoint } from "../src/endpoints/works.js";
import { AuthorsEndpoint } from "../src/endpoints/authors.js";
import { InstitutionsEndpoint } from "../src/endpoints/institutions.js";

describe("OpenAlexClient", () => {
  test("creates client with default config", () => {
    const client = new OpenAlexClient();
    expect(client.works).toBeInstanceOf(WorksEndpoint);
    expect(client.authors).toBeInstanceOf(AuthorsEndpoint);
    expect(client.institutions).toBeInstanceOf(InstitutionsEndpoint);
  });

  test("creates client with api key", () => {
    const client = new OpenAlexClient({ apiKey: "test-key" });
    expect(client.works).toBeInstanceOf(WorksEndpoint);
  });

  test("creates client with custom base URL", () => {
    const client = new OpenAlexClient({ baseUrl: "https://custom.api.org" });
    expect(client.works).toBeInstanceOf(WorksEndpoint);
  });

  test("sub-clients are readonly properties", () => {
    const client = new OpenAlexClient();
    expect(client).toHaveProperty("works");
    expect(client).toHaveProperty("authors");
    expect(client).toHaveProperty("institutions");
  });
});
