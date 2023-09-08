import {reactive} from "vue"

import { createPath, FieldPath, FieldPathRaw, pathSame, pathToStr } from "@typeful/model/path/pathTypes";
import { FieldNotFoundRef, FieldRef } from "@typeful/model/Model";
import { SortController as $SortController } from "@typeful/storage/collection/sorting";


export type SortingConfig = {
  toggleRemove: boolean,
  defaultSorting?: FieldRef['path'] | FieldPathRaw,
}


export const createSorting = (availableFields: FieldRef[], config?: SortingConfig) => {
  const sort = reactive({
    availableFields,
    entries: [] as $SortController['entries'],

    toggleSort(prop: FieldPath | FieldPathRaw) {
      const propPath = ('strSafe' in prop) ? prop : createPath(...prop)

      const index = sort.entries.findIndex(([path]) => pathSame(path, propPath))
      if (index === -1) {
        sort.entries.push([propPath, 'asc'])
        return
      }

      const sortEntry = sort.entries[index];
      let newEntry: typeof sortEntry | null = null
      if (sortEntry[1] === 'asc') {
        newEntry = [sortEntry[0], 'desc']
      } else if (!config?.toggleRemove) {
        newEntry = [sortEntry[0], 'asc']
      }

      if (newEntry) {
        sort.entries[index] = newEntry
      } else {
        sort.entries.splice(index, 1)
      }
    },
    remove(i: number) {
      sort.entries.splice(i, 1)
    },
    getFieldRef(prop: FieldPathRaw): FieldRef | FieldNotFoundRef {
      const ref = availableFields.find((f) => f.path.strSafe === pathToStr(prop))
      return ref || {name: false, path: createPath(...prop)}
    },
  })

  if (config?.defaultSorting) {
    sort.toggleSort(config.defaultSorting)
  }

  return sort
}

export type SortController = ReturnType<typeof createSorting>
