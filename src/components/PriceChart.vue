<template>
  <div class="chart-container">
    <div ref="chartContainer" class="w-full h-full"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { createChart, type IChartApi, type ISeriesApi, type UTCTimestamp } from 'lightweight-charts'
import type { MassiveAggregate } from '../types'

type ChartDataPoint = {
  time: UTCTimestamp
  value: number
}

type Props = {
  data: MassiveAggregate[]
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 400
})

const chartContainer = ref<HTMLElement | null>(null)
let chart: IChartApi | null = null
let areaSeries: ISeriesApi<'Area'> | null = null
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  initChart()
  setupResizeObserver()
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  if (chart) {
    chart.remove()
  }
})

watch(() => props.data, () => {
  updateChartData()
}, { deep: true })

function initChart(): void {
  if (!chartContainer.value) return

  chart = createChart(chartContainer.value, {
    width: chartContainer.value.clientWidth,
    height: props.height,
    layout: {
      background: { color: 'transparent' },
      textColor: '#6b7280',
    },
    grid: {
      vertLines: { color: '#f3f4f6' },
      horzLines: { color: '#f3f4f6' },
    },
    crosshair: {
      mode: 1,
      vertLine: {
        width: 1,
        color: '#9CA3AF',
        style: 3,
      },
      horzLine: {
        width: 1,
        color: '#9CA3AF',
        style: 3,
      },
    },
    rightPriceScale: {
      borderColor: '#e5e7eb',
    },
    timeScale: {
      borderColor: '#e5e7eb',
      timeVisible: true,
      secondsVisible: false,
    },
    handleScroll: {
      mouseWheel: true,
      pressedMouseMove: true,
    },
    handleScale: {
      axisPressedMouseMove: true,
      mouseWheel: true,
      pinch: true,
    },
  })

  areaSeries = chart.addAreaSeries({
    topColor: 'rgba(34, 197, 94, 0.4)',
    bottomColor: 'rgba(34, 197, 94, 0.0)',
    lineColor: 'rgba(34, 197, 94, 1)',
    lineWidth: 2,
    priceLineVisible: false,
    crosshairMarkerVisible: true,
    crosshairMarkerRadius: 4,
    crosshairMarkerBorderColor: 'rgba(34, 197, 94, 1)',
    crosshairMarkerBackgroundColor: '#ffffff',
  })

  updateChartData()
}

function updateChartData(): void {
  if (!areaSeries || !props.data || props.data.length === 0) return

  try {
    // Convert API data to chart format
    const chartData: ChartDataPoint[] = props.data.map(item => ({
      time: Math.floor(item.t / 1000) as UTCTimestamp,
      value: item.c
    }))

    chartData.sort((a, b) => a.time - b.time)

    areaSeries.setData(chartData)
    
    nextTick(() => {
      if (chart) {
        chart.timeScale().fitContent()
      }
    })
  } catch (error) {
    console.error('Error updating chart data:', error)
  }
}

function setupResizeObserver(): void {
  if (!chartContainer.value) return

  resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
    if (!entries || entries.length === 0 || !chart) return
    
    const { width } = entries[0].contentRect
    chart.applyOptions({ width })
  })

  resizeObserver.observe(chartContainer.value)
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
  position: relative;
}
</style>

