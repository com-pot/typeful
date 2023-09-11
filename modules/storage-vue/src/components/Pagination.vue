<script lang="ts" setup>
import { computed, inject } from "vue";

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  // todo: rename to modelValue
  modelValue: { type: Number, required: true },
  maxPage: { type: Number, default: 1 },
  minPage: { type: Number, default: 1 },
  displayRange: { type: Number, default: 2 },
})

const prevDisabled = computed(() => props.modelValue <= props.minPage)
const nextDisabled = computed(() => props.modelValue >= props.maxPage)
const pageFromTarget = computed(() => props.modelValue - props.displayRange)
const pageToTarget = computed(() => props.modelValue + props.displayRange)
const targetLinkCount = computed(() => props.displayRange * 2 + 1)

const paginationi18n = inject("pagination:18nObj", null) as Record<string, string> | null

const pageFrom = computed(() => {
  const cappedTarget = Math.min(props.maxPage - targetLinkCount.value, pageFromTarget.value)
  return Math.max(props.minPage, cappedTarget)
})

const pageTo = computed(() => {
  const cappedTarget = Math.max(props.minPage + targetLinkCount.value, pageToTarget.value)
  return Math.min(props.maxPage, cappedTarget)
})
const visiblePages = computed(() => {
  const pages = Array.from({ length: pageTo.value + 1 - pageFrom.value })
    .map((_, i) => i + pageFrom.value)

  if (pageFrom.value > props.minPage) {
    pages.unshift(props.minPage)
  }
  if (pageTo.value < props.maxPage) {
    pages.push(props.maxPage)
  }

  return pages
})

function goTo(page: number) {
  emit('update:modelValue', page)
}

</script>
<template>
  <nav :aria-label="paginationi18n?.['title'] || 'Stránkování'">
    <ul class="pagination justify-content-center">
      <li :class="['page-item', prevDisabled && 'disabled']">
        <a class="page-link" :aria-label="paginationi18n?.['prev'] || 'Předcházející'"
           href="#" @click.prevent="goTo(modelValue - 1)"
        >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>

      <li v-for="pageNum in visiblePages"
        :class="['page-item', pageNum === modelValue && 'active']"
        :key="pageFrom + pageNum"
      >
        <a class="page-link" href="#" @click.prevent="goTo(pageNum)">{{ pageNum }}</a>
      </li>

      <li :class="['page-item', nextDisabled && 'disabled']">
        <a class="page-link" :aria-label="paginationi18n?.['next'] || 'Nadcházející'"
          href="#" @click.prevent="goTo(modelValue + 1)"
        >
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>
