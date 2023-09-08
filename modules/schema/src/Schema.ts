import { FieldPathRaw } from "@typeful/model/path/pathTypes";
import { FilterCondition } from "@typeful/storage-vue/collection/filter";

export type Schema = {
  type: string,

  properties?: Record<string, Schema | RefSchema>,

  options?: string | any[] | OptionsObj,

  [k: string]: any,
}
export type RefSchema = {
  $ref: string,
  path?: FieldPathRaw,
}

export function isRefSchema(subject: any): subject is RefSchema {
  if (!subject || typeof subject !== "object") {
    return false
  }
  return typeof subject.$ref === "string"
}

// TODO: Move this type where it belongs. Where that is is TBD.
export type OptionsObj = {
  source: string, valueKey?: string,
  filter?: FilterCondition,
}

export const isOptionsObj = (sub?: unknown): sub is OptionsObj => {
  if (!sub || typeof sub !== 'object' || Array.isArray(sub)) {
    return false
  }

  return 'source' in sub && typeof sub.source === 'string'
}

export const getValueKeyFromSchemaOptions = (options: Schema['options']): string | undefined => {
  if (!isOptionsObj(options)) {
    return
  }
  return options.valueKey
}
