<script lang="ts" setup>
import {computed, PropType} from "vue"

import {useI18n} from "@typeful/vue-app/i18n"
import { useRenderer } from "@typeful/model/recipes";

import FilterRule from "./ComposableFilter/FilterRule.vue"
import FieldSelection from "./FieldSelection.vue"
import { FieldRef } from "@typeful/model/Model"
import { pathToStr } from "@typeful/model/path/pathTypes"
import { FilteringController } from "@typeful/storage-vue/collection/filter"

const render = useRenderer();

const props = defineProps({
  ctrl: {type: Object as PropType<FilteringController>, required: true},
})

console.log(props.ctrl);


const i18n = useI18n()

const filterFields = computed(() => props.ctrl.value
  .map((condition) => props.ctrl.fields.find((f) => f.path.strSafe === pathToStr(condition.prop))!)
  .filter((condition) => condition)
)

const addFilter = (field: FieldRef) => props.ctrl.addFilter(field.path)
</script>

<template>
  <section class="list-option -filter">
    <div class="section-heading">
      {{ i18n.t('storage.collection.section.filter') }}
      <FieldSelection :fields="ctrl.fields" :pick="addFilter" :title="i18n.t('storage.collection.action.addFilter')">
        <template v-slot:field="{field}">{{ render.refToStr(field) }}</template>
      </FieldSelection>
    </div>

    <div>
      <FilterRule v-for="(filter, i) in ctrl.value" :key="i" class="form-group"
                  :field="filterFields[i]" :filter-condition="filter"
                  @remove="ctrl.removeFilter(i)"
                  @update:filter-type="ctrl.setFilterType(i, $event)"
                  @update:args="ctrl.setArgs(i, $event)"
                  @toggle-negation="ctrl.toggleNegation(i)"
      />
    </div>
  </section>
</template>

<style lang="scss">

.filter-rule {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  > label {
    margin-inline-end: 0.5em;

    > *:not(:first-child) {
      margin-inline-start: 0.25em;
    }

    .term {
      width: 32px;
      padding: 3px;

      display: inline-grid;
      place-content: center;
    }
  }

  .filter-input {
    width: auto;
  }
}

.new-filter-fields {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  a {
    display: inline-block;
    padding: 3px 6px;
    margin: 2px;
  }
}
</style>
