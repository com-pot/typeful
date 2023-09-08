<script lang="ts" setup>
import {PropType} from "vue"
import {useI18n} from "@typeful/vue-app/i18n"
import { FieldRef } from "@typeful/model/Model"
import { SortController } from "@typeful/storage-vue/collection/sorting"
import FieldSelection from "./FieldSelection.vue"
import { useRenderer } from "@typeful/model/recipes"

const props = defineProps({
  ctrl: {type: Object as PropType<SortController>, required: true},
})
const i18n = useI18n()
const render = useRenderer()

const addSorting = (field: FieldRef) => props.ctrl.toggleSort(field.path)

</script>

<template>
  <section class="list-option -sorting">
    <div class="section-heading">
      {{ i18n.t('storage.collection.section.sorting') }}
      <FieldSelection :fields="ctrl.availableFields" :pick="addSorting">
        <template v-slot:field="{field}">{{ render.refToStr(field) }}</template>
      </FieldSelection>
    </div>

    <div class="sort-rule" v-for="([prop, direction], i) in ctrl.entries">
      <div class="input-group input-group-sm">
        <span class="input-group-text">
          <span class="badge badge-light text-danger" @click="ctrl.remove(i)">&times;</span>
          <span>{{ render.refToStr(ctrl.getFieldRef(prop)) }}</span>
        </span>

        <div class="input-group-append">
          <button class="btn btn-outline-primary" @click="ctrl.toggleSort(prop)">{{ i18n.t('storage.collections.sortDirection.' + direction) }}</button>
        </div>
      </div>
    </div>
  </section>
</template>
