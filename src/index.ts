// Main client
export { OpenAlexClient } from "./client.js";
export type { OpenAlexConfig } from "./client.js";

// Entity types
export type {
  Work,
  WorkIds,
  Location,
  Source,
  OpenAccess,
  Authorship,
  DehydratedAuthor,
  Keyword,
  MeSH,
  SDG,
  Funder,
  Award,
  Biblio,
  CitationPercentile,
  CitedByPercentileYear,
  APC,
} from "./types/work.js";

export type {
  Author,
  AuthorIds,
  ParsedName,
  Affiliation,
  AuthorTopic,
} from "./types/author.js";

export type {
  Institution,
  InstitutionIds,
  AssociatedInstitution,
  Repository,
  Role,
} from "./types/institution.js";

// Common types
export type {
  ListMeta,
  GroupByResult,
  ListResponse,
  TopicReference,
  Topic,
  CountsByYear,
  SummaryStats,
  Geo,
  DehydratedInstitution,
  DehydratedConcept,
} from "./types/common.js";

// Query param types
export type {
  GetParams,
  BaseListParams,
  WorksListParams,
  WorksSortField,
  AuthorsListParams,
  AuthorsSortField,
  InstitutionsListParams,
  InstitutionsSortField,
} from "./types/params.js";

// ID utilities
export { extractId, shortenIds } from "./ids.js";

// Error classes (value exports for instanceof checks)
export {
  OpenAlexError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  RateLimitError,
  ValidationError,
} from "./errors.js";
