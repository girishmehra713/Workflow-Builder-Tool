<script setup lang="ts">
defineProps<{
  label: string
  modelValue: boolean
  description?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <div class="flex items-start gap-2">
    <input type="checkbox" :checked="modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      class="mt-0.5 rounded border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
    <div>
      <label class="text-[11px] font-medium text-[var(--color-text)]">{{ label }}</label>
      <p v-if="description" class="text-[10px] text-[var(--color-text-muted)]">{{ description }}</p>
    </div>
  </div>
</template>
