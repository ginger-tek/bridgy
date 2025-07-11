import { Chart } from '/nm/chart.js/auto'

export default {
  template: `<div class="chart-container">
    <canvas ref="chartRef"></canvas>
    <p v-if="!data.labels.length">No data available</p>
  </div>`,
  props: {
    data: {
      type: Object,
      default: () => ({
        labels: [],
        datasets: []
      })
    },
    type: {
      type: String,
      default: 'bar'
    },
    options: {
      type: Object,
      default: () => ({
        responsive: true,
        plugins: {}
      })
    }
  },
  setup() {
    const chartRef = Vue.ref(null)

    function initChart() {
      if (chartRef.value) {
        if (chartRef.value.chart)
          chartRef.value.chart.destroy()
        chartRef.value.chart = new Chart(chartRef.value, {
          type: 'bar', // Default type, can be overridden by props
          data: Vue.toRefs(this.data),
          options: Vue.toRefs(this.options)
        })
      }
    }

    Vue.watch(() => [this.data, this.options], () => {
      initChart()
    })

    return {
      initChart,
      chartRef
    }
  }
}