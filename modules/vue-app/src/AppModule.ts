import { ModelSpecRaw } from "@typeful/model/Model"
import { FieldPathRaw } from "@typeful/model/path/pathTypes"
import { CollectionController } from "@typeful/storage/collection"

export type TypefulModule = {
  models?: Record<string, ModelSpecRaw>,
  modelAugments?: StripAgument[],
  getCollections?(): Record<string, CollectionController>,
}

export const defineAppModule = <T extends TypefulModule>(module: T) => module

type StripAgument = {
  model: string,

  // if we need to augment oneOf or similar specific schemas, we couls use json schema
  //  pointer path, eg 'oneOf/1/properties/address'
  path: FieldPathRaw,

  op: {
    assign: Record<string, unknown>,
  },
}

export function stripSchemaModules<T extends object>(files: T) {
  const entries = Object.entries(files)
    .map(([name, spec]) => {
      const i = name.indexOf('.schema.json')
      const newName = name.substring('./'.length, i)

      const model: ModelSpecRaw = {
        schema: {...spec},
      }
      if (model.schema.$meta) {
        model.meta = model.schema.$meta
        delete model.schema.$meta
      }

      return [newName, model]
    })

  return Object.fromEntries(entries)
}
