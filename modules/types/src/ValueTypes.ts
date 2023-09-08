import { FieldRef } from "@typeful/model/Model";
import { Schema, isRefSchema, getValueKeyFromSchemaOptions } from "@typeful/schema/Schema";
import CollectionsService from "@typeful/storage/CollectionsService";
import Registry from "@typeful/utils/Registry";

export default class ValueTypes {
  public readonly registry: Registry<any> = new Registry()

  public constructor(private readonly collections?: CollectionsService) {

  }

  public getRefDefaultValue(field: FieldRef): unknown {
    if (field.schema.default) {
      return field.schema.default
    }

    let options = field.schema.options
    if (options && field.schema.multiple) {
      return []
    }
    /*
    if (options && !Array.isArray(options)) {
      if (!this.collections) {
        console.warn("Collections not available");
        return
      }

      let source: string, filter: any
      if (typeof options === "string") {
        source = options
      } else {
        source = options.source
        filter = options.filter
      }
      options = this.collections.getDefaultValue(source, filter)
    }
     */
    if (Array.isArray(options)) {
      return getFirstItemValue(options, field)
    }

    return this.getDefaultValue(field.schema)
  }

  public getDefaultValue(schema: Schema): any {
    if (schema.default) {
      return schema.default
    }

    if (Array.isArray(schema.options)) {
      return schema.options[0].value
    }

    if (schema.type === "string") {
      return ""
    }
    if (schema.type === "number") {
      return 0
    }
    if (schema.type === 'boolean') {
      return false
    }

    return null
  }

  public setDefaults(schema: Schema, target?: any): any {
    if (!schema) {
      throw new Error("No schema provided")
    }
    if (schema.type === "object") {
      if (!target) {
        target = {}
      }

      Object.entries(schema.properties || {}).forEach(([name, subSchema]) => {
        if (isRefSchema(subSchema)) {
          target[name] = null
          console.warn("No defaults setting for $ref schema", [name, subSchema]);
          return
        }
        target[name] = this.setDefaults(subSchema, target[name])
      })
    }
    if (schema.type === "array") {
      const list: any[] = target ?? []

      list.forEach((value: any, i) => {
        list[i] = this.setDefaults(schema.items, value)
      })

      return list
    }

    return target ?? this.getDefaultValue(schema)
  }
}


const getFirstItemValue = ([item]: any[], field: FieldRef) => {
  const valueKey = field.ui?.valueKey || getValueKeyFromSchemaOptions(field.schema.options) || 'value'
  return item && item[valueKey]
}
