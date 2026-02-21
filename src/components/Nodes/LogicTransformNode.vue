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
    <span class="font-mono text-[10px]">{{ (data.config.expression as string) || 'No expression' }}</span>
  </BaseNode>
</template>
