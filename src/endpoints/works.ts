import type { HttpClient } from "../http.js";
import type { Work } from "../types/work.js";
import type { WorksListParams } from "../types/params.js";
import { BaseEndpoint } from "./base.js";

export class WorksEndpoint extends BaseEndpoint<Work, WorksListParams> {
  constructor(http: HttpClient) {
    super(http, "works");
  }
}
