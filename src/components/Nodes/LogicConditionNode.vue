<script setup lang="ts">
import BaseNode from './BaseNode.vue'

defineProps<{
  id: string
  data: {
    label: string
    nodeType: string
    config: Record<string, unknown>
    status?: string
  }
  selected?: boolean
}>()
</script>

<template>
  <BaseNode :id="id" :data="data" :selected="selected">
    <div class="flex flex-col gap-0.5">
      <span v-if="data.config.field">
        {{ data.config.field }} {{ data.config.operator }} {{ data.config.value }}
      </span>
      <span v-else>No condition set</span>
      <div class="flex justify-between text-[10px] mt-1">
        <span class="text-green-400">True</span>
        <span class="text-red-400">False</span>
      </div>
    </div>
  </BaseNode>
</template>
