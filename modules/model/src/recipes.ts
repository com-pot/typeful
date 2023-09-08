import { useI18n } from "vue-i18n";
import { FieldNotFoundRef, FieldRef } from "./Model";

export function useRenderer() {
  const i18n = useI18n()

  return {
    stringify(val: TextRecipe): string | null {
      if (typeof val === 'object' && val.$t) {
        return i18n.t(val.$t)
      }
      if (typeof val === 'string') {
        return val
      }

      console.warn("Unable to stringify", val);

      return null
    },

    refToStr(ref: FieldRef | FieldNotFoundRef) {
      if (ref.name === false) {
        console.warn("Unknown field", ref);
        return "---"
      }
      if (ref.ui?.label) {
        return ref.ui.label
      }

      return i18n.t(ref.modelMeta.name + '._p.' + ref.path.join('.'))
    },
  }
}

export type TextRecipe = string | {$t: string}
