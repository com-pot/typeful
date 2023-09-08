<script lang="ts" setup >
import {computed, PropType} from "vue"
import {Tippy} from "vue-tippy"

import {DecInput} from "@typeful/vue-form"
import { FieldRef } from "@typeful/model/Model"
import { FilterCondition } from "@typeful/storage-vue/collection/filter";
import { useI18n } from "@typeful/vue-app/i18n";
import { useRenderer } from "@typeful/model/recipes";

const props = defineProps({
  filterCondition: {type: Object as PropType<FilterCondition>, required: true},
  field: {type: Object as PropType<FieldRef>, required: true},
})

const i18n = useI18n()
const render = useRenderer()

const inputAttrs = computed(() => {
  return {
    ...props.field.schema,
    ...props.field.ui,
  }
})

const availableOperators = computed(() => {
  const schema = props.field.schema

  if (typeof schema.options === "string") {
    return ['=']
  }
  if (schema.type === 'string') {
    return ['=', 'like']
  }

  return ['=', '>', '>=', '<', '<=']
})
</script>

<template>
  <div class="filter-rule">
    <label>
      <span class="badge badge-light text-danger" @click="$emit('remove')">&times;</span>
      <span>{{ render.refToStr(field) }}</span>
      <span @click.prevent="$emit('toggle-negation')" class="term">{{ i18n.t('storage.collection.filter.match-' + !filterCondition.neg) }}</span>

      <Tippy interactive>
        <template #content>
          <button v-for="option in availableOperators" :key="option" class="btn btn-sm btn-light"
                  @click="$emit('update:filter-type', option)">
            {{ option }}
          </button>
        </template>
        <template #default>
          <span class="term">{{ filterCondition.op }}</span>
        </template>
      </Tippy>
    </label>

    <DecInput class="filter-input" v-bind="inputAttrs"
       :model-value="filterCondition.args?.[0] ?? null"
       @update:model-value="$emit('update:args', [$event])"
    />
  </div>
</template>
