import { defineComponent, watch } from "vue";
import asyncRef from "@typeful/vue-utils/asyncRef";
import { Schema } from "@typeful/schema/Schema";
import { useCollections } from "@typeful/storage-vue/collections";
import { useI18n } from "vue-i18n";
import { compileRecipeEvalFn } from "@typeful/types/Recipe";

import {computed, h} from "vue"
import { FormKit } from "@formkit/vue"
import { useInputRegistry } from "../inputRegistry"
import { getValueKeyFromSchemaOptions } from "@typeful/schema/Schema"
import { FilterCondition } from "@typeful/storage-vue/collection/filter";

export default defineComponent({
  inheritAttrs: false,
  emits: {
    'update:modelValue': (value: any) => value !== undefined,
  },
  props: {
    modelValue: {},
    labelAction: Function,
  },

  setup(props, {attrs, slots, emit}) {
    const inputRegistry = useInputRegistry()
    const collections = useCollections()
    const i18n = useI18n()

    const dependencies = asyncRef<Record<string, unknown>>(Promise.resolve({}))
    const collectionRef = computed(() => {
      const options = (attrs.options || attrs.enum) as Schema['options']
      if (!options || Array.isArray(options)) {
        return null
      }

      let source: string, filter: FilterCondition[] | undefined = undefined
      if (typeof options === 'string') {
        source = options
      } else {
        source = options.source
        filter = options.filter && (Array.isArray(options.filter) ? options.filter : [options.filter])
      }
      const collection = collections.getCollection(source)

      return {source, collection, filter}
    })

    const valueKey = computed(() => {
      if (collectionRef.value) {
        return collectionRef.value.collection.opts?.valueKey || 'value'
      }

      const valueKey = typeof attrs.valueKey === 'string' && attrs.valueKey
      return valueKey || getValueKeyFromSchemaOptions((attrs.schema as any)?.options) || 'value'
    })
    const getValue = (option: any): string | number => {
      if (typeof option === 'object') {
        return option[valueKey.value]
      }

      return option
    }
    const createLabelFn = computed(() => {
      const collection = collectionRef.value?.collection
      const createLabel = collection?.opts?.ui?.createLabel
      if (!createLabel || typeof createLabel === 'function') {
        return createLabel
      }
      if ('prefix' in createLabel) {
        return (option: any) => i18n.t(createLabel.prefix + getValue(option))
      }

      if (createLabel.type === 'template') {
        return compileRecipeEvalFn(createLabel.template)
      }

      console.warn("itemLabelTemplate value not recognized", createLabel)
      return null
    })

    watch(collectionRef, (ref) => {
      if (!ref) return
      const {collection, filter} = ref

      dependencies._await((async () => {
        let options = await collections.fetchItems(collection, undefined, filter)

        if (createLabelFn.value) {
          options = options.map((option: any) => {
            const value = getValue(option)
            return ({ ...option, label: createLabelFn.value!(option), value })
          })
        }

        return {options}
      })())
    }, {immediate: true})

    const componentProps = computed(() => {
      const entry = inputRegistry.matchInput(attrs);

      const inAttrs: any = {
        ...attrs,
        ...(dependencies.ready && dependencies.value || null),

        inputClass: 'form-control',
        outerClass: '',
      }

      return Object.assign(inAttrs, entry?.formkit)
    })

    return () => {
      if (!dependencies.ready) {
        return h('div', {class: 'loader'}, ['loading...'])
      }

      return h(FormKit, {
        ...componentProps.value,

        modelValue: props.modelValue,
        'onUpdate:modelValue': (value: any) => emit('update:modelValue', value),
      }, slots)
    }
  },
})
