import { useI18n } from "@typeful/vue-app/i18n";
import { useActiveModel } from "@typeful/model-vue/useModel";
import { FieldRef, GetFieldArg } from "@typeful/model/Model";
import { computed, defineComponent, h, PropType } from "vue";
import RefInput from "./RefInput"

type FieldsetFieldArg = {ref: GetFieldArg, colClass: string, props?: Record<string, any>}
export default defineComponent({
  props: {
    fields: {type: Array as PropType<FieldsetFieldArg[]>, required: true},

    label: String,
    name: String,
    locPrefix: String,
  },

  setup(props) {
    const model = useActiveModel()
    const i18n = useI18n()

    const legend = computed(() => {
      if (props.label) return props.label
      if (props.name && props.locPrefix) {
        return i18n.t(props.locPrefix + '.' + props.name)
      }
    })
    const fieldRefs = computed(() => {
      const result: {arg: FieldsetFieldArg, ref: FieldRef}[] = []

      props.fields.forEach((arg) => {
        const ref = model.value.locate().field(arg.ref);
        if (!ref.name) {
          console.warn(`No field found at '${ref.path}'`)
          return
        }

        result.push({arg, ref})
      })

      return result
    })

    return () => {
      const inputCols = fieldRefs.value.map((field) => {
        const inputNode = h(RefInput, {
          ...field.arg.props,
          fieldRef: field.ref,
        })

        return h('div', {
          class: field.arg.colClass,
        }, [inputNode])
      })

      const children = [
        h('div', {class: 'row -v-gap'}, inputCols),
      ]

      if (legend.value) {
        children.unshift(h('legend', legend.value))
      }

      return h('fieldset', children)
    }
  },
})
