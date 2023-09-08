import { FieldRef } from "@typeful/model/Model"
import { FieldPathRaw } from "@typeful/model/path/pathTypes"

export type SortDirection = 'asc'|'desc'
export type SortOption = [FieldPathRaw, SortDirection]

export type SortController = {
  availableFields: FieldRef[],

  entries: SortOption[],
}
