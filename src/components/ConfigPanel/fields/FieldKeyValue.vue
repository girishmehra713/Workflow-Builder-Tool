<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  label: string
  modelValue: Record<string, string>
  error?: string
  required?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, string>]
}>()

interface KVPair {
  key: string
  value: string
}

const pairs = ref<KVPair[]>(toPairs(props.modelValue))

function toPairs(obj: Record<string, string>): KVPair[] {
  const entries = Object.entries(obj || {})
  return entries.length > 0 ? entries.map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }]
}

watch(() => props.modelValue, (val) => {
  pairs.value = toPairs(val)
}, { deep: true })

function emitUpdate() {
  const result: Record<string, string> = {}
  for (const pair of pairs.value) {
    if (pair.key.trim()) {
      result[pair.key.trim()] = pair.value
    }
  }
  emit('update:modelValue', result)
}

function addPair() {
  pairs.value.push({ key: '', value: '' })
}

function removePair(index: number) {
  pairs.value.splice(index, 1)
  if (pairs.value.length === 0) {
    pairs.value.push({ key: '', value: '' })
  }
  emitUpdate()
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <label class="text-[11px] font-medium text-[var(--color-text-muted)]">
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </label>
    <div class="flex flex-col gap-1.5">
      <div v-for="(pair, i) in pairs" :key="i" class="flex gap-1 items-center">
        <input v-model="pair.key" @input="emitUpdate" placeholder="Key"
          class="flex-1 px-2 py-1 text-xs rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
        <input v-model="pair.value" @input="emitUpdate" placeholder="Value"
          class="flex-1 px-2 py-1 text-xs rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
        <button @click="removePair(i)"
          class="text-[var(--color-text-muted)] hover:text-red-400 text-xs px-1 transition-colors" title="Remove">
          ×
        </button>
      </div>
    </div>
    <button @click="addPair"
      class="self-start text-[10px] text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors">
      + Add pair
    </button>
    <span v-if="error" class="text-[10px] text-red-400">{{ error }}</span>
  </div>
</template>
