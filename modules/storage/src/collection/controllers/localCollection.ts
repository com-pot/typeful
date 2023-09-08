import orderBy from "lodash/orderBy"

import {matchFilterFn} from "./localCollection/filter"
import { PaginationResult } from "@typeful/storage/collection/ListController"
import { CollectionController, CollectionOptions } from "../collection.types"

export default function localCollection<TItem>(getItems: () => TItem[], opts?: CollectionOptions<TItem>): CollectionController<TItem, 'sync'> {
  return {
    mode: 'sync',
    opts,

    retrieve: ((filter, sort, pagination) => {
      let items = getItems()
      if (filter) {
        items = items.filter(matchFilterFn(filter))
      }

      if (sort) {
        const iteratees = sort.map((s) => s[0])
        const orders = sort.map((s) => s[1])
        items = orderBy(items, iteratees, orders) as TItem[]
      }

      const perPage = pagination?.perPage || 50
      const paginationRes: PaginationResult = {
        page: pagination?.page || 1,
        perPage,
        totalItems: items.length,
      }

      const start = (paginationRes.page - 1) * perPage
      items = items.slice(start, start + perPage)

      return {
        items: items,
        filter: filter,
        sort: sort,
        pagination: paginationRes,
      }
    }),
  }
}
