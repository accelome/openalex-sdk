import { describe, test, expect } from "bun:test";
import { validateId, validateListParams, validateSelect } from "../src/validation.js";
import { ValidationError } from "../src/errors.js";

describe("validateId", () => {
  test("accepts valid ID strings", () => {
    expect(() => validateId("W2741809807")).not.toThrow();
    expect(() => validateId("https://doi.org/10.7717/peerj.4375")).not.toThrow();
    expect(() => validateId("pmid:29456894")).not.toThrow();
  });

  test("rejects empty string", () => {
    expect(() => validateId("")).toThrow(ValidationError);
  });

  test("rejects whitespace-only string", () => {
    expect(() => validateId("   ")).toThrow(ValidationError);
  });
});

describe("validateListParams", () => {
  test("accepts valid params", () => {
    expect(() => validateListParams({ page: 1, per_page: 25 })).not.toThrow();
    expect(() => validateListParams({ cursor: "*" })).not.toThrow();
    expect(() => validateListParams({ sample: 100 })).not.toThrow();
    expect(() => validateListParams({})).not.toThrow();
  });

  test("rejects page < 1", () => {
    expect(() => validateListParams({ page: 0 })).toThrow(ValidationError);
    expect(() => validateListParams({ page: -1 })).toThrow(ValidationError);
  });

  test("rejects non-integer page", () => {
    expect(() => validateListParams({ page: 1.5 })).toThrow(ValidationError);
  });

  test("rejects per_page out of range", () => {
    expect(() => validateListParams({ per_page: 0 })).toThrow(ValidationError);
    expect(() => validateListParams({ per_page: 201 })).toThrow(ValidationError);
  });

  test("rejects negative sample", () => {
    expect(() => validateListParams({ sample: -1 })).toThrow(ValidationError);
    expect(() => validateListParams({ sample: 0 })).toThrow(ValidationError);
  });

  test("rejects cursor + page together", () => {
    expect(() => validateListParams({ cursor: "*", page: 1 })).toThrow(
      ValidationError,
    );
  });
});

describe("validateSelect", () => {
  test("accepts valid field arrays", () => {
    expect(() => validateSelect(["id", "title", "doi"])).not.toThrow();
    expect(() => validateSelect(["display_name"])).not.toThrow();
  });

  test("rejects empty array", () => {
    expect(() => validateSelect([])).toThrow(ValidationError);
  });

  test("rejects array with empty strings", () => {
    expect(() => validateSelect(["id", ""])).toThrow(ValidationError);
  });
});
