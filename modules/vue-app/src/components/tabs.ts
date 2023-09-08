import { reactive } from "vue"

export function useTabs(tabs: TabSpec[]) {
  return reactive({
    tabs,
    value: tabs[0].name,
  })
}

type TabSpec = {name: string}
