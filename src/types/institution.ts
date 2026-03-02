import type {
  CountsByYear,
  DehydratedConcept,
  Geo,
  SummaryStats,
} from "./common.js";
import type { AuthorTopic } from "./author.js";

export interface Institution {
  id: string;
  ror: string | null;
  display_name: string;
  country_code: string | null;
  type: string;
  type_id: string;
  homepage_url: string | null;
  image_url: string | null;
  image_thumbnail_url: string | null;
  display_name_acronyms: string[];
  display_name_alternatives: string[];
  works_count: number;
  cited_by_count: number;
  summary_stats: SummaryStats;
  ids: InstitutionIds;
  geo: Geo;
  lineage: string[];
  associated_institutions: AssociatedInstitution[];
  repositories: Repository[];
  counts_by_year: CountsByYear[];
  roles: Role[];
  topics: AuthorTopic[];
  topic_share: AuthorTopic[];
  x_concepts: DehydratedConcept[];
  is_super_system: boolean;
  works_api_url: string;
  created_date: string;
  updated_date: string;
}

export interface InstitutionIds {
  openalex: string;
  ror: string | null;
  grid: string | null;
  wikipedia: string | null;
  wikidata: string | null;
}

export interface AssociatedInstitution {
  id: string;
  ror: string | null;
  display_name: string;
  country_code: string | null;
  type: string;
  relationship: string;
}

export interface Repository {
  id: string;
  display_name: string;
  host_organization: string | null;
  host_organization_name: string | null;
}

export interface Role {
  role: string;
  id: string;
  works_count: number;
}
