<script setup lang="ts">
import { ref, watch, computed, toRaw } from 'vue'
import type { ZodObject, ZodRawShape } from 'zod'
import { schemaToFields } from '@/utils/schemaToFields'
import FieldText from './fields/FieldText.vue'
import FieldNumber from './fields/FieldNumber.vue'
import FieldSelect from './fields/FieldSelect.vue'
import FieldTextarea from './fields/FieldTextArea.vue'
import FieldCheckbox from './fields/FieldCheckbox.vue'
import FieldKeyValue from './fields/FieldKeyValue.vue'

const props = defineProps<{
  schema: ZodObject<ZodRawShape>
  modelValue: Record<string, unknown>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, unknown>]
  'update:isValid': [valid: boolean]
}>()

const fields = computed(() => schemaToFields(toRaw(props.schema)))
const formData = ref<Record<string, unknown>>({ ...props.modelValue })
const errors = ref<Record<string, string>>({})
let emitting = false

watch(() => props.modelValue, (val) => {
  if (emitting) return
  formData.value = { ...val }
  validate()
}, { deep: true })

watch(formData, () => {
  validate()
  emitting = true
  emit('update:modelValue', { ...formData.value })
  Promise.resolve().then(() => { emitting = false })
}, { deep: true })

function validate(): boolean {
  const result = toRaw(props.schema).safeParse(formData.value)
  if (result.success) {
    errors.value = {}
    emit('update:isValid', true)
    return true
  }
  const newErrors: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const path = issue.path.join('.')
    if (!newErrors[path]) {
      newErrors[path] = issue.message
    }
  }
  errors.value = newErrors
  emit('update:isValid', false)
  return false
}

function updateField(name: string, value: unknown) {
  formData.value[name] = value
}

function getFieldComponent(type: string) {
  switch (type) {
    case 'text': return FieldText
    case 'number': return FieldNumber
    case 'select': return FieldSelect
    case 'textarea': return FieldTextarea
    case 'checkbox': return FieldCheckbox
    case 'keyvalue': return FieldKeyValue
    default: return FieldText
  }
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <template v-for="field in fields" :key="field.name">
      <component :is="getFieldComponent(field.type)" :label="field.label"
        :model-value="formData[field.name] ?? field.defaultValue ?? (field.type === 'number' ? undefined : field.type === 'checkbox' ? false : field.type === 'keyvalue' ? {} : '')"
        :placeholder="field.placeholder" :description="field.description" :options="field.options"
        :error="errors[field.name]" :required="field.required" @update:model-value="updateField(field.name, $event)" />
    </template>
  </div>
</template>
