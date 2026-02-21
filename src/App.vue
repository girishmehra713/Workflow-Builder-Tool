<script setup lang="ts">
import { onMounted } from "vue";
import AppShell from "./components/Layout/AppShell.vue";
import { useKeyboardShortcuts } from "./composables/useKeyBoardShortcuts";
import { usePersistence } from "./composables/usePersistence";
useKeyboardShortcuts()

const { load, startAutoSave } = usePersistence()

onMounted(() => {
  load()
  startAutoSave()
})
</script>

<template>
  <AppShell />
</template>