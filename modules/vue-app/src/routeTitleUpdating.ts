import { computed, reactive, ref } from "vue"

import { TextRecipe } from "@typeful/model/recipes"


export function useAppTitle(appName?: string, separator: string = ' | ') {
  const title = reactive({
    appName: ref(appName),
    separator: ref(separator),
    pageName: computed({
      get() {
        let titleStr = document.title
        const suffix = title.appName ? title.separator + title.appName : ''

        if (suffix && titleStr.endsWith(suffix)) {
          titleStr = titleStr.substring(0, -suffix.length)
        }

        return titleStr
      },
      set(value) {
        const result: string = value && title.appName
          ? value + title.separator + title.appName
          : value || title.appName || ''

        return document.title = result
      },
    })
  })

  return title
}

declare module 'vue-router' {
  interface RouteMeta {
    title?: TextRecipe
  }
}
