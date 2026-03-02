import type { HttpClient } from "../http.js";
import type { ListResponse } from "../types/common.js";
import type { GetParams, BaseListParams } from "../types/params.js";
import { validateId, validateListParams, validateSelect } from "../validation.js";

export abstract class BaseEndpoint<TEntity, TListParams extends BaseListParams> {
  protected readonly http: HttpClient;
  protected readonly entityPath: string;

  constructor(http: HttpClient, entityPath: string) {
    this.http = http;
    this.entityPath = entityPath;
  }

  async get(id: string, params?: GetParams): Promise<TEntity> {
    validateId(id);
    if (params?.select) {
      validateSelect(params.select);
    }

    const queryParams: Record<string, unknown> = {};
    if (params?.select) {
      queryParams["select"] = params.select;
    }

    return this.http.get<TEntity>(
      `/${this.entityPath}/${encodeURIComponent(id)}`,
      Object.keys(queryParams).length > 0 ? queryParams : undefined,
    );
  }

  async list(params?: TListParams): Promise<ListResponse<TEntity>> {
    if (params) {
      validateListParams(params);
      if (params.select) {
        validateSelect(params.select);
      }
    }

    const queryParams: Record<string, unknown> = { ...params };

    return this.http.get<ListResponse<TEntity>>(
      `/${this.entityPath}`,
      Object.keys(queryParams).length > 0 ? queryParams : undefined,
    );
  }
}
