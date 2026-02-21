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
    <span>Click to trigger manually</span>
  </BaseNode>
</template>
