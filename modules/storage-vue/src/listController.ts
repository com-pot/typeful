import { reactive} from "vue";
import { FieldRef } from "@typeful/model/Model";
import asyncRef, { AsyncRef } from "@typeful/vue-utils/asyncRef";
import { CollectionPage, PaginationConfig } from "@typeful/storage/collection/ListController";

import { createFiltering, FilteringController } from "./collection/filter"
import { createSorting, SortingConfig, SortController } from "./collection/sorting";

type ListControllerOptions<TItem = any> = {
  availableFields?: FieldRef[],

  sort?: SortingConfig,

  fetchItems: (filter: FilteringController['value'] | undefined, sort: SortController['entries'] | undefined, pagination: PaginationConfig | undefined) => CollectionPage<TItem> | Promise<CollectionPage<TItem>>
}
export function createListController<TItem = any>(opts: ListControllerOptions): ListController<TItem> {
  const filter = createFiltering(opts.availableFields || [])
  const sort = createSorting(opts.availableFields || [], opts.sort)
  const pagination = reactive<PaginationConfig>({
    page: 1,
    perPage: 10,
  })


  return {
    filter,
    sort,
    pagination,

    data: asyncRef(),

    load() {
      const items = opts.fetchItems(this.filter.value, this.sort.entries, this.pagination)
      return this.data._await('then' in items ? items : Promise.resolve(items))
    },
    getTotalPages() {
      const pagination = this.data.ready && this.data.value.pagination
      if (!pagination) {
        return
      }

      return Math.ceil(pagination.totalItems / pagination.perPage)
    },
  }
}

export type ListController<TItem=unknown> = {
  data: AsyncRef<CollectionPage<TItem>>,

  filter: FilteringController,
  sort: SortController,
  pagination: PaginationConfig,

  load(): Promise<unknown>,
  getTotalPages(): number | undefined,
}
