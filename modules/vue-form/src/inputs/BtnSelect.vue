<script lang="ts" setup>
import { FormKitContext } from "@formkit/core";
import {computed, PropType} from "vue";

type Option = {value: string|number, label: string}
const props = defineProps({
  context: {type: Object as PropType<FormKitContext>, required: true},
})

const options = computed<Option[]>(() => {
  return (props.context as any).attrs?.options || []
})
function handleValue(value: any) {
  (props.context as any).node.input(value)
}

</script>

<template>
  <div class="btn-group btn-group-select">
    <label v-for="option in options" :key="option.value"
           :class="['btn', context.value === option.value ? 'btn-primary' : 'btn-light']">
      <input type="radio" :value="option.value"
             :checked="option.value === context.value" @input="handleValue(option.value)"
      />
      <span>{{ option.label }}</span>
    </label>
  </div>
</template>

<style lang="scss">
.btn-group-select {
  input[type=radio], input[type=checkbox] {
    display: none;
  }
  > label {
    margin-bottom: initial;
  }
}
</style>
