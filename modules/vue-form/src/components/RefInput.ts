import { useActiveModel, useModelInstanceRef } from "@typeful/model-vue/useModel";
import { FieldNotFoundRef, FieldRef } from "@typeful/model/Model";
import { FieldPathRaw } from "@typeful/model/path/pathTypes";
import { useValueTypes } from "@typeful/vue-app/index";
import { get, set } from "lodash";
import { computed, defineComponent, h, PropType } from "vue";
import { useI18n } from "vue-i18n";
import DecInput from "./DecInput.ts";

export default defineComponent({
  inheritAttrs: false,

  props: {
    path: {type: [String, Array] as PropType<string | FieldPathRaw>},
    fieldRef: {type: Object as PropType<FieldRef>},
    modelValue: {},
  },
  setup(props, {emit, slots, attrs}) {
    const model = useActiveModel()
    const instance = useModelInstanceRef()
    const i18n = useI18n()
    const valueTypes = useValueTypes()

    const pathRaw = computed((): FieldPathRaw | undefined => {
      if (!props.path) {
        return
      }
      if (Array.isArray(props.path)) {
        return props.path
      }
      if (typeof props.path === 'string') {
        return props.path.split('.')
      }
      console.warn("Unknown path prop", props.path);
    })
    const fieldRef = computed<FieldRef | FieldNotFoundRef | undefined>(() => {
      if (props.fieldRef) {
        return props.fieldRef
      }
      if (pathRaw.value) {
        return model.value.locate().field(pathRaw.value)
      }
    })

    const internalValue = typeof props.modelValue !== "undefined"
     ? computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
     })
     : computed({
      get: () => {
        const fRef = fieldRef.value
        if (!instance.value || !fRef) {
          console.warn("Invalid state for RefInput", {instance: instance.value, fRef});
          return undefined
        }
        if (!fRef.name) {
          console.warn("FieldRef got unfound field", fRef);
          return undefined
        }

        return get(instance.value, fRef.path) ?? valueTypes.getRefDefaultValue(fRef)
      },
      set: (value) => {
        const fRef = fieldRef.value
        if (!instance.value || !fRef) {
          return console.warn("Invalid state for RefInput", {instance: instance.value, fRef});
        }
        if (!fRef.name) {
          return console.warn("FieldRef got unfound field", fRef);
        }

        set(instance.value, fRef.path, value)
      }
     })

     return () => {
      const fRef = fieldRef.value
      if (!fRef?.name) {
        console.warn("Field not found at", fRef?.path);
        return
      }

      // const slottedChildren = Object.entries(slots).map(([name, slot]) => {
      //   return h(() => slot, {slot: name})
      // })

      return h(DecInput, {
        ...fRef.schema,
        label: i18n.t(`${fRef.modelMeta.name}._p.${fRef.path.join('.')}`),
        ...fRef.ui,
        ...attrs,

        modelValue: internalValue.value,
        'onUpdate:modelValue': (value: any) => internalValue.value = value,

        name: fRef.name,
      }, slots)
     }
  },
})
