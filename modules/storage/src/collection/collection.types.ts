import { FieldPathRaw } from "@typeful/model/path/pathTypes";
import { SortController } from "@typeful/storage/collection/sorting";
import { FilteringController } from "@typeful/storage-vue/collection/filter";
import { CollectionPage, PaginationConfig } from "@typeful/storage/collection/ListController";
import { Recipe } from "@typeful/types/Recipe";

export type CollectionRetrieveFn<T = any, Mode extends AsyncableMode = AsyncableMode> = (
  filter?: FilteringController['value'],
  sort?: SortController['entries'],
  pagination?: PaginationConfig
) => AsyncableResult<Mode, CollectionPage<T>>

export type AsyncableMode = 'sync' | 'async'
export type AsyncableResult<Mode extends AsyncableMode, TResult> = Mode extends 'sync'
  ? TResult
  : Mode extends 'async'
    ? Promise<TResult>
    : TResult | Promise<TResult>

export type CollectionOptions<TItem> = {
  valueKey?: string,
  ui?: {
    createLabel?: {prefix: string} | {type: 'template', template: Recipe} | ((item: TItem) => string),
  },
}

export type CollectionController<TItem = any, Mode extends AsyncableMode = AsyncableMode> = {
  mode?: Mode,
  opts?: CollectionOptions<TItem>,
  retrieve: CollectionRetrieveFn<TItem, Mode>,
  searchParam?: FieldPathRaw,
}
