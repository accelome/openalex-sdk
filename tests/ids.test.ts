import { describe, test, expect } from "bun:test";
import { extractId, shortenIds } from "../src/ids.js";

describe("extractId", () => {
  test("extracts OpenAlex work ID", () => {
    expect(extractId("https://openalex.org/W4400948944")).toBe("W4400948944");
  });

  test("extracts OpenAlex author ID", () => {
    expect(extractId("https://openalex.org/A5102869389")).toBe("A5102869389");
  });

  test("extracts OpenAlex institution ID", () => {
    expect(extractId("https://openalex.org/I170201317")).toBe("I170201317");
  });

  test("extracts OpenAlex source ID", () => {
    expect(extractId("https://openalex.org/S137773608")).toBe("S137773608");
  });

  test("extracts ROR ID", () => {
    expect(extractId("https://ror.org/0161xgx34")).toBe("0161xgx34");
  });

  test("extracts ORCID", () => {
    expect(extractId("https://orcid.org/0000-0003-0186-2115")).toBe("0000-0003-0186-2115");
  });

  test("extracts DOI", () => {
    expect(extractId("https://doi.org/10.1038/s41586-024-07606-7")).toBe("10.1038/s41586-024-07606-7");
  });

  test("extracts PubMed ID", () => {
    expect(extractId("https://pubmed.ncbi.nlm.nih.gov/39048816")).toBe("39048816");
  });

  test("returns non-URL strings unchanged", () => {
    expect(extractId("W4400948944")).toBe("W4400948944");
    expect(extractId("some-random-string")).toBe("some-random-string");
  });
});

describe("shortenIds", () => {
  test("shortens IDs in a flat object", () => {
    const input = {
      id: "https://openalex.org/W4400948944",
      doi: "https://doi.org/10.1038/s41586-024-07606-7",
      title: "Some paper",
      cited_by_count: 42,
    };

    const result = shortenIds(input);
    expect(result.id).toBe("W4400948944");
    expect(result.doi).toBe("10.1038/s41586-024-07606-7");
    expect(result.title).toBe("Some paper");
    expect(result.cited_by_count).toBe(42);
  });

  test("shortens IDs in nested objects", () => {
    const input = {
      id: "https://openalex.org/W123",
      authorships: [
        {
          author: {
            id: "https://openalex.org/A456",
            orcid: "https://orcid.org/0000-0001-0000-0000",
          },
          institutions: [
            {
              id: "https://openalex.org/I789",
              ror: "https://ror.org/abc123",
            },
          ],
        },
      ],
    };

    const result = shortenIds(input);
    expect(result.id).toBe("W123");
    expect(result.authorships[0]!.author.id).toBe("A456");
    expect(result.authorships[0]!.author.orcid).toBe("0000-0001-0000-0000");
    expect(result.authorships[0]!.institutions[0]!.id).toBe("I789");
    expect(result.authorships[0]!.institutions[0]!.ror).toBe("abc123");
  });

  test("shortens IDs in string arrays", () => {
    const input = {
      lineage: [
        "https://openalex.org/I170201317",
        "https://openalex.org/I999999999",
      ],
    };

    const result = shortenIds(input);
    expect(result.lineage).toEqual(["I170201317", "I999999999"]);
  });

  test("handles null and primitives", () => {
    expect(shortenIds(null)).toBeNull();
    expect(shortenIds(42)).toBe(42);
    expect(shortenIds(true)).toBe(true);
    expect(shortenIds("https://openalex.org/W1")).toBe("W1");
  });
});
