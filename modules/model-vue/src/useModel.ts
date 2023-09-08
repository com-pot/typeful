import { App, inject, isRef, provide, ref, Ref } from "vue"
import Model, { ModelSpec } from "@typeful/model/Model";
import { useValueTypes } from "@typeful/vue-app/index";
import Registry from "@typeful/utils/Registry";

export default function useModel(model: string | ModelSpec): Model {
  const types = useValueTypes()
  if (typeof model === 'object') {
    return new Model(model, {types})
  }
  const modelRegistry = useModelRegistry()
  const result = modelRegistry.items.get(model)
  if (!result) {
    throw new Error(`Model '${model}' does not exist`)
  }

  return result
}

export type ModelRegistry = Registry<Model>
export const diKeyModelRegistry = '@typeful/model.modelRegistry'
export function provideModelRegistry(registry: ModelRegistry, app?: App) {
  app ? app.provide(diKeyModelRegistry, registry) : provide(diKeyModelRegistry, registry)
}
export function useModelRegistry() {
  return inject(diKeyModelRegistry) as ModelRegistry
}

const diKeyActiveModel = '@typeful/model.activeModel'
export function provideActiveModel(model: string | Model | Ref<Model>): Ref<Model> {
  if (typeof model === "string") {
    model = useModel(model)
  }
  const modelRef = isRef(model) ? model : ref(model)
  provide(diKeyActiveModel, modelRef)
  return modelRef as Ref<Model>
}
export function useActiveModel(): Ref<Model> {
  const model = inject(diKeyActiveModel) as Ref<Model>
  if (!model) {
    console.warn("No active model provided");
  }
  return model
}

const diKeyActiveInstance = '@typeful/model.activeInstance'
export function provideModelInstanceRef<T extends object>(instance: Ref<T>) {
  if (!isRef(instance)) {
    console.warn("provideModelInstanceRef used with non-ref object", instance);
  }
  provide(diKeyActiveInstance, instance)
}
export function useModelInstanceRef<T extends object = any>(): Ref<T> {
  return inject(diKeyActiveInstance) as Ref<T>
}
