import type {
  CountsByYear,
  DehydratedConcept,
  DehydratedInstitution,
  Topic,
} from "./common.js";

export interface Work {
  id: string;
  doi: string | null;
  title: string;
  display_name: string;
  publication_year: number;
  publication_date: string | null;
  type: string;
  language: string | null;
  is_retracted: boolean;
  is_paratext: boolean;
  indexed_in: string[];

  ids: WorkIds;

  // Citation metrics
  cited_by_count: number;
  citation_normalized_percentile: CitationPercentile | null;
  cited_by_percentile_year: CitedByPercentileYear | null;
  fwci: number | null;
  counts_by_year: CountsByYear[];

  // Locations
  primary_location: Location | null;
  best_oa_location: Location | null;
  locations: Location[];
  locations_count: number;

  // Open access
  open_access: OpenAccess;

  // Authors
  authorships: Authorship[];
  corresponding_author_ids: string[];
  corresponding_institution_ids: string[];
  countries_distinct_count: number;
  institutions_distinct_count: number;

  // Topics & classification
  primary_topic: Topic | null;
  topics: Topic[];
  keywords: Keyword[];
  concepts: DehydratedConcept[];
  mesh: MeSH[];
  sustainable_development_goals: SDG[];

  // References
  referenced_works: string[];
  referenced_works_count: number;
  related_works: string[];

  // Funding
  funders: Funder[];
  awards: Award[];

  // Bibliographic
  biblio: Biblio | null;
  abstract_inverted_index: Record<string, number[]> | null;

  // Content
  has_fulltext: boolean;

  // APC
  apc_list: APC | null;
  apc_paid: APC | null;

  // Timestamps
  created_date: string;
  updated_date: string;
}

export interface WorkIds {
  openalex: string;
  doi: string | null;
  mag: string | null;
  pmid: string | null;
  pmcid: string | null;
}

export interface Location {
  is_oa: boolean;
  landing_page_url: string | null;
  pdf_url: string | null;
  source: Source | null;
  license: string | null;
  license_id: string | null;
  version: string | null;
  is_accepted: boolean;
  is_published: boolean;
}

export interface Source {
  id: string;
  display_name: string;
  issn_l: string | null;
  issn: string[] | null;
  is_oa: boolean;
  is_in_doaj: boolean;
  is_core: boolean;
  host_organization: string | null;
  host_organization_name: string | null;
  type: string;
}

export interface OpenAccess {
  is_oa: boolean;
  oa_status: "diamond" | "gold" | "green" | "hybrid" | "bronze" | "closed";
  oa_url: string | null;
  any_repository_has_fulltext: boolean;
}

export interface Authorship {
  author_position: "first" | "middle" | "last";
  author: DehydratedAuthor;
  institutions: DehydratedInstitution[];
  countries: string[];
  is_corresponding: boolean;
  raw_affiliation_strings: string[];
}

export interface DehydratedAuthor {
  id: string;
  display_name: string;
  orcid: string | null;
}

export interface Keyword {
  id: string;
  display_name: string;
  score: number;
}

export interface MeSH {
  descriptor_ui: string;
  descriptor_name: string;
  qualifier_ui: string | null;
  qualifier_name: string | null;
  is_major_topic: boolean;
}

export interface SDG {
  id: string;
  display_name: string;
  score: number;
}

export interface Funder {
  id: string;
  display_name: string;
  ror: string | null;
}

export interface Award {
  id: string;
  display_name: string;
  funder_award_id: string;
  funder_id: string;
  funder_display_name: string;
  doi: string | null;
}

export interface Biblio {
  volume: string | null;
  issue: string | null;
  first_page: string | null;
  last_page: string | null;
}

export interface CitationPercentile {
  value: number;
  is_in_top_1_percent: boolean;
  is_in_top_10_percent: boolean;
}

export interface CitedByPercentileYear {
  min: number;
  max: number;
}

export interface APC {
  value: number;
  currency: string;
  value_usd: number;
  provenance: string;
}
