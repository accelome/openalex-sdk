import { HttpClient } from "./http.js";
import { WorksEndpoint } from "./endpoints/works.js";
import { AuthorsEndpoint } from "./endpoints/authors.js";
import { InstitutionsEndpoint } from "./endpoints/institutions.js";

export interface OpenAlexConfig {
  /** API key from https://openalex.org/settings/api */
  apiKey?: string;
  /** Base URL override (defaults to https://api.openalex.org) */
  baseUrl?: string;
  /** User-Agent / email for polite pool identification */
  userAgent?: string;
}

export class OpenAlexClient {
  readonly works: WorksEndpoint;
  readonly authors: AuthorsEndpoint;
  readonly institutions: InstitutionsEndpoint;

  constructor(config: OpenAlexConfig = {}) {
    const http = new HttpClient({
      baseUrl: config.baseUrl ?? "https://api.openalex.org",
      apiKey: config.apiKey,
      userAgent: config.userAgent,
    });

    this.works = new WorksEndpoint(http);
    this.authors = new AuthorsEndpoint(http);
    this.institutions = new InstitutionsEndpoint(http);
  }
}
