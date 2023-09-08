import {AsyncableMode, CollectionController, CollectionRetrieveFn} from "./collection";
import { CollectionPage, PaginationConfig } from "@typeful/storage/collection/ListController";
import { SortController } from "@typeful/storage/collection/sorting";
import { FilteringController } from "@typeful/storage-vue/collection/filter";
import Registry from "@typeful/utils/Registry";


export default class CollectionsService {
  public readonly registry: Registry<CollectionController>

  constructor(registry?: Registry<CollectionController>) {
    this.registry = registry || new Registry()
  }

  public addCollection(name: string, retrieve: CollectionRetrieveFn, searchParam?: CollectionController['searchParam']): this {
    this.registry.put(name, {retrieve, searchParam})
    return this
  }

  public fetchItems<T>(source: string | CollectionController<T>, search?: string, filter?: FilteringController['value'], sort?: SortController['entries']): T[] | Promise<T[]> {
    const collection = typeof source === 'string' ? this.getCollection<T>(source) : source
    const result = fetchFromItemSource(collection, search, filter, sort)

    if (result instanceof Promise) {
      return result.then(normalize)
    }

    return normalize(result.items)
  }

  public getDefaultValue(sourceName: string, filter?: FilteringController['value']) {
    const collection = this.getCollection(sourceName, 'sync')
    if (!collection) {
      console.warn(`Collection '${sourceName}' does not provide sync values`);

      return
    }

    return normalize(fetchFromItemSource(collection, undefined, filter))
  }

  public fetchCollection<T>(
    sourceName: string, search?: string,
    filter?: FilteringController['value'],
    sort?: SortController['entries'],
    pagination?: PaginationConfig
  ): CollectionPage<T> | Promise<CollectionPage<T>> {
    const normalize = (result: CollectionPage<T> | T[]): CollectionPage<T> => {
      if (!result) {
        console.warn("No result on item source", sourceName)
        return {items: []}
      }
      if (Array.isArray(result)) {
        return { items: result }
      }

      return result
    }

    const result = fetchFromItemSource(this.getCollection<T>(sourceName), search, filter, sort, pagination)

    if (result instanceof Promise) {
      return result.then(normalize)
    }

    return normalize(result)
  }

  public getCollection<TItem = unknown>(sourceName: string): CollectionController<TItem>
  public getCollection<TItem = unknown, TMode extends AsyncableMode = AsyncableMode>(sourceName: string, mode: TMode): CollectionController<TItem, TMode> | null
  public getCollection<TItem = unknown, TMode extends AsyncableMode = AsyncableMode>(sourceName: string, mode?: TMode)  {
    const entry = this.registry.items.get(sourceName) as CollectionController<TItem, TMode>
    if (!entry) {
      console.warn("Existing item sources: ", this.registry.items.keys());
      throw new Error(`Items source '${sourceName}' does not exist`)
    }
    if (mode && entry.mode !== mode) {
      return null
    }
    return entry
  }
}

function normalize<T = unknown>(result: CollectionPage<T> | T[]): T[] {
  if (!result) {
    console.warn("No result on item source")
    return []
  }
  if (Array.isArray(result)) {
    return result
  }

  return result.items
}

function fetchFromItemSource<TMode extends AsyncableMode, TItem = unknown>(
  entry: CollectionController<TItem, TMode>,
  search?: string,
  filter?: FilteringController['value'],
  sort?: SortController['entries'],
  pagination?: PaginationConfig,
) {
  if (search) {
    if (entry.searchParam) {
      filter = filter?.slice() ?? []

      filter.push({
        prop: entry.searchParam,
        op: 'like',
        args: [search],
      })
    } else {
      console.warn("Search passed to an items collection without searchParam")
    }
  }

  return entry.retrieve(filter, sort, pagination)
}
