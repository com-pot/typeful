import { FilterCondition, FilteringController } from "@typeful/storage-vue/collection/filter"
import getNested from "lodash/get"



type FilterTypeEvaluator = (value: any, argument: NonNullable<FilterCondition['args']>) => boolean
const filterTypeEvaluators: { [type: string]: FilterTypeEvaluator } = {
  '=': (value, [argument]) => value === argument,
  '~=': (value, [argument]) => value == argument,
  '>': (value, [argument]) => value > (argument as any),
  '>=': (value, [argument]) => value >= (argument as any),
  '<': (value, [argument]) => value < (argument as any),
  '<=': (value, [argument]) => value <= (argument as any),
  'in': (value, [argument]) => {
    if (!Array.isArray(argument)) {
      console.warn("Filter argument is not an array")
      return false
    }
    return argument.includes(value)
  },
  'like': (value, argument) => {
    if (typeof value === 'string') {
      return value.includes(argument?.[0])
    }
    console.warn("Cannot match 'like' operator with ", {value, argument});

    return false
  }
}

export function evaluateFilterCondition<T>(item: T, condition: FilterCondition): boolean {
  const value = getNested(item, condition.prop)

  const evaluator = filterTypeEvaluators[condition.op]
  if (!evaluator) {
    console.warn("No evaluator for condition type ", condition.op)
    return false
  }

  return evaluator(value, condition.args || [])
}

export function matchFilterFn<T>(filter: FilteringController['value']): (item: T) => boolean {
  return (item: T) => filter.every((condition) => {
    return evaluateFilterCondition(item, condition) === !condition.neg
  })
}
