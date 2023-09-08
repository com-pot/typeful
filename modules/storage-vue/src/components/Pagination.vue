<template>

  <nav aria-label="Stránkování">
    <ul class="pagination justify-content-center">
      <li :class="['page-item', prevDisabled && 'disabled']">
        <a class="page-link" href="#" aria-label="Předcházející" @click.prevent="goTo(modelValue - 1)">
          <span aria-hidden="true">&laquo;</span>
          <span class="sr-only">Předcházející</span>
        </a>
      </li>

      <li class="page-item" v-if="pageFrom > minPage">
        <a href="#" class="page-link" @click="goTo(minPage)">1</a>
      </li>

      <li :class="['page-item', pageNum === modelValue && 'active']" v-for="pageNum in visiblePages" :key="pageFrom + pageNum">
        <a class="page-link" href="#"
           @click.prevent="goTo(pageNum)">{{ pageNum }}</a>
      </li>

      <li class="page-item" v-if="pageTo < maxPage">
        <a href="#" class="page-link" @click="goTo(maxPage)">{{ maxPage }}</a>
      </li>

      <li :class="['page-item', nextDisabled && 'disabled']">
        <a class="page-link" href="#" aria-label="Nadcházející" @click.prevent="goTo(modelValue + 1)">
          <span aria-hidden="true">&raquo;</span>
          <span class="sr-only">Nadcházející</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
import {computed} from "vue";

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  // todo: rename to modelValue
  modelValue: {type: Number, required: true},
  maxPage: {type: Number, default: 1},
  minPage: {type: Number, default: 1},
  displayRange: {type: Number, default: 2},
})

const prevDisabled = computed(() => props.modelValue <= props.minPage)
const nextDisabled = computed(() => props.modelValue >= props.maxPage)
const pageFromTarget = computed(() => props.modelValue - props.displayRange)
const pageToTarget = computed(() => props.modelValue + props.displayRange)
const targetLinkCount = computed(() => props.displayRange * 2 + 1)

const pageFrom = computed(() => {
  const cappedTarget = Math.min(props.maxPage - targetLinkCount.value, pageFromTarget.value)
  return Math.max(props.minPage, cappedTarget)
})

const pageTo = computed(() => {
  const cappedTarget = Math.max(props.minPage + targetLinkCount.value, pageToTarget.value)
  return Math.min(props.maxPage, cappedTarget)
})
const visiblePages = computed(() => {
  return Array.from({length: pageTo.value + 1 - pageFrom.value})
    .map((_, i) => i + pageFrom.value)
})

function goTo(page: number) {
  emit('update:modelValue', page)
}

</script>
