import { App, computed, inject, InjectionKey, reactive, ref, watch } from "vue"
import { TextRecipe } from "@typeful/model/recipes"

export type LoadController = {
  readonly loadingModules: Loadable[],
  readonly overallStatus: Loadable['status'],
  readonly displayLoading: boolean,

  enqueue(promise: Promise<unknown>, meta?: Omit<Loadable, 'status'>): void,
}

export type Loadable = {
  name?: TextRecipe,
  status: 'ready' | 'loading',
}

export const createLoadController = (): LoadController => {
  const loadingModules = ref<Loadable[]>([])
  const displayLoading = ref(false)

  const ctrl: LoadController = reactive({
    loadingModules: computed<Loadable[]>(() => loadingModules.value.slice()) as any,
    overallStatus: computed<Loadable['status']>(() => {
      if (loadingModules.value.some((module) => module.status === 'loading')) {
        return 'loading'
      }
      return 'ready'
    }) as any,
    displayLoading: displayLoading as any,

    enqueue(promise, meta) {
      const loadable: Loadable = reactive({
        status: 'loading',
        name: meta?.name,
      })
      loadingModules.value.push(loadable)
      promise
        .finally(() => loadable.status = 'ready')
    },
  })

  let loadingDisplayer: ReturnType<typeof setTimeout> | null = null
  watch(() => ctrl.overallStatus, (status) => {
    if (status !== 'loading') {
      loadingDisplayer && clearTimeout(loadingDisplayer)
      displayLoading.value = false
      return
    }
    loadingDisplayer = setTimeout(() => {
      displayLoading.value = true
    }, 250)
  }, {immediate: true})

  return ctrl
}

export const loadControllerInjectionKey = Symbol('vue-app.loadController') as InjectionKey<LoadController>
export const provideLoadController = (ctrl: LoadController, app: App) => {
  app.provide(loadControllerInjectionKey, ctrl)
}
export const useLoadController = (app?: App): LoadController | undefined => {
  if (app) {
    return app._context.provides[loadControllerInjectionKey as any]
  }

  return inject(loadControllerInjectionKey)
}
