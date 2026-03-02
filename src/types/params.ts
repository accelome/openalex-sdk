/** Params for single-entity GET endpoints */
export interface GetParams {
  select?: string[];
}

/** Base list params shared by all entity types */
export interface BaseListParams {
  filter?: string;
  search?: string;
  page?: number;
  per_page?: number;
  cursor?: string;
  sample?: number;
  select?: string[];
  group_by?: string;
}

// -- Works --

export type WorksSortField =
  | "cited_by_count"
  | "publication_date"
  | "relevance_score"
  | "publication_year"
  | "referenced_works_count";

export interface WorksListParams extends BaseListParams {
  sort?: WorksSortField;
  sort_order?: "asc" | "desc";
}

// -- Authors --

export type AuthorsSortField =
  | "works_count"
  | "cited_by_count"
  | "summary_stats.h_index"
  | "summary_stats.i10_index"
  | "relevance_score";

export interface AuthorsListParams extends BaseListParams {
  sort?: AuthorsSortField;
  sort_order?: "asc" | "desc";
}

// -- Institutions --

export type InstitutionsSortField =
  | "works_count"
  | "cited_by_count"
  | "summary_stats.h_index"
  | "summary_stats.i10_index"
  | "relevance_score";

export interface InstitutionsListParams extends BaseListParams {
  sort?: InstitutionsSortField;
  sort_order?: "asc" | "desc";
}
