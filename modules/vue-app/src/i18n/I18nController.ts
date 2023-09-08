import { useStorage } from "@vueuse/core";
import { App, computed, inject, reactive } from "vue";
import { I18nModule, I18nModuleRef } from "./I18nModules";

export type I18nController = {
  requestModules: I18nModuleRef[],
  activeLocale: string,

  load(locale: string): Promise<void>,
}

type CreateI18nCOntrollerOptions = {
  availableLocales: string[],
  staticModules?: I18nModuleRef[],

  onLoad(locale: string, modules: I18nModule[]): void,
}
export function createI18nController(opts: CreateI18nCOntrollerOptions): I18nController {
  const allModules = computed(() => {
    return [
      ...(opts?.staticModules || []),
      ...ctrl.requestModules,
    ]
  })
  const activeLocale = useStorage('vue-app.activeLocale', opts.availableLocales[0], localStorage)
  if (!opts.availableLocales.includes(activeLocale.value)) {
    activeLocale.value = opts.availableLocales[0]
  }

  async function loadTranslations(ref: I18nModuleRef) {
    if (ref.source === 'local') {
      const url = new URL(window.location.toString())
      url.pathname = `/i18n/${ref.module}/localization/${ref.file}.${activeLocale.value}.json`

      const response = await  fetch(url)
      return {ref, messages: await response.json()}
    }

    return Promise.reject(new Error(`fetching localization with [source='${ref.source}'] not implemented`))
    // const result = await fetch()
  }

  const ctrl: I18nController = reactive({
    requestModules: [],
    activeLocale,

    async load(locale) {
      const allLoaded = await Promise.allSettled(allModules.value.map(loadTranslations))
      const results = {
        values: [] as I18nModule[],
        errors: [] as any[],
      }
      for (let result of allLoaded) {
        if (result.status === 'fulfilled') {
          results.values.push(result.value)
        } else {
          results.errors.push(result.reason)
        }
      }

      if (results.errors.length) {
        console.error("could not load some translations", results.errors)
      }

      opts?.onLoad(locale, results.values)
    },
  })

  return ctrl
}

export const diKeyI18nController = '@typeful/vue-app.i18n-controller'
export function provideI18nController(app: App, ctrl: I18nController) {
  app.provide(diKeyI18nController, ctrl)
}
export const useI18nController = () => inject(diKeyI18nController) as I18nController
