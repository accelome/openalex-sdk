import type { HttpClient } from "../http.js";
import type { Institution } from "../types/institution.js";
import type { InstitutionsListParams } from "../types/params.js";
import { BaseEndpoint } from "./base.js";

export class InstitutionsEndpoint extends BaseEndpoint<Institution, InstitutionsListParams> {
  constructor(http: HttpClient) {
    super(http, "institutions");
  }
}
