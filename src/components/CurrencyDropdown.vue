<template>
  <Listbox v-model="selectedValue" @update:model-value="handleChange">
    <div class="relative">
      <ListboxButton
        class="relative w-full cursor-pointer rounded-lg bg-white py-3 pl-4 pr-10 text-left shadow-md hover:shadow-lg transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
      >
        <span class="flex items-center gap-3">
          <img
            v-if="selectedCurrencyFlag"
            :src="selectedCurrencyFlag"
            :alt="selectedValue"
            class="h-5 w-7 object-cover rounded"
            @error="handleImageError"
          />
          <span class="block truncate font-medium text-gray-900">{{ displayValue }}</span>
        </span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <i class="pi pi-chevron-down text-gray-400" aria-hidden="true"></i>
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <ListboxOption
            v-for="currency in currencies"
            :key="currency"
            v-slot="{ active, selected }"
            :value="currency"
            as="template"
          >
            <li
              :class="[
                active ? 'bg-primary-50 text-primary-900' : 'text-gray-900',
                'relative cursor-pointer select-none py-2.5 pl-4 pr-4'
              ]"
            >
              <span class="flex items-center gap-3">
                <img
                  :src="getFlagUrl(currency)"
                  :alt="currency"
                  class="h-5 w-7 object-cover rounded"
                  @error="handleImageError"
                />
                <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                  {{ getCurrencyDisplay(currency) }}
                </span>
              </span>
              <span
                v-if="selected"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-600"
              >
                <i class="pi pi-check" aria-hidden="true"></i>
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { useForexStore } from '../stores/forexStore'
import { getFlagUrl } from '../utils/currencyFlags'

type Props = {
  modelValue: string
  currencies: string[]
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const forexStore = useForexStore()

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})

const displayValue = computed(() => {
  return getCurrencyDisplay(props.modelValue)
})

const selectedCurrencyFlag = computed(() => {
  return getFlagUrl(props.modelValue)
})

function getCurrencyDisplay(currency: string): string {
  return forexStore.uniqueCurrencyNames[currency] || currency
}

function handleChange(value: string): void {
  emit('update:modelValue', value)
}

function handleImageError(event: Event): void {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}
</script>

