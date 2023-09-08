import { reactive } from "vue";

export function useWorkingCopy<T = any>(initialValue: T | null = null) {
  return reactive({
    value: initialValue,
    origin: 'init' as ValueOrigin,

    init(value: T, origin: ValueOrigin = 'init') {
      this.value = value
      this.origin = origin
    },
    discard() {
      this.value = null
      this.origin = 'init'
    },
  })
}

export type ValueOrigin = 'init' | 'store'
