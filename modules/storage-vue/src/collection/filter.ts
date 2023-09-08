import {reactive} from "vue"
import { FieldPathRaw, pathSame } from "@typeful/model/path/pathTypes"

import { FieldRef } from "@typeful/model/Model"


type FilterType = '=' | '~=' | '>' | '<' | '>=' | '<=' | 'in' | 'like'

export type FilterCondition<TArgs = any[]> = {
  prop: FieldPathRaw,
  op: FilterType,
  args?: TArgs,
  neg?: boolean,
}

export const createFiltering = (fields: FieldRef[]) => {
  return reactive({
    fields,
    value: [] as FilterCondition[],

    addFilter(prop: FilterCondition['prop'], op: FilterType = '=', args?: FilterCondition['args']) {
      const iExisting = this.value.findIndex((condition) => pathSame(prop, condition.prop))
      if (iExisting !== -1) {
        this.removeFilter(iExisting)
      }

      this.value.push(reactive({
        prop: prop,
        op,
        args,
      }))
    },
    removeFilter(i: number) {
      this.value.splice(i, 1)
    },
    setFilterType(i: number, filterType: FilterType) {
      this.value[i].op = filterType
    },
    setArgs(i: number, args: any) {
      this.value[i].args = args
    },
    toggleNegation(i: number) {
      if (this.value[i].neg) {
        delete this.value[i].neg
      } else {
        this.value[i].neg = true
      }
    },
  })
}

export type FilteringController = ReturnType<typeof createFiltering>
