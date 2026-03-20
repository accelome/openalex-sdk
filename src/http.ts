import {
  OpenAlexError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  RateLimitError,
} from "./errors.js";
import { shortenIds } from "./ids.js";

export interface HttpClientConfig {
  baseUrl: string;
  apiKey?: string;
  userAgent?: string;
  shortIds?: boolean;
}

export class HttpClient {
  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private readonly userAgent?: string;
  private readonly shortIds: boolean;

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.apiKey = config.apiKey;
    this.userAgent = config.userAgent;
    this.shortIds = config.shortIds ?? false;
  }

  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const url = this.buildUrl(path, params);

    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (this.userAgent) {
      headers["User-Agent"] = this.userAgent;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      await this.handleErrorResponse(response, url);
    }

    const data = (await response.json()) as T;
    return this.shortIds ? shortenIds(data) : data;
  }

  private buildUrl(path: string, params?: Record<string, unknown>): string {
    const url = new URL(`${this.baseUrl}${path}`);

    if (this.apiKey) {
      url.searchParams.set("api_key", this.apiKey);
    }

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null) continue;

        if (key === "select" && Array.isArray(value)) {
          url.searchParams.set("select", value.join(","));
        } else if (key === "sort" && params["sort_order"]) {
          url.searchParams.set("sort", `${value}:${params["sort_order"]}`);
        } else if (key === "sort_order") {
          // Handled together with sort above
          continue;
        } else {
          url.searchParams.set(key, String(value));
        }
      }
    }

    return url.toString();
  }

  private async handleErrorResponse(
    response: Response,
    url: string,
  ): Promise<never> {
    let errorBody: { error?: string; message?: string } = {};
    try {
      const text = await response.text();
      errorBody = JSON.parse(text);
    } catch {
      // Response may not be JSON
    }

    const message =
      errorBody.message ?? errorBody.error ?? response.statusText;

    switch (response.status) {
      case 400:
        throw new BadRequestError(message, response.status, url);
      case 403:
        throw new ForbiddenError(message, response.status, url);
      case 404:
        throw new NotFoundError(message, response.status, url);
      case 429: {
        const retryAfter = response.headers.get("Retry-After");
        throw new RateLimitError(
          message,
          response.status,
          url,
          retryAfter ? parseInt(retryAfter, 10) : undefined,
        );
      }
      default:
        throw new OpenAlexError(message, response.status, url);
    }
  }
}
