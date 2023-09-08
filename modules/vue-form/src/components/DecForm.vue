<script lang="ts" setup>
import { provideModelInstanceRef, useActiveModel } from "@typeful/model-vue/useModel";
import {ref, watch} from "vue"

const props = defineProps({
  modelValue: {type: Object},
  onSubmit: {type: Function,},
  submitText: {type: String},
})

const internalModel = ref({})
const model = useActiveModel()

watch(() => props.modelValue, (modelValue) => {
  Object.keys((internalModel)).forEach((key) => delete internalModel[key as keyof typeof internalModel])
  if (!modelValue && model.value) {
    modelValue = model.value.setDefaults()
  }
  internalModel.value = modelValue || {}
}, {immediate: true})

provideModelInstanceRef(internalModel)

</script>

<template>
  <form @submit.prevent="onSubmit?.(internalModel)">
    <slot/>

    <div v-if="onSubmit" class="form-group text-center">
      <button class="btn btn-primary" type="submit">{{ submitText || 'Save' }}</button>
    </div>
  </form>
</template>
