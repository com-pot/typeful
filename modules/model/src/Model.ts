import { O } from "ts-toolbelt";
import { isRefSchema, RefSchema, Schema } from "@typeful/schema/Schema";
import { createPath, FieldPath, FieldPathRaw, isFieldPath, pathToStr } from "./path/pathTypes";
import { Recipe } from "@typeful/types/Recipe";
import ValueTypes from "@typeful/types/ValueTypes";
import { merge } from "lodash";

export default class Model<T extends object = any> {

  private readonly fieldLocators: Record<string, FieldLocator> = {}
  public readonly spec: ModelSpec

  constructor(spec: ModelSpec, private readonly ctx: ModelContext) {
    this.fieldLocators[''] = new FieldLocator(FieldIndex.createFromSchema(spec.schema, spec.meta))
    this.spec = spec
  }

  locate(path?: FieldPath | FieldPathRaw): FieldLocator {
    const key = path ? pathToStr(path) : ''
    return this.fieldLocators[key]
  }

  setDefaults(target?: O.Partial<T, 'deep'>): T {
    return this.ctx.types.setDefaults(this.spec.schema, target)
  }
}

export type FieldRef = {
  name: string,
  path: FieldPath,
  schema: Schema,

  modelMeta: ModelSpec['meta'],

  ui?: Record<string, any> & {
    createLabel?: ((item: any) => string) | {prefix: string} | Recipe,
  },
}
export type FieldNotFoundRef = {
  name: false,
  path: FieldPath,
}

export type GetFieldArg = FieldPathRaw | {path: FieldPathRaw, ui?: FieldRef['ui']}
export type ModelContext = {types: ValueTypes}

class FieldLocator {

  constructor(private fieldIndex: FieldIndex) {}

  public field(arg: GetFieldArg, fallback?: 'not-found'): FieldRef | FieldNotFoundRef
  public field(arg: GetFieldArg, fallback: 'null'): FieldRef | null
  public field(arg: GetFieldArg, fallback: 'not-found' | 'null' = 'not-found') {
    if (!isFieldPath(arg)) {
      return merge({}, this.field(arg.path), arg)
    }

    const candidate = this.fieldIndex.find(arg)
    const entry = candidate?.field
    if (!entry) {
      if (fallback === "null") {
        return null
      }

      return {
        name: false,
        path: createPath(...arg),
      }
    }
    return entry
  }

  fields(args: GetFieldArg[]): (FieldRef|FieldNotFoundRef)[]
  fields(args: GetFieldArg[], filterMissing: 'silent' | 'warn'): FieldRef[]
  fields(args: 'all'): FieldRef[]
  fields(args: GetFieldArg[] | 'all', filterMissing?: 'silent' | 'warn') {
    if (args === 'all') {
      return this.fieldIndex.list()
    }

    const fields = args.map((arg) => this.field(arg))

    if (filterMissing) {
      return fields.filter((ref) => {
        if (ref.name) return true
        if (filterMissing === 'warn') {
          console.warn(`No field found at '${ref.path}'`);
        }

        return false
      })
    }

    return fields
  }
}

class FieldIndex {

  constructor(private index: Record<string, FieldIndexEntryCandidate[]>) {

  }

  find(path: FieldPathRaw) {
    const candidates = this.index[pathToStr(path)]
    return candidates?.[0]
  }
  list() {
    return Object.values(this.index)
      .map((fieldCandidates) => fieldCandidates.find((candidate) => !candidate.if)?.field!)
      .filter(Boolean)
  }

  static createFromSchema(schema: Schema, modelMeta: ModelSpec['meta']) {
    const index: FieldIndex['index'] = {}

    type WalkEntry = [FieldPath, Schema | RefSchema]
    const toWalk: WalkEntry[] = [
      [createPath(), schema]
    ]

    let pair: WalkEntry
    while (pair = toWalk.shift()!) {
      const [path, schema] = pair

      if (isRefSchema(schema)) {
        console.warn("Indexing RefSchema not supported");
        continue
      }

      if (schema.type === 'object') {
        Object.entries(schema.properties || {}).forEach(([name, schema]) => {
          toWalk.push([createPath(...path, name), schema])
        })
        continue
      }

      const pathStr = pathToStr(path)
      if (!index[pathStr]) {
        index[pathStr] = []
      }

      const candidate: FieldIndexEntryCandidate = {
        field: {
          name: path[path.length - 1],
          path: path,
          schema,
          modelMeta,
        },
      }
      if (schema['x-ui']) {
        candidate.field.ui = schema['x-ui']
        delete schema['x-ui']
      }
      index[pathStr].push(candidate)
    }

    return new FieldIndex(index)
  }
}

type FieldIndexEntryCandidate = {
  if?: Recipe,
  field: FieldRef,
}

export type ModelSpec = {
  meta: {
    name: string,
  },

  schema: Schema & {type: "object"},
}

export type ModelSpecRaw = {
  meta?: {
    name?: string,
    injectTo?: string,
  },

  schema: ModelSpec['schema'],
}

export const defineModel = <T extends ModelSpec|ModelSpecRaw>(spec: T) => spec
