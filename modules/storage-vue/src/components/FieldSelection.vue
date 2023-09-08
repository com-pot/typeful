<template>
  <Tippy trigger="mouseenter" interactive>
    <template #content>
      <div class="new-filter-fields">
        <a v-for="(field, i) in fields" :key="i" href="#" @click.prevent="pick(field)">
          <slot name="field" :field="field">{{ (field.ui?.label) }}</slot>
        </a>
      </div>
    </template>

    <template #default>
      <span class="badge badge-primary" :title="title">+</span>
    </template>
  </Tippy>
</template>

<script lang="ts">
import { FieldRef } from "@typeful/model/Model";
import {defineComponent, PropType} from "vue"
import {Tippy} from "vue-tippy"

export default defineComponent({
  components: {
    Tippy,
  },
  props: {
    fields: {type: Array as PropType<FieldRef[]>, required: true},
    pick: {type: Function, required: true},
    title: {type: String},
  },
})
</script>
