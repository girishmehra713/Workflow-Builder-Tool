<script setup lang="ts">
defineProps<{
  label: string
  modelValue: string
  options: { label: string; value: string }[]
  error?: string
  required?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <label class="text-[11px] font-medium text-[var(--color-text-muted)]">
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </label>
    <select :value="modelValue" @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      class="w-full px-2.5 py-1.5 text-xs rounded-md border bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-colors"
      :class="error ? 'border-red-500' : 'border-[var(--color-border)]'">
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
    <span v-if="error" class="text-[10px] text-red-400">{{ error }}</span>
  </div>
</template>
