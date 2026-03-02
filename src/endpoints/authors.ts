import type { HttpClient } from "../http.js";
import type { Author } from "../types/author.js";
import type { AuthorsListParams } from "../types/params.js";
import { BaseEndpoint } from "./base.js";

export class AuthorsEndpoint extends BaseEndpoint<Author, AuthorsListParams> {
  constructor(http: HttpClient) {
    super(http, "authors");
  }
}
