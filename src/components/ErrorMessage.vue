<template>
  <div class="bg-red-50 border border-red-200 rounded-lg p-4">
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <i class="pi pi-times-circle text-xl text-red-400"></i>
      </div>
      <div class="ml-3 flex-1">
        <h3 class="text-sm font-medium text-red-800">{{ title }}</h3>
        <div class="mt-2 text-sm text-red-700">
          <p>{{ message }}</p>
        </div>
        <div v-if="dismissible" class="mt-4">
          <button
            @click="$emit('dismiss')"
            class="text-sm font-medium text-red-800 hover:text-red-600"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Props = {
  title?: string
  message: string
  dismissible?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Error',
  dismissible: true
})

defineEmits<{
  dismiss: []
}>()
</script>

