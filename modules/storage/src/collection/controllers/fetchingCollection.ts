import { CollectionController, CollectionOptions } from "../collection.types"

type NormalizeCallback<I, T> = (item: I) => T

type FetchingOptions<T, TKey extends string | number = number> = {
  priorityValues?: TKey[],
  getValue?: (item: T) => TKey,
  normalizeCollection?: NormalizeCallback<T[], any[]>,
} & CollectionOptions<T>

export default function fetchingCollection<T, TKey extends string | number = number>(url: string, options?: FetchingOptions<T, TKey>): CollectionController<T> {
  const getValue = options?.getValue || ((item) => item as any)

  const retrieve = async () => {
    let items = await fetch(url).then((response) => response.json()) as T[]
    if (options && options.normalizeCollection) {
      items = options.normalizeCollection(items)
    }

    if (options?.priorityValues) {
      items = pullPriorityValues(items, options.priorityValues, getValue)
    }

    return {
      items,
    }
  }

  return {
    mode: 'async',
    opts: {
      ui: options?.ui,
    },
    retrieve,
  }
}


function pullPriorityValues<T>(items: T[], priorityValues: (string | number) [], getValue: (item: T) => string | number): T[] {


  const result = items.slice()
  const prioResult: any[] = []

  priorityValues.forEach((priorityValue) => {
    const index = result.findIndex((item) => getValue(item) === priorityValue)
    if (index === -1) {
      console.warn(`Not item of priortyValue="${priorityValue}" found`)
      return
    }
    prioResult.push(...result.splice(index, 1))
  })

  return prioResult.concat(result)
}
