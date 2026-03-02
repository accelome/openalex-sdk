import type {
  CountsByYear,
  DehydratedConcept,
  DehydratedInstitution,
  SummaryStats,
  TopicReference,
} from "./common.js";

export interface Author {
  id: string;
  orcid: string | null;
  display_name: string;
  display_name_alternatives: string[];
  longest_name: string;
  parsed_longest_name: ParsedName;
  works_count: number;
  cited_by_count: number;
  summary_stats: SummaryStats;
  ids: AuthorIds;
  affiliations: Affiliation[];
  last_known_institutions: DehydratedInstitution[] | null;
  topics: AuthorTopic[];
  topic_share: AuthorTopic[];
  x_concepts: DehydratedConcept[];
  counts_by_year: CountsByYear[];
  works_api_url: string;
  created_date: string;
  updated_date: string;
}

export interface AuthorIds {
  openalex: string;
  orcid: string | null;
  scopus: string | null;
}

export interface ParsedName {
  first: string | null;
  middle: string | null;
  last: string | null;
  suffix: string | null;
  nickname: string | null;
}

export interface Affiliation {
  institution: DehydratedInstitution;
  years: number[];
}

export interface AuthorTopic {
  id: string;
  display_name: string;
  count: number;
  value: number;
  subfield: TopicReference;
  field: TopicReference;
  domain: TopicReference;
}
