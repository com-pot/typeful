import { App } from "vue"
import { createI18n } from "vue-i18n"
import { createI18nController, provideI18nController } from "./i18n/I18nController"
import { I18nModuleRef } from "./i18n/I18nModules"
import { useLoadController } from "./loadController"

type I18nPluginOptions = {
  locales?: string[],

  fallbackLocale?: string,
  staticModules?: I18nModuleRef[],
}

export default {
  install(app: App, opts?: I18nPluginOptions) {
    const availableLocales = opts?.locales ?? ['en_GB']

    const i18nController = createI18nController({
      availableLocales,

      staticModules: opts?.staticModules,
      onLoad(locale, modules) {
        const messages = Object.assign({}, ...modules.map((module) => module.messages))
        i18n.global.setLocaleMessage(locale, messages)
      }
    })

    const i18n = createI18n({
      legacy: false,

      availableLocales,
      fallbackLocale: opts?.fallbackLocale ?? availableLocales[0],
      locale: i18nController.activeLocale,
    })

    provideI18nController(app, i18nController)

    const localizationLoaded = i18nController.load(i18n.global.locale.value)
      // .then(() => new Promise((res) => setTimeout(res, 2000)))

    const loadController = useLoadController(app)
    loadController?.enqueue(localizationLoaded, {
      name: 'localization'
    })

    app.use(i18n)
  }
}
