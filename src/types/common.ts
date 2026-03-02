/** Pagination metadata returned by list endpoints */
export interface ListMeta {
  count: number;
  db_response_time_ms: number;
  page: number;
  per_page: number;
  next_cursor: string | null;
  groups_count: number | null;
  cost_usd: number;
}

/** Group-by result entry */
export interface GroupByResult {
  key: string;
  key_display_name: string;
  count: number;
}

/** Generic list response wrapper */
export interface ListResponse<T> {
  meta: ListMeta;
  results: T[];
  group_by: GroupByResult[];
}

export interface TopicReference {
  id: string;
  display_name: string;
}

export interface Topic {
  id: string;
  display_name: string;
  score: number;
  subfield: TopicReference;
  field: TopicReference;
  domain: TopicReference;
}

export interface CountsByYear {
  year: number;
  works_count: number;
  oa_works_count: number;
  cited_by_count: number;
}

export interface SummaryStats {
  "2yr_mean_citedness": number;
  h_index: number;
  i10_index: number;
}

export interface Geo {
  city: string | null;
  geonames_city_id: string | null;
  region: string | null;
  country_code: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface DehydratedInstitution {
  id: string;
  display_name: string;
  ror: string | null;
  country_code: string | null;
  type: string | null;
  lineage: string[];
}

export interface DehydratedConcept {
  id: string;
  wikidata: string | null;
  display_name: string;
  level: number;
  score: number;
}
