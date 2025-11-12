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
          <span class="flex items-baseline gap-2">
            <span class="font-bold text-lg text-gray-900">{{ selectedValue }}</span>
            <span class="text-sm text-gray-500">{{ displayValue }}</span>
          </span>
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
          class="absolute z-10 mt-1 max-h-80 w-full rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div class="sticky top-0 z-10 bg-white p-2 border-b border-gray-200">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search currency..."
                class="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                @click.stop
                @keydown.stop
              />
              <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
            </div>
          </div>
          <div class="max-h-52 overflow-auto py-1">
            <ListboxOption
              v-for="currency in filteredCurrencies"
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
                <span class="flex items-baseline gap-2">
                  <span :class="[selected ? 'font-bold' : 'font-semibold', 'text-base']">
                    {{ currency }}
                  </span>
                  <span class="text-sm text-gray-500">
                    {{ getCurrencyDisplay(currency) }}
                  </span>
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
          <div v-if="filteredCurrencies.length === 0" class="px-4 py-3 text-sm text-gray-500">
            No currencies found
          </div>
          </div>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
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

const searchQuery = ref('')

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

const filteredCurrencies = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.currencies
  }
  
  const query = searchQuery.value.toLowerCase()
  return props.currencies.filter(currency => {
    const currencyCode = currency.toLowerCase()
    const currencyName = getCurrencyDisplay(currency).toLowerCase()
    return currencyCode.includes(query) || currencyName.includes(query)
  })
})

function getCurrencyDisplay(currency: string): string {
  return forexStore.uniqueCurrencyNames[currency] || currency
}

function handleChange(value: string): void {
  emit('update:modelValue', value)
  searchQuery.value = ''
}

function handleImageError(event: Event): void {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}
</script>

