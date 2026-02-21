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
      <span class="font-mono text-[10px] text-blue-400">{{ (data.config.method as string) || 'GET' }}</span>
      <span class="truncate">{{ (data.config.url as string) || 'No URL' }}</span>
    </div>
  </BaseNode>
</template>
