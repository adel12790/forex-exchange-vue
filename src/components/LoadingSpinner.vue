<template>
  <div class="flex flex-col items-center justify-center py-12">
    <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500"></div>
    <p v-if="message" class="mt-4 text-gray-600">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
type Props = {
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: 'Loading...'
})
</script>

